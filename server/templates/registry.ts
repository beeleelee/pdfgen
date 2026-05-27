import React from 'react'
import { z } from 'zod'
import { InvoiceTemplate, InvoiceDataSchema } from './invoice.js'
import { ResumeTemplate, ResumeDataSchema } from './resume.js'
import { LetterTemplate, LetterDataSchema } from './letter.js'

export interface TemplateEntry {
  component: React.FC<{ data: any }>
  schema: z.ZodTypeAny
  description: string
  dataDescription: string
}

export const templateRegistry = new Map<string, TemplateEntry>()

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

templateRegistry.set('resume', {
  component: ResumeTemplate as React.FC<{ data: any }>,
  schema: ResumeDataSchema,
  description: 'Resume/CV template for creating professional resumes with experience, education, skills, and projects',
  dataDescription: `Fields:
  - name (string, REQUIRED): Full name of the person
  - title? (string): Professional headline
  - contact?: { email?, phone?, linkedin?, website?, github?, location? }
  - summary? (string): Professional summary paragraph
  - experience?: [{ company, role, startDate?, endDate?, content?, bulletPoints?: [string], achievements?: [string] }]
    (content = description of responsibilities; bulletPoints = daily tasks; achievements = notable results)
  - projects?: [{ name, role?, startDate?, endDate?, description?, achievements?: [string], url?, technologies?: [string] }]
  - education?: [{ institution, degree?, field?, year? }]
  - skills?: [string]
  - certifications?: [{ name, issuer?, year? }]`,
})

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
