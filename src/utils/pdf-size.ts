import { ptToMm } from './unit'

export const formatPtAsMm = (wPt: number, hPt: number) =>
  `${ptToMm(wPt).toFixed(1)} × ${ptToMm(hPt).toFixed(1)} mm`

export const toPaperLabel = (wPt: number, hPt: number) => {
  const w = ptToMm(wPt)
  const h = ptToMm(hPt)
  if (Math.abs(w - 210) < 1 && Math.abs(h - 297) < 1) return 'A4'
  if (Math.abs(w - 297) < 1 && Math.abs(h - 420) < 1) return 'A3'
  if (Math.abs(w - 148) < 1 && Math.abs(h - 210) < 1) return 'A5'
  return 'Custom'
}
