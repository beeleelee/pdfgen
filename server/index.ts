// Module: server/index.ts — Express entry point: mounts API routes, serves production build, provides a PDF debug endpoint.

import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'
import { v4 as uuid } from 'uuid'
import chatRouter from './routes/chat.js'
import pdfRouter from './routes/pdf.js'
import renderTestRouter from './routes/render-test.js'
import { storePdf } from './pdf/generator.js'

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())

// Mount API route modules
app.use('/api/chat', chatRouter)
app.use('/api/pdf', pdfRouter)
app.use('/api/render-test', renderTestRouter)

// Simple health-check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Debug endpoint: generates a quick test PDF with an optional ?watermark= query param.
// Useful for verifying Playwright integration and watermark rendering without going through the LLM.
app.get('/api/pdf-test', async (req, res) => {
  const watermark = (req.query.watermark as string) || ''
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', sans-serif;
    padding: 40px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  h1 { color: #1e40af; margin-bottom: 20px; }
  p { color: #475569; margin-bottom: 10px; }
  ${watermark ? `.wm {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 60px;
    font-weight: 700;
    color: rgba(30,64,175,0.10);
    transform: rotate(-30deg);
    text-transform: uppercase;
    letter-spacing: 12px;
  }` : ''}
</style>
</head>
<body>
  <h1>Test PDF</h1>
  <p>This is a test document.</p>
  <p>Watermark: "${watermark || '(none)'}"</p>
  ${watermark ? '<div class="wm">' + watermark + '</div>' : ''}
</body>
</html>`
  try {
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })
    // Generate PDF with page numbers in the footer via displayHeaderFooter
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '40px', bottom: '60px', left: '0', right: '0' },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: '<div style="width:100%;font-size:8px;color:#94a3b8;padding:0 40px;display:flex;justify-content:space-between;border-top:1px solid #e2e8f0;padding-top:4px"><span>pdfgen</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span><span class="date"></span></div>',
    })
    await browser.close()
    const id = uuid()
    storePdf(id, Buffer.from(pdf))
    console.log(`[pdf-test] Generated test PDF${watermark ? ' with watermark "' + watermark + '"' : ''}: ${id}`)
    res.json({ pdfId: id, url: `/api/pdf/${id}` })
  } catch (err) {
    console.error('[pdf-test] Error:', err)
    res.status(500).json({ error: String(err) })
  }
})

// In production, serve the Vite-built static files and fall back to index.html for client-side routing.
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  app.use(express.static(path.resolve(__dirname, '../dist')))
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'))
  })
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
