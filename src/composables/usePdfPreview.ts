import { ref } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

export const usePdfPreview = () => {
  const previewLoading = ref(false)
  const previewError = ref('')

  const renderPagePreview = async (
    fileBuffer: ArrayBuffer,
    pageNumber: number,
    width = 760,
  ): Promise<string> => {
    previewLoading.value = true
    previewError.value = ''
    try {
      const doc = await pdfjsLib.getDocument({ data: fileBuffer.slice(0) }).promise
      const page = await doc.getPage(pageNumber)
      const viewport = page.getViewport({ scale: 1 })
      const scale = width / viewport.width
      const scaled = page.getViewport({ scale })
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context unavailable')
      canvas.width = scaled.width
      canvas.height = scaled.height
      await page.render({ canvasContext: ctx, viewport: scaled }).promise
      return canvas.toDataURL('image/jpeg', 0.92)
    } catch (error) {
      previewError.value = error instanceof Error ? error.message : 'Preview failed'
      throw error
    } finally {
      previewLoading.value = false
    }
  }

  return {
    previewLoading,
    previewError,
    renderPagePreview,
  }
}
