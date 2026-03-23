import * as pdfjsLib from 'pdfjs-dist'
import { ref, watch } from 'vue'
import { pdfStore } from '../store/pdfStore'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export function usePdfPreview() {
  const previewDataUrl = ref<string | null>(null)
  const isGeneratingPreview = ref(false)

  async function generatePreview(file: File, pageIndex: number): Promise<void> {
    isGeneratingPreview.value = true

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const page = await pdfDoc.getPage(pageIndex + 1)
      const viewport = page.getViewport({ scale: 1.5 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport }).promise
      previewDataUrl.value = canvas.toDataURL('image/png')
    } catch (err) {
      console.error('Preview generation failed:', err)
    } finally {
      isGeneratingPreview.value = false
    }
  }

  watch(
    () => pdfStore.selectedPageIndex,
    () => { previewDataUrl.value = null }
  )

  return { previewDataUrl, isGeneratingPreview, generatePreview }
}
