import { ref } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { PdfDocumentState, PdfPageMeta } from '../types/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const renderThumbnail = async (doc: PDFDocumentProxy, pageNumber: number): Promise<PdfPageMeta> => {
  const page = await doc.getPage(pageNumber)
  const viewport = page.getViewport({ scale: 1 })
  const thumbScale = Math.min(160 / viewport.width, 220 / viewport.height)
  const thumbViewport = page.getViewport({ scale: thumbScale })

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Failed to create canvas context')

  canvas.width = thumbViewport.width
  canvas.height = thumbViewport.height

  await page.render({ canvasContext: context, viewport: thumbViewport }).promise

  return {
    pageNumber,
    originalWidthPt: viewport.width,
    originalHeightPt: viewport.height,
    originalRotation: page.rotate,
    thumbnailDataUrl: canvas.toDataURL('image/jpeg', 0.8),
  }
}

export const usePdfLoader = () => {
  const loading = ref(false)
  const error = ref('')

  const loadPdf = async (file: File): Promise<PdfDocumentState> => {
    loading.value = true
    error.value = ''
    try {
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are supported.')
      }

      const fileBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer })
      const document = await loadingTask.promise
      const pages: PdfPageMeta[] = []

      for (let i = 1; i <= document.numPages; i += 1) {
        pages.push(await renderThumbnail(document, i))
      }

      return {
        file,
        fileBuffer,
        filename: file.name,
        filesize: file.size,
        pageCount: document.numPages,
        pages,
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to parse PDF file.'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    loadPdf,
  }
}
