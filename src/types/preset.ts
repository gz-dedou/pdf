export type Unit = 'mm' | 'in' | 'pt'

export type PresetKey =
  | 'A3'
  | 'A4'
  | 'A5'
  | 'B5'
  | 'Letter'
  | 'Legal'
  | 'Tabloid'
  | 'Executive'
  | '10x14'
  | 'Custom'

export interface PageSizePreset {
  key: PresetKey
  label: string
  widthMm: number
  heightMm: number
}
