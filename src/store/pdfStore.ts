import { reactive } from 'vue'
import type { PdfDocument, PdfPageInfo } from '../types/pdf'
import type { PageSetting, PageOverride } from '../types/page-setting'
import { PRESET_SIZES, DEFAULT_PRESET_KEY } from '../constants/preset-sizes'
import { mmToPt } from '../utils/unit'
import { applyOrientation } from '../utils/page-layout'

const defaultPreset = PRESET_SIZES.find(p => p.key === DEFAULT_PRESET_KEY)!

function makeDefaultGlobal(): PageSetting {
  return {
    presetKey: DEFAULT_PRESET_KEY,
    widthPt: mmToPt(defaultPreset.widthMm),
    heightPt: mmToPt(defaultPreset.heightMm),
    unit: 'mm',
    orientation: 'follow',
    mode: 'fit_center',
    marginPt: 0,
  }
}

export const pdfStore = reactive({
  document: null as PdfDocument | null,
  isLoading: false,
  loadError: null as string | null,
  isExporting: false,
  exportError: null as string | null,
  selectedPageIndex: 0,
  globalSettings: makeDefaultGlobal(),
  pageOverrides: [] as PageOverride[],

  get currentPage(): PdfPageInfo | null {
    if (!this.document) return null
    return this.document.pages[this.selectedPageIndex] ?? null
  },

  get currentPageOverride(): PageOverride | null {
    return this.pageOverrides[this.selectedPageIndex] ?? null
  },

  initPages() {
    if (!this.document) return
    this.pageOverrides = this.document.pages.map(() => ({
      inheritGlobal: true,
      setting: { ...this.globalSettings },
    }))
  },

  applyGlobalToAll() {
    this.pageOverrides = this.pageOverrides.map(() => ({
      inheritGlobal: true,
      setting: { ...this.globalSettings },
    }))
  },

  resolvedSettingForPage(index: number): PageSetting {
    const override = this.pageOverrides[index]
    const page = this.document?.pages[index]
    if (!override || !page) return this.globalSettings

    const base = override.inheritGlobal ? this.globalSettings : override.setting
    const { width, height } = applyOrientation(
      base.widthPt,
      base.heightPt,
      base.orientation,
      page.originalWidthPt,
      page.originalHeightPt
    )
    return { ...base, widthPt: width, heightPt: height }
  },

  setPageInherit(index: number, inherit: boolean) {
    const override = this.pageOverrides[index]
    if (override) {
      override.inheritGlobal = inherit
      if (!inherit) {
        override.setting = { ...this.globalSettings }
      }
    }
  },

  updatePageSetting(index: number, updates: Partial<PageSetting>) {
    const override = this.pageOverrides[index]
    if (override) {
      override.inheritGlobal = false
      Object.assign(override.setting, updates)
    }
  },

  reset() {
    this.document = null
    this.isLoading = false
    this.loadError = null
    this.isExporting = false
    this.exportError = null
    this.selectedPageIndex = 0
    this.globalSettings = makeDefaultGlobal()
    this.pageOverrides = []
  }
})
