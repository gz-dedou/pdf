export function buildOutputFilename(originalName: string): string {
  const base = originalName.replace(/\.pdf$/i, '')
  return `${base}-resized.pdf`
}
