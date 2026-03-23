import { PAGE_SIZE_PRESETS } from '../constants/preset-sizes'
import type { PresetKey } from '../types/preset'

export const getPresetByKey = (key: PresetKey) =>
  PAGE_SIZE_PRESETS.find((item) => item.key === key) ?? PAGE_SIZE_PRESETS[1]
