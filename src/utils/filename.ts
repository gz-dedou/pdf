export const buildExportFilename = (origin: string) => {
  const index = origin.lastIndexOf('.')
  const name = index >= 0 ? origin.slice(0, index) : origin
  return `${name}-resized.pdf`
}
