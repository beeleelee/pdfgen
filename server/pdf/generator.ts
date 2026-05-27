// Module: server/pdf/generator.ts — PDF generation via Playwright + in-memory storage.
// Manages a singleton Chromium browser, generates PDFs from HTML, stores them
// in a Map with 1-hour TTL, and provides graceful shutdown.

import { chromium, type Browser } from 'playwright'

// In-memory store: maps PDF ID → { buffer, creation timestamp }
export const pdfStore = new Map<string, { buffer: Buffer; createdAt: number }>()

// Singleton browser instance (lazy-initialized)
let browser: Browser | null = null
let cleanupTimer: ReturnType<typeof setInterval> | null = null

// Cleanup runs every 10 minutes; PDFs older than 1 hour are evicted
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000
const MAX_AGE_MS = 60 * 60 * 1000

/**
 * Returns the singleton Playwright Chromium instance, launching it on first call.
 */
async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch()
  }
  return browser
}

/**
 * Footer template for PDF pages — shows "pdfgen", page numbers, and current date.
 * The special CSS classes `.pageNumber`, `.totalPages`, and `.date` are
 * Playwright's built-in replacements that get filled at render time.
 */
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

/**
 * Generates a PDF from an HTML string using Playwright.
 * Loads the HTML into a page, waits for fonts to load (networkidle),
 * then renders it as A4 PDF with headers/footers.
 */
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

/**
 * Stores a PDF buffer in the in-memory store with the current timestamp.
 */
export function storePdf(id: string, buffer: Buffer): void {
  pdfStore.set(id, { buffer, createdAt: Date.now() })
}

/**
 * Retrieves a PDF buffer by ID, or undefined if not found / expired.
 */
export function getPdf(id: string): Buffer | undefined {
  return pdfStore.get(id)?.buffer
}

/**
 * Removes PDFs that have exceeded the maximum age (1 hour).
 */
function cleanup() {
  const now = Date.now()
  for (const [id, entry] of pdfStore) {
    if (now - entry.createdAt > MAX_AGE_MS) {
      pdfStore.delete(id)
    }
  }
}

/**
 * Starts the periodic cleanup interval. Safe to call multiple times.
 */
export function startCleanup(): void {
  if (cleanupTimer) return
  cleanupTimer = setInterval(cleanup, CLEANUP_INTERVAL_MS)
}

/**
 * Cleans up resources: stops the timer and closes the browser.
 * Called on SIGINT / SIGTERM for graceful shutdown.
 */
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

// Register shutdown handlers for graceful termination
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
