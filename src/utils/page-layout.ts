import type { FitMode, Orientation } from '../types/page-setting'

export interface LayoutParams {
  targetWidthPt: number
  targetHeightPt: number
  sourceWidthPt: number
  sourceHeightPt: number
  marginPt: number
  mode: FitMode
}

export interface ContentTransform {
  scaleX: number
  scaleY: number
  translateX: number
  translateY: number
}

export function computeContentTransform(params: LayoutParams): ContentTransform {
  const { targetWidthPt, targetHeightPt, sourceWidthPt, sourceHeightPt, marginPt, mode } = params

  const availWidth = targetWidthPt - marginPt * 2
  const availHeight = targetHeightPt - marginPt * 2

  if (mode === 'keep_original') {
    return { scaleX: 1, scaleY: 1, translateX: marginPt, translateY: marginPt }
  }

  const scaleX = availWidth / sourceWidthPt
  const scaleY = availHeight / sourceHeightPt

  if (mode === 'fit_center') {
    const scale = Math.min(scaleX, scaleY)
    const scaledW = sourceWidthPt * scale
    const scaledH = sourceHeightPt * scale
    const tx = marginPt + (availWidth - scaledW) / 2
    const ty = marginPt + (availHeight - scaledH) / 2
    return { scaleX: scale, scaleY: scale, translateX: tx, translateY: ty }
  }

  if (mode === 'fit_top') {
    const scale = Math.min(scaleX, scaleY)
    const scaledW = sourceWidthPt * scale
    const tx = marginPt + (availWidth - scaledW) / 2
    const ty = marginPt
    return { scaleX: scale, scaleY: scale, translateX: tx, translateY: ty }
  }

  if (mode === 'fill_crop') {
    const scale = Math.max(scaleX, scaleY)
    const scaledW = sourceWidthPt * scale
    const scaledH = sourceHeightPt * scale
    const tx = marginPt + (availWidth - scaledW) / 2
    const ty = marginPt + (availHeight - scaledH) / 2
    return { scaleX: scale, scaleY: scale, translateX: tx, translateY: ty }
  }

  return { scaleX: 1, scaleY: 1, translateX: marginPt, translateY: marginPt }
}

export function applyOrientation(
  widthPt: number,
  heightPt: number,
  orientation: Orientation,
  originalWidthPt: number,
  originalHeightPt: number
): { width: number; height: number } {
  const originalIsLandscape = originalWidthPt > originalHeightPt

  if (orientation === 'follow') {
    if (originalIsLandscape) {
      return { width: Math.max(widthPt, heightPt), height: Math.min(widthPt, heightPt) }
    } else {
      return { width: Math.min(widthPt, heightPt), height: Math.max(widthPt, heightPt) }
    }
  }

  if (orientation === 'landscape') {
    return { width: Math.max(widthPt, heightPt), height: Math.min(widthPt, heightPt) }
  }

  // portrait
  return { width: Math.min(widthPt, heightPt), height: Math.max(widthPt, heightPt) }
}
