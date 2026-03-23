import { pdfStore } from '../store/pdfStore'
import { PRESET_SIZES } from '../constants/preset-sizes'
import { mmToPt } from '../utils/unit'

export function usePageSettings() {
  function applyPresetToGlobal(presetKey: string) {
    const preset = PRESET_SIZES.find(p => p.key === presetKey)
    if (preset && preset.key !== 'custom') {
      pdfStore.globalSettings.presetKey = presetKey
      pdfStore.globalSettings.widthPt = mmToPt(preset.widthMm)
      pdfStore.globalSettings.heightPt = mmToPt(preset.heightMm)
    } else {
      pdfStore.globalSettings.presetKey = presetKey
    }
  }

  function applyPresetToPage(index: number, presetKey: string) {
    const preset = PRESET_SIZES.find(p => p.key === presetKey)
    const override = pdfStore.pageOverrides[index]
    if (!override) return
    override.inheritGlobal = false
    if (preset && preset.key !== 'custom') {
      override.setting.presetKey = presetKey
      override.setting.widthPt = mmToPt(preset.widthMm)
      override.setting.heightPt = mmToPt(preset.heightMm)
    } else {
      override.setting.presetKey = presetKey
    }
  }

  return { applyPresetToGlobal, applyPresetToPage }
}
