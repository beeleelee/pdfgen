export const pdfStore = new Map<string, Buffer>()

export function storePdf(id: string, buffer: Buffer): void {
  pdfStore.set(id, buffer)
}
