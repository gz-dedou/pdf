import { computed, reactive } from 'vue'
import { getPresetByKey } from '../utils/preset-sizes'
import { mmToPt, toPt } from '../utils/unit'
import type { PresetKey } from '../types/preset'
import type {
  OrientationMode,
  PageOverrideState,
  ResolvedPageSettings,
  UserPageSettings,
} from '../types/page-setting'
import type { PdfPageMeta } from '../types/pdf'

export const createDefaultSettings = (): UserPageSettings => ({
  presetKey: 'A4',
  width: 210,
  height: 297,
  unit: 'mm',
  orientation: 'follow_original',
  mode: 'fit_center',
  margin: 0,
})

const orient = (widthPt: number, heightPt: number, mode: OrientationMode, originalLandscape: boolean) => {
  if (mode === 'follow_original') {
    return originalLandscape
      ? [Math.max(widthPt, heightPt), Math.min(widthPt, heightPt)]
      : [Math.min(widthPt, heightPt), Math.max(widthPt, heightPt)]
  }

  if (mode === 'portrait') return [Math.min(widthPt, heightPt), Math.max(widthPt, heightPt)]
  return [Math.max(widthPt, heightPt), Math.min(widthPt, heightPt)]
}

export const usePageSettings = (pages: () => PdfPageMeta[]) => {
  const globalSettings = reactive<UserPageSettings>(createDefaultSettings())
  const pageOverrides = reactive<Record<number, PageOverrideState>>({})

  const initOverrides = () => {
    Object.keys(pageOverrides).forEach((key) => delete pageOverrides[Number(key)])
    pages().forEach((page) => {
      pageOverrides[page.pageNumber] = {
        inheritGlobal: true,
        overrideSettings: null,
      }
    })
  }

  const applyPreset = (target: UserPageSettings, presetKey: PresetKey) => {
    target.presetKey = presetKey
    if (presetKey === 'Custom') return
    const preset = getPresetByKey(presetKey)
    target.width = preset.widthMm
    target.height = preset.heightMm
    target.unit = 'mm'
  }

  const ensureOverride = (pageNumber: number) => {
    const state = pageOverrides[pageNumber]
    if (!state || !state.overrideSettings) {
      pageOverrides[pageNumber] = {
        inheritGlobal: false,
        overrideSettings: { ...globalSettings },
      }
      return
    }
    state.inheritGlobal = false
  }

  const inheritPage = (pageNumber: number) => {
    const state = pageOverrides[pageNumber]
    if (!state) return
    state.inheritGlobal = true
    state.overrideSettings = null
  }

  const resolveForPage = (page: PdfPageMeta): ResolvedPageSettings => {
    const pageState = pageOverrides[page.pageNumber]
    const active = pageState?.inheritGlobal === false && pageState.overrideSettings ? pageState.overrideSettings : globalSettings

    let widthPt = toPt(active.width, active.unit)
    let heightPt = toPt(active.height, active.unit)
    const originalLandscape = page.originalWidthPt > page.originalHeightPt

    ;[widthPt, heightPt] = orient(widthPt, heightPt, active.orientation, originalLandscape)

    return {
      widthPt,
      heightPt,
      orientation: active.orientation,
      mode: active.mode,
      marginPt: mmToPt(active.margin),
      presetKey: active.presetKey,
    }
  }

  const resolvedSettings = computed(() =>
    pages().map((page) => ({ pageNumber: page.pageNumber, settings: resolveForPage(page) })),
  )

  return {
    globalSettings,
    pageOverrides,
    resolvedSettings,
    initOverrides,
    applyPreset,
    ensureOverride,
    inheritPage,
    resolveForPage,
  }
}
