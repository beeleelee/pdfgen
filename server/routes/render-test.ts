// Module: server/routes/render-test.ts — Debug/testing endpoint for template rendering.
// Useful for iterating on template designs and data schemas without going through the LLM.
// Supports returning HTML (for visual inspection) or PDF (for end-to-end testing).

import { Router, type Request, type Response } from 'express'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { v4 as uuid } from 'uuid'
import { templateRegistry } from '../templates/registry.js'
import { preprocessData, wrapHtml } from '../agents/tools.js'
import { generatePdf, storePdf } from '../pdf/generator.js'

const router = Router()

/**
 * POST /api/render-test
 *
 * Body:
 *   - template: "invoice" | "resume" | "letter"
 *   - data: Record<string, unknown> — raw data (preprocessing applied automatically)
 *   - format?: "html" | "pdf" — defaults to HTML
 */
router.post('/', async (req: Request, res: Response) => {
  const { template, data, format } = req.body as {
    template?: string
    data?: Record<string, unknown>
    format?: 'html' | 'pdf'
  }

  if (!template || !data) {
    res.status(400).json({ error: 'Missing required fields: template, data' })
    return
  }

  const entry = templateRegistry.get(template)
  if (!entry) {
    res.status(400).json({ error: `Unknown template: ${template}` })
    return
  }

  console.log('[render-test] raw data:', JSON.stringify(data, null, 2))

  // Reuses the same preprocessing and validation pipeline as the LLM tool
  const augmented = preprocessData(data)
  const parsed = entry.schema.safeParse(augmented)
  if (!parsed.success) {
    console.error('[render-test] validation error:', parsed.error.message)
    res.status(400).json({ error: `Invalid data: ${parsed.error.message}` })
    return
  }

  // Render the React template to static HTML
  let html: string
  try {
    html = renderToStaticMarkup(
      React.createElement(entry.component, { data: parsed.data })
    )
  } catch (err) {
    console.error('[render-test] render error:', err)
    res.status(500).json({ error: `Failed to render: ${err}` })
    return
  }

  // If format=pdf, go through Playwright; otherwise send the HTML directly
  if (format === 'pdf') {
    const fullHtml = wrapHtml(html)
    const pdfBuffer = await generatePdf(fullHtml)
    const pdfId = uuid()
    storePdf(pdfId, pdfBuffer)
    console.log(`[render-test] Generated PDF: ${pdfId}`)
    res.json({ pdfId, url: `/api/pdf/${pdfId}` })
    return
  }

  const fullHtml = wrapHtml(html)
  res.type('html').send(fullHtml)
})

export default router
