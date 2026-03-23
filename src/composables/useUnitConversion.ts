import { ref } from 'vue'
import type { SizeUnit } from '../types/page-setting'
import { fromPt, toPt } from '../utils/unit'

export function useUnitConversion() {
  const unit = ref<SizeUnit>('mm')

  function displayValue(pt: number): number {
    return parseFloat(fromPt(pt, unit.value).toFixed(3))
  }

  function toPoints(value: number): number {
    return toPt(value, unit.value)
  }

  return { unit, displayValue, toPoints }
}
