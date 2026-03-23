export interface PdfPageInfo {
  pageNumber: number
  originalWidthPt: number
  originalHeightPt: number
  originalRotation: number
  thumbnailDataUrl: string
}

export interface PdfDocument {
  filename: string
  fileSize: number
  totalPages: number
  pages: PdfPageInfo[]
}
