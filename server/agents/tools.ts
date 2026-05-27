import { tool } from 'ai'
import { z } from 'zod'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { v4 as uuid } from 'uuid'
import { templateRegistry } from '../templates/registry.js'
import { generatePdf, storePdf, startCleanup } from '../pdf/generator.js'

startCleanup()

export function preprocessData(data: Record<string, unknown>): Record<string, unknown> {
  const result = { ...data }

  if (typeof result.sender === 'string') {
    result.sender = { name: result.sender }
  }
  if (typeof result.recipient === 'string') {
    result.recipient = { name: result.recipient }
  }
  if (typeof result.contact === 'string') {
    result.contact = { email: result.contact }
  }
  if (typeof result.lineItems === 'string') {
    result.lineItems = [{ description: result.lineItems }]
  }
  if (typeof result.experience === 'string') {
    result.experience = [{ company: result.experience }]
  }
  if (typeof result.education === 'string') {
    result.education = [{ institution: result.education }]
  }
  if (typeof result.skills === 'string') {
    result.skills = [result.skills]
  }
  if (typeof result.certifications === 'string') {
    result.certifications = [{ name: result.certifications }]
  }
  if (typeof result.projects === 'string') {
    result.projects = [{ name: result.projects }]
  }
  if (typeof result.signature === 'string' && !result.sender) {
    result.sender = { name: result.signature }
  }

  return result
}

export function wrapHtml(content: string, watermark?: string): string {
  const watermarkCss = watermark
    ? `.wm-overlay {
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
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  text-transform: uppercase;
  letter-spacing: 12px;
}\n`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  ${watermarkCss}
</style>
</head>
<body>${content}${watermark ? `<div class="wm-overlay">${watermark}</div>` : ''}</body>
</html>`
}

export const tools = {
  render_pdf: tool({
    description: 'Render and generate a PDF from a template',
    inputSchema: z.object({
      template: z.enum(['invoice', 'resume', 'letter']),
      data: z.record(z.unknown()),
      watermark: z
        .string()
        .optional()
        .describe(
          'Watermark text displayed diagonally across every page. Use when the user mentions DRAFT, CONFIDENTIAL, SAMPLE, FOR REVIEW, or similar labels.'
        ),
    }),
    execute: async ({
      template,
      data,
      watermark,
    }: {
      template: string
      data: Record<string, unknown>
      watermark?: string
    }) => {
      console.log(
        `[render_pdf] execute called: template="${template}", watermark="${watermark || '(none)'}"`
      )
      console.log('[render_pdf] raw data:', JSON.stringify(data, null, 2))
      const entry = templateRegistry.get(template)
      if (!entry) {
        console.error(`[render_pdf] Unknown template: ${template}`)
        return { error: `Unknown template: ${template}` }
      }

      const augmented = preprocessData(data)
      const parsed = entry.schema.safeParse(augmented)
      if (!parsed.success) {
        console.error(
          `[render_pdf] Validation error for ${template}:`,
          parsed.error.message
        )
        return { error: `Invalid data: ${parsed.error.message}` }
      }

      let html: string
      try {
        html = renderToStaticMarkup(
          React.createElement(entry.component, { data: parsed.data })
        )
      } catch (err) {
        console.error('[render_pdf] React render error:', err)
        return { error: `Failed to render template: ${err}` }
      }

      const fullHtml = wrapHtml(html, watermark)

      let pdfBuffer: Buffer
      try {
        pdfBuffer = await generatePdf(fullHtml)
      } catch (err) {
        console.error('[render_pdf] Playwright PDF generation error:', err)
        return { error: `Failed to generate PDF: ${err}` }
      }

      const pdfId = uuid()
      storePdf(pdfId, pdfBuffer)
      console.log(
        `[render_pdf] Generated ${template} PDF: ${pdfId}` +
          (watermark ? ` (watermark: "${watermark}")` : '')
      )

      return {
        pdfId,
        note: `Generated ${template} PDF`,
      }
    },
  }),
}
