import { chromium, type Browser } from 'playwright'

export const pdfStore = new Map<string, Buffer>()

let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch()
  }
  return browser
}

export async function generatePdf(html: string): Promise<Buffer> {
  const b = await getBrowser()
  const page = await b.newPage()

  try {
    await page.setContent(html, { waitUntil: 'networkidle' })
    const pdf = await page.pdf({ format: 'A4', margin: { top: '0', bottom: '0', left: '0', right: '0' } })
    return Buffer.from(pdf)
  } finally {
    await page.close()
  }
}

export function storePdf(id: string, buffer: Buffer): void {
  pdfStore.set(id, buffer)
}

function shutdown() {
  if (browser) {
    browser.close()
    browser = null
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
