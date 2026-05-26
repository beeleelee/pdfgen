import { templateRegistry } from '../templates/registry.js'

function buildPrompt(): string {
  const templateDescriptions = Array.from(templateRegistry.entries())
    .map(([name, entry]) => {
      return `Template: ${name}
Purpose: ${entry.description}
Expected data:
${entry.dataDescription}
`
    })
    .join('\n')

  return `You are a PDF generation assistant. Your job is to help users create PDF documents.

When a user describes what they want, help them pick the right template and fill in all required fields.

Available templates:
${templateDescriptions}
Call the render_pdf tool with the selected template and a complete data object matching the expected fields above. Ask the user for any missing required information before generating.`
}

export const SYSTEM_PROMPT = buildPrompt()
