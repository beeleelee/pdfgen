// Module: server/agents/tools.ts — Defines the render_pdf tool for the AI SDK.
// Pipeline: Zod validation → React SSR → Playwright PDF generation → in-memory storage.

import { tool } from 'ai'
import { z } from 'zod'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { v4 as uuid } from 'uuid'
import { templateRegistry } from '../templates/registry.js'
import { generatePdf, storePdf, startCleanup } from '../pdf/generator.js'

// Start the periodic cleanup timer for expired PDFs on module load
startCleanup()

/**
 * Normalizes flat string values from the LLM into structured objects.
 *
 * LLMs often emit shorthand like `{ sender: "Acme Corp" }` instead of
 * `{ sender: { name: "Acme Corp" } }`. This converts those patterns into
 * the shapes expected by the Zod schemas in the template registry.
 */
export function preprocessData(data: Record<string, unknown>): Record<string, unknown> {
  const result = { ...data }

  // { sender: "Name" } → { sender: { name: "Name" } }
  if (typeof result.sender === 'string') {
    result.sender = { name: result.sender }
  }
  // { recipient: "Name" } → { recipient: { name: "Name" } }
  if (typeof result.recipient === 'string') {
    result.recipient = { name: result.recipient }
  }
  // { contact: "email@example.com" } → { contact: { email: "..." } }
  if (typeof result.contact === 'string') {
    result.contact = { email: result.contact }
  }
  // { lineItems: "desc" } → { lineItems: [{ description: "desc" }] }
  if (typeof result.lineItems === 'string') {
    result.lineItems = [{ description: result.lineItems }]
  }
  // { experience: "Company" } → { experience: [{ company: "Company" }] }
  if (typeof result.experience === 'string') {
    result.experience = [{ company: result.experience }]
  }
  // { education: "School" } → { education: [{ institution: "School" }] }
  if (typeof result.education === 'string') {
    result.education = [{ institution: result.education }]
  }
  // { skills: "React" } → { skills: ["React"] }
  if (typeof result.skills === 'string') {
    result.skills = [result.skills]
  }
  // { certifications: "PMP" } → { certifications: [{ name: "PMP" }] }
  if (typeof result.certifications === 'string') {
    result.certifications = [{ name: result.certifications }]
  }
  // { projects: "Project" } → { projects: [{ name: "Project" }] }
  if (typeof result.projects === 'string') {
    result.projects = [{ name: result.projects }]
  }
  // { signature: "Name" } without sender → { sender: { name: "Name" } }
  if (typeof result.signature === 'string' && !result.sender) {
    result.sender = { name: result.signature }
  }

  return result
}

/**
 * Wraps rendered React content into a full HTML document with Google Fonts
 * (Inter) and an optional diagonal watermark overlay.
 */
export function wrapHtml(content: string, watermark?: string): string {
  // When a watermark is present, inject CSS for a fixed diagonal overlay
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

/**
 * The tools object exposed to the AI SDK's streamText().
 * Currently provides a single tool: render_pdf.
 */
export const tools = {
  /**
   * render_pdf — the core LLM tool for PDF generation.
   * Flow: 1) template + data from LLM → 2) Zod validation → 3) React SSR →
   *       4) HTML wrapping (fonts + optional watermark) → 5) Playwright PDF → 6) in-memory store
   */
  render_pdf: tool({
    description: 'Render and generate a PDF from a template',
    inputSchema: z.object({
      template: z.enum(['invoice', 'resume', 'letter']),
      data: z.record(z.unknown()),
      style: z
        .string()
        .optional()
        .describe(
          'Style variant for the template. For resume: "modern" (default), "classic", or "minimal". Ask the user which style they prefer before generating.'
        ),
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
      style,
      watermark,
    }: {
      template: string
      data: Record<string, unknown>
      style?: string
      watermark?: string
    }) => {
      console.log(
        `[render_pdf] execute called: template="${template}", style="${style || 'default'}", watermark="${watermark || '(none)'}"`
      )
      console.log('[render_pdf] raw data:', JSON.stringify(data, null, 2))

      // Step 1: Lookup the template in the registry
      const entry = templateRegistry.get(template)
      if (!entry) {
        console.error(`[render_pdf] Unknown template: ${template}`)
        return { error: `Unknown template: ${template}` }
      }

      // Step 2: Normalize LLM shorthand and validate against the Zod schema
      const augmented = preprocessData(data)
      const parsed = entry.schema.safeParse(augmented)
      if (!parsed.success) {
        console.error(
          `[render_pdf] Validation error for ${template}:`,
          parsed.error.message
        )
        return { error: `Invalid data: ${parsed.error.message}` }
      }

      // Step 3: Resolve the component — use style variant if specified and available,
      // otherwise fall back to the default component
      const component =
        (style && entry.styles?.[style]) || entry.component

      // Step 4: Render the React template component to static HTML markup
      let html: string
      try {
        html = renderToStaticMarkup(
          React.createElement(component, { data: parsed.data })
        )
      } catch (err) {
        console.error('[render_pdf] React render error:', err)
        return { error: `Failed to render template: ${err}` }
      }

      // Step 5: Wrap in a full HTML document (head, fonts, optional watermark)
      const fullHtml = wrapHtml(html, watermark)

      // Step 6: Generate the PDF via Playwright Chromium
      let pdfBuffer: Buffer
      try {
        pdfBuffer = await generatePdf(fullHtml)
      } catch (err) {
        console.error('[render_pdf] Playwright PDF generation error:', err)
        return { error: `Failed to generate PDF: ${err}` }
      }

      // Step 7: Store the PDF buffer in memory and return the ID
      const pdfId = uuid()
      storePdf(pdfId, pdfBuffer)
      console.log(
        `[render_pdf] Generated ${template} PDF: ${pdfId}` +
          (style ? ` (style: ${style})` : '') +
          (watermark ? ` (watermark: "${watermark}")` : '')
      )

      return {
        pdfId,
        note: `Generated ${template} PDF`,
      }
    },
  }),
}
