import { chromium, type Browser } from 'playwright'

export const pdfStore = new Map<string, { buffer: Buffer; createdAt: number }>()

let browser: Browser | null = null
let cleanupTimer: ReturnType<typeof setInterval> | null = null

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000
const MAX_AGE_MS = 60 * 60 * 1000

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch()
  }
  return browser
}

function footerTemplate(): string {
  return `
    <div style="
      width: 100%;
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      font-size: 8px;
      color: #94a3b8;
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 4px;
    ">
      <span>pdfgen</span>
      <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      <span class="date"></span>
    </div>`
}

export async function generatePdf(
  html: string,
  options?: { watermarkText?: string }
): Promise<Buffer> {
  const b = await getBrowser()
  const page = await b.newPage()

  try {
    await page.setContent(html, { waitUntil: 'networkidle' })
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '40px', bottom: '60px', left: '0', right: '0' },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: footerTemplate(),
    })
    return Buffer.from(pdf)
  } finally {
    await page.close()
  }
}

export function storePdf(id: string, buffer: Buffer): void {
  pdfStore.set(id, { buffer, createdAt: Date.now() })
}

export function getPdf(id: string): Buffer | undefined {
  return pdfStore.get(id)?.buffer
}

function cleanup() {
  const now = Date.now()
  for (const [id, entry] of pdfStore) {
    if (now - entry.createdAt > MAX_AGE_MS) {
      pdfStore.delete(id)
    }
  }
}

export function startCleanup(): void {
  if (cleanupTimer) return
  cleanupTimer = setInterval(cleanup, CLEANUP_INTERVAL_MS)
}

function shutdown() {
  if (cleanupTimer) {
    clearInterval(cleanupTimer)
    cleanupTimer = null
  }
  if (browser) {
    browser.close()
    browser = null
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
