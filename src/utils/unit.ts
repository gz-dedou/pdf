const PT_PER_INCH = 72
const MM_PER_INCH = 25.4

export function mmToPt(mm: number): number {
  return (mm / MM_PER_INCH) * PT_PER_INCH
}

export function inToPt(inches: number): number {
  return inches * PT_PER_INCH
}

export function ptToMm(pt: number): number {
  return (pt / PT_PER_INCH) * MM_PER_INCH
}

export function ptToIn(pt: number): number {
  return pt / PT_PER_INCH
}

export function toPt(value: number, unit: 'mm' | 'in' | 'pt'): number {
  if (unit === 'mm') return mmToPt(value)
  if (unit === 'in') return inToPt(value)
  return value
}

export function fromPt(valuePt: number, unit: 'mm' | 'in' | 'pt'): number {
  if (unit === 'mm') return ptToMm(valuePt)
  if (unit === 'in') return ptToIn(valuePt)
  return valuePt
}
