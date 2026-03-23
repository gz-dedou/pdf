import { ref } from 'vue'
import { PDFDocument } from 'pdf-lib'
import { computePlacement } from '../utils/page-layout'
import { buildExportFilename } from '../utils/filename'
import type { PdfDocumentState } from '../types/pdf'
import type { ResolvedPageSettings } from '../types/page-setting'

export const usePdfExport = () => {
  const exporting = ref(false)
  const progress = ref(0)
  const exportError = ref('')

  const exportPdf = async (
    pdfState: PdfDocumentState,
    resolvedSettings: Array<{ pageNumber: number; settings: ResolvedPageSettings }>,
  ) => {
    exporting.value = true
    exportError.value = ''
    progress.value = 0

    try {
      const srcDoc = await PDFDocument.load(pdfState.fileBuffer.slice(0))
      const outDoc = await PDFDocument.create()
      const pages = srcDoc.getPages()

      for (let i = 0; i < pages.length; i += 1) {
        const sourcePage = pages[i]
        const resolved = resolvedSettings[i].settings

        const [embeddedPage] = await outDoc.embedPages([sourcePage])
        const targetPage = outDoc.addPage([resolved.widthPt, resolved.heightPt])
        const placement = computePlacement({
          sourceWidth: sourcePage.getWidth(),
          sourceHeight: sourcePage.getHeight(),
          targetWidth: resolved.widthPt,
          targetHeight: resolved.heightPt,
          margin: resolved.marginPt,
          mode: resolved.mode,
        })

        targetPage.drawPage(embeddedPage, placement)
        progress.value = Math.round(((i + 1) / pages.length) * 100)
      }

      const bytes = await outDoc.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = buildExportFilename(pdfState.filename)
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      exportError.value = error instanceof Error ? error.message : 'Export failed'
      throw error
    } finally {
      exporting.value = false
    }
  }

  return {
    exporting,
    progress,
    exportError,
    exportPdf,
  }
}
