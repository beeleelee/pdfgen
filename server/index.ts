import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import chatRouter from './routes/chat.js'
import pdfRouter from './routes/pdf.js'

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())

app.use('/api/chat', chatRouter)
app.use('/api/pdf', pdfRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
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
