import * as pdfjsLib from 'pdfjs-dist'
import { pdfStore } from '../store/pdfStore'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const THUMBNAIL_WIDTH = 200

export function usePdfLoader() {
  async function loadPdf(file: File): Promise<void> {
    pdfStore.isLoading = true
    pdfStore.loadError = null
    pdfStore.document = null

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const totalPages = pdfDoc.numPages
      const pages = []

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i)
        const viewport = page.getViewport({ scale: 1 })

        const scale = THUMBNAIL_WIDTH / viewport.width
        const thumbViewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = thumbViewport.width
        canvas.height = thumbViewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport: thumbViewport }).promise
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.7)

        pages.push({
          pageNumber: i,
          originalWidthPt: viewport.width,
          originalHeightPt: viewport.height,
          originalRotation: page.rotate,
          thumbnailDataUrl,
        })
      }

      pdfStore.document = {
        filename: file.name,
        fileSize: file.size,
        totalPages,
        pages,
      }
      pdfStore.selectedPageIndex = 0
      pdfStore.initPages()
    } catch (err) {
      pdfStore.loadError = 'Failed to load PDF. Please make sure the file is a valid PDF.'
      console.error(err)
    } finally {
      pdfStore.isLoading = false
    }
  }

  return { loadPdf }
}
