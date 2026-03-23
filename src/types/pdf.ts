import type { PageOverrideState } from './page-setting'

export interface PdfPageMeta {
  pageNumber: number
  originalWidthPt: number
  originalHeightPt: number
  originalRotation: number
  thumbnailDataUrl: string
}

export interface PdfDocumentState {
  file: File
  fileBuffer: ArrayBuffer
  filename: string
  filesize: number
  pageCount: number
  pages: PdfPageMeta[]
}

export interface PageItem extends PdfPageMeta {
  override: PageOverrideState
}
