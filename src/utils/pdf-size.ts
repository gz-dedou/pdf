import { ptToMm } from './unit'

export function guessPaperName(widthPt: number, heightPt: number): string {
  const wMm = ptToMm(widthPt)
  const hMm = ptToMm(heightPt)
  const wMin = Math.min(wMm, hMm)
  const hMax = Math.max(wMm, hMm)

  const matches: Array<{ name: string; w: number; h: number }> = [
    { name: 'A3', w: 297, h: 420 },
    { name: 'A4', w: 210, h: 297 },
    { name: 'A5', w: 148, h: 210 },
    { name: 'B5', w: 176, h: 250 },
    { name: 'Letter', w: 215.9, h: 279.4 },
    { name: 'Legal', w: 215.9, h: 355.6 },
    { name: 'Tabloid', w: 279.4, h: 431.8 },
    { name: 'Executive', w: 184.1, h: 266.7 },
  ]

  const TOLERANCE = 2

  for (const m of matches) {
    if (Math.abs(m.w - wMin) < TOLERANCE && Math.abs(m.h - hMax) < TOLERANCE) {
      return m.name
    }
  }

  return `${wMm.toFixed(0)}×${hMm.toFixed(0)} mm`
}
