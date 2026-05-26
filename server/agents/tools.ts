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
        throw new Error(`Unknown template: ${template}`)
      }

      const parsed = entry.schema.safeParse(data)
      if (!parsed.success) {
        throw new Error(
          `Invalid data for template "${template}": ${parsed.error.message}`
        )
      }

      const html = renderToStaticMarkup(
        React.createElement(entry.component, { data: parsed.data })
      )
      const fullHtml = wrapHtml(html)
      const pdfBuffer = await generatePdf(fullHtml)
      const pdfId = uuid()
      storePdf(pdfId, pdfBuffer)

      return {
        pdfId,
        note: `Generated ${template} PDF`,
      }
    },
  }),
}
