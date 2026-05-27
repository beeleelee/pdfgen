// Module: server/templates/registry.ts — Template registry.
// Maps template names (string) to their React component, Zod schema,
// human-readable description, and expected data structure documentation.
// The LLM uses this data in the system prompt to understand what templates are available.

import React from 'react'
import { z } from 'zod'
import { InvoiceTemplate, InvoiceDataSchema } from './invoice.js'
import { ResumeTemplate } from './resume.js'
import { ResumeDataSchema } from './resume-shared.js'
import { ResumeClassicTemplate } from './resume-classic.js'
import { ResumeMinimalTemplate } from './resume-minimal.js'
import { ResumeUniTemplate } from './resume-uni.js'
import { ResumeGithubTemplate } from './resume-github.js'
import { ResumeShadcnTemplate } from './resume-shadcn.js'
import { LetterTemplate, LetterDataSchema } from './letter.js'

/** A registered template with component, schema, and docs for the LLM. */
export interface TemplateEntry {
  /** Default component (used when no style is specified). */
  component: React.FC<{ data: any }>
  schema: z.ZodTypeAny
  description: string
  dataDescription: string
  /** Named style variants keyed by style name. For example, resume supports "classic" and "minimal". */
  styles?: Record<string, React.FC<{ data: any }>>
}

export const templateRegistry = new Map<string, TemplateEntry>()

// ─── Invoice template ───────────────────────────────────────────
templateRegistry.set('invoice', {
  component: InvoiceTemplate as React.FC<{ data: any }>,
  schema: InvoiceDataSchema,
  description: 'Invoice template for creating invoices with line items, sender/recipient info, and totals',
  dataDescription: `Fields:
  - invoiceNumber? (string): Unique invoice identifier (auto-generated if missing)
  - issueDate? (string): Date of issue (e.g. 2024-01-15, defaults to today)
  - dueDate? (string): Payment due date (e.g. 2024-02-15)
  - sender: { name, address?, email? }
  - recipient: { name, address?, email? }
  - lineItems: [{ description, quantity?, rate?, amount? }] (subtotal/total computed automatically)
  - subtotal? (number, computed from line items if missing)
  - tax? (number)
  - taxRate? (number, optional percentage e.g. 8 for 8%)
  - total? (number, computed if missing)
  - notes? (string)`,
})

// ─── Resume template (with style variants) ──────────────────────
// Default style is "modern" (blue gradient header, timeline layout).
// Additional styles: "classic" (serif, bordered boxes), "minimal" (clean, thin HR separators),
// "uni" (two-column formal), "github" (GitHub UI aesthetic), "shadcn" (warm clean modern).
templateRegistry.set('resume', {
  component: ResumeTemplate as React.FC<{ data: any }>,
  schema: ResumeDataSchema,
  styles: {
    classic: ResumeClassicTemplate as React.FC<{ data: any }>,
    minimal: ResumeMinimalTemplate as React.FC<{ data: any }>,
    uni: ResumeUniTemplate as React.FC<{ data: any }>,
    github: ResumeGithubTemplate as React.FC<{ data: any }>,
    shadcn: ResumeShadcnTemplate as React.FC<{ data: any }>,
  },
  description: 'Resume/CV template for creating professional resumes with experience, education, skills, and projects. Supports style variants: modern (default), classic, minimal, uni, github, shadcn.',
  dataDescription: `Styles: modern (default), classic, minimal, uni, github, shadcn
Fields:
  - name (string, REQUIRED): Full name of the person
  - title? (string): Professional headline
  - contact?: { email?, phone?, linkedin?, website?, github?, location? }
  - summary? (string): Professional summary. If the user provides multiple paragraphs, keep them separated with \n characters
  - experience?: [{ company, role, startDate?, endDate?, content?, bulletPoints?: [string], achievements?: [string] }]
    (content = 内容/description of responsibilities — use \n between paragraphs; bulletPoints = daily tasks; achievements = 业绩/notable results)
  - projects?: [{ name, role?, startDate?, endDate?, description?, achievements?: [string], url?, technologies?: [string] }]
    (description = 内容/project details — use \n between paragraphs; achievements = 业绩/key accomplishments; url = 项目地址)
  - education?: [{ institution, degree?, field?, year? }]
  - skills?: [string]
  - certifications?: [{ name, issuer?, year? }]`,
})

// ─── Letter template ────────────────────────────────────────────
templateRegistry.set('letter', {
  component: LetterTemplate as React.FC<{ data: any }>,
  schema: LetterDataSchema,
  description: 'Formal letter template for creating professional correspondence',
  dataDescription: `Fields:
  - date? (string): Date of the letter
  - recipient: { name, address? }
  - subject? (string): Letter subject line
  - body? (string): Letter body, use double newlines for paragraph breaks
  - closing? (string): Valediction (e.g. Sincerely, Best regards)
  - signature? (string): Sender's name
  - sender?: { name?, address? }`,
})
