export type Orientation = 'follow' | 'portrait' | 'landscape'
export type FitMode = 'fit_center' | 'fit_top' | 'fill_crop' | 'keep_original'
export type SizeUnit = 'mm' | 'in' | 'pt'

export interface PageSetting {
  presetKey: string
  widthPt: number
  heightPt: number
  unit: SizeUnit
  orientation: Orientation
  mode: FitMode
  marginPt: number
}

export interface PageOverride {
  inheritGlobal: boolean
  setting: PageSetting
}
