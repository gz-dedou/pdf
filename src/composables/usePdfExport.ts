import { PDFDocument } from 'pdf-lib'
import { pdfStore } from '../store/pdfStore'
import { computeContentTransform } from '../utils/page-layout'
import { buildOutputFilename } from '../utils/filename'

export function usePdfExport() {
  async function exportPdf(originalFile: File): Promise<void> {
    if (!pdfStore.document) return

    pdfStore.isExporting = true
    pdfStore.exportError = null

    try {
      const originalBytes = await originalFile.arrayBuffer()
      const srcDoc = await PDFDocument.load(originalBytes)
      const outDoc = await PDFDocument.create()

      const totalPages = pdfStore.document.totalPages

      for (let i = 0; i < totalPages; i++) {
        const pageInfo = pdfStore.document.pages[i]!
        const resolved = pdfStore.resolvedSettingForPage(i)

        const targetW = resolved.widthPt
        const targetH = resolved.heightPt
        const srcW = pageInfo.originalWidthPt
        const srcH = pageInfo.originalHeightPt

        const [embeddedPage] = await outDoc.embedPages([srcDoc.getPage(i)])

        const newPage = outDoc.addPage([targetW, targetH])

        const transform = computeContentTransform({
          targetWidthPt: targetW,
          targetHeightPt: targetH,
          sourceWidthPt: srcW,
          sourceHeightPt: srcH,
          marginPt: resolved.marginPt,
          mode: resolved.mode,
        })

        newPage.drawPage(embeddedPage, {
          x: transform.translateX,
          y: transform.translateY,
          width: srcW * transform.scaleX,
          height: srcH * transform.scaleY,
        })
      }

      const pdfBytes = await outDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = buildOutputFilename(pdfStore.document.filename)
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      pdfStore.exportError = 'Export failed. Please try again.'
      console.error(err)
    } finally {
      pdfStore.isExporting = false
    }
  }

  return { exportPdf }
}
