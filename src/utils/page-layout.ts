import type { FitMode } from '../types/page-setting'

export interface LayoutInput {
  sourceWidth: number
  sourceHeight: number
  targetWidth: number
  targetHeight: number
  margin: number
  mode: FitMode
}

export interface LayoutOutput {
  width: number
  height: number
  x: number
  y: number
}

export const computePlacement = ({
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
  margin,
  mode,
}: LayoutInput): LayoutOutput => {
  const innerW = Math.max(targetWidth - margin * 2, 1)
  const innerH = Math.max(targetHeight - margin * 2, 1)

  if (mode === 'keep_original') {
    return {
      width: sourceWidth,
      height: sourceHeight,
      x: margin,
      y: margin,
    }
  }

  const fitScale = Math.min(innerW / sourceWidth, innerH / sourceHeight)
  const fillScale = Math.max(innerW / sourceWidth, innerH / sourceHeight)
  const scale = mode === 'fill_crop' ? fillScale : fitScale

  const width = sourceWidth * scale
  const height = sourceHeight * scale
  const x = margin + (innerW - width) / 2

  if (mode === 'fit_top') {
    return {
      width,
      height,
      x,
      y: targetHeight - margin - height,
    }
  }

  return {
    width,
    height,
    x,
    y: margin + (innerH - height) / 2,
  }
}
