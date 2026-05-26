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
  - invoiceNumber (string): Unique invoice identifier
  - issueDate (string): Date of issue (e.g. 2024-01-15)
  - dueDate (string): Payment due date (e.g. 2024-02-15)
  - sender: { name, address, email }
  - recipient: { name, address, email? }
  - lineItems: [{ description, quantity, rate, amount }]
  - subtotal (number)
  - tax? (number)
  - taxRate? (number, optional percentage e.g. 8 for 8%)
  - total (number)
  - notes? (string)`,
})

templateRegistry.set('resume', {
  component: ResumeTemplate as React.FC<{ data: any }>,
  schema: ResumeDataSchema,
  description: 'Resume/CV template for creating professional resumes with experience, education, and skills',
  dataDescription: `Fields:
  - name (string, REQUIRED): Full name of the person (extract from user's message)
  - title (string): Professional headline
  - contact: { email, phone, linkedin?, website? }
  - summary (string): Professional summary paragraph
  - experience: [{ company, role, startDate, endDate (optional, use "Present" for current), bulletPoints: [string] }]
  - education: [{ institution, degree, field, year (number or string) }]
  - skills: [string]
  - certifications?: [{ name, issuer?, year? }]`,
})

templateRegistry.set('letter', {
  component: LetterTemplate as React.FC<{ data: any }>,
  schema: LetterDataSchema,
  description: 'Formal letter template for creating professional correspondence',
  dataDescription: `Fields:
  - date (string): Date of the letter
  - recipient: { name, address }
  - subject (string): Letter subject line
  - body (string): Letter body, use double newlines for paragraph breaks
  - closing (string): Valediction (e.g. Sincerely, Best regards)
  - signature (string): Sender's name
  - sender?: { name?, address? }`,
})
