import type { PresetSize } from '../types/preset'

export const PRESET_SIZES: PresetSize[] = [
  { key: 'a3', label: 'A3', widthMm: 297, heightMm: 420 },
  { key: 'a4', label: 'A4', widthMm: 210, heightMm: 297 },
  { key: 'a5', label: 'A5', widthMm: 148, heightMm: 210 },
  { key: 'b5', label: 'B5', widthMm: 176, heightMm: 250 },
  { key: 'letter', label: 'Letter', widthMm: 215.9, heightMm: 279.4 },
  { key: 'legal', label: 'Legal', widthMm: 215.9, heightMm: 355.6 },
  { key: 'tabloid', label: 'Tabloid', widthMm: 279.4, heightMm: 431.8 },
  { key: 'executive', label: 'Executive', widthMm: 184.1, heightMm: 266.7 },
  { key: '10x14', label: '10 × 14', widthMm: 254, heightMm: 355.6 },
  { key: 'custom', label: 'Custom', widthMm: 210, heightMm: 297 },
]

export const DEFAULT_PRESET_KEY = 'a4'
