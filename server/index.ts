import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'
import { v4 as uuid } from 'uuid'
import chatRouter from './routes/chat.js'
import pdfRouter from './routes/pdf.js'
import { storePdf } from './pdf/generator.js'

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())

app.use('/api/chat', chatRouter)
app.use('/api/pdf', pdfRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/pdf-test', async (_req, res) => {
  try {
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.setContent('<h1 style="color:blue">Hello PDF</h1><p>Test from pdfgen</p>')
    const pdf = await page.pdf({ format: 'A4' })
    await browser.close()
    const id = uuid()
    storePdf(id, Buffer.from(pdf))
    console.log(`[pdf-test] Generated test PDF: ${id}`)
    res.json({ pdfId: id, url: `/api/pdf/${id}` })
  } catch (err) {
    console.error('[pdf-test] Error:', err)
    res.status(500).json({ error: String(err) })
  }
})

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
