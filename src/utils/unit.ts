import type { Unit } from '../types/preset'

const PT_PER_IN = 72
const MM_PER_IN = 25.4

export const mmToPt = (mm: number) => (mm / MM_PER_IN) * PT_PER_IN
export const inToPt = (inch: number) => inch * PT_PER_IN
export const ptToMm = (pt: number) => (pt / PT_PER_IN) * MM_PER_IN
export const ptToIn = (pt: number) => pt / PT_PER_IN

export const toPt = (value: number, unit: Unit): number => {
  if (unit === 'mm') return mmToPt(value)
  if (unit === 'in') return inToPt(value)
  return value
}

export const fromPt = (valuePt: number, unit: Unit): number => {
  if (unit === 'mm') return ptToMm(valuePt)
  if (unit === 'in') return ptToIn(valuePt)
  return valuePt
}
