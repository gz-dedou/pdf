import type { PageSizePreset } from '../types/preset'

export const PAGE_SIZE_PRESETS: PageSizePreset[] = [
  { key: 'A3', label: 'A3', widthMm: 297, heightMm: 420 },
  { key: 'A4', label: 'A4', widthMm: 210, heightMm: 297 },
  { key: 'A5', label: 'A5', widthMm: 148, heightMm: 210 },
  { key: 'B5', label: 'B5', widthMm: 176, heightMm: 250 },
  { key: 'Letter', label: 'Letter', widthMm: 215.9, heightMm: 279.4 },
  { key: 'Legal', label: 'Legal', widthMm: 215.9, heightMm: 355.6 },
  { key: 'Tabloid', label: 'Tabloid', widthMm: 279.4, heightMm: 431.8 },
  { key: 'Executive', label: 'Executive', widthMm: 184.2, heightMm: 266.7 },
  { key: '10x14', label: '10 x 14', widthMm: 254, heightMm: 355.6 },
  { key: 'Custom', label: 'Custom', widthMm: 210, heightMm: 297 },
]
