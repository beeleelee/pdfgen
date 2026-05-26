import { tool } from 'ai'
import { z } from 'zod'

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
      return {
        pdfId: 'placeholder',
        note: `Would render ${template} template with provided data`,
      }
    },
  }),
}
