import type { PresetKey, Unit } from './preset'

export type OrientationMode = 'follow_original' | 'portrait' | 'landscape'
export type FitMode = 'fit_center' | 'fit_top' | 'fill_crop' | 'keep_original'

export interface UserPageSettings {
  presetKey: PresetKey
  width: number
  height: number
  unit: Unit
  orientation: OrientationMode
  mode: FitMode
  margin: number
}

export interface PageOverrideState {
  inheritGlobal: boolean
  overrideSettings: UserPageSettings | null
}

export interface ResolvedPageSettings {
  widthPt: number
  heightPt: number
  orientation: OrientationMode
  mode: FitMode
  marginPt: number
  presetKey: PresetKey
}
