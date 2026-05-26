import { tool } from 'ai'
import { z } from 'zod'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { v4 as uuid } from 'uuid'
import { templateRegistry } from '../templates/registry.js'
import { generatePdf, storePdf } from '../pdf/generator.js'

function wrapHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>${content}</body>
</html>`
}

export const tools = {
  render_pdf: tool({
    description: 'Render and generate a PDF from a template',
    inputSchema: z.object({
      template: z.enum(['invoice', 'resume', 'letter']),
      data: z.record(z.unknown()),
    }),
    execute: async ({
      template,
      data,
    }: {
      template: string
      data: Record<string, unknown>
    }) => {
      const entry = templateRegistry.get(template)
      if (!entry) {
        console.error(`[render_pdf] Unknown template: ${template}`)
        return { error: `Unknown template: ${template}` }
      }

      const parsed = entry.schema.safeParse(data)
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

      const fullHtml = wrapHtml(html)

      let pdfBuffer: Buffer
      try {
        pdfBuffer = await generatePdf(fullHtml)
      } catch (err) {
        console.error('[render_pdf] Playwright PDF generation error:', err)
        return { error: `Failed to generate PDF: ${err}` }
      }

      const pdfId = uuid()
      storePdf(pdfId, pdfBuffer)
      console.log(`[render_pdf] Generated ${template} PDF: ${pdfId}`)

      return {
        pdfId,
        note: `Generated ${template} PDF`,
      }
    },
  }),
}
