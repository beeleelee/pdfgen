import React from 'react'
import { z } from 'zod'
import { theme } from './theme.js'

export const LetterDataSchema = z.object({
  date: z.coerce.string().optional().describe('Date of the letter'),
  recipient: z.object({
    name: z.string().describe('Recipient full name'),
    address: z.string().optional().describe('Recipient mailing address'),
  }),
  subject: z.string().optional().describe('Letter subject line (Re:)'),
  body: z.string().optional().describe('Letter body. Use double newlines for paragraphs.'),
  closing: z.string().optional().describe('Valediction / closing (e.g. Sincerely)'),
  signature: z.string().optional().describe('Sender signature name'),
  sender: z
    .object({
      name: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
})

export type LetterData = z.infer<typeof LetterDataSchema>

const s = {
  page: {
    fontFamily: theme.fonts.serif,
    maxWidth: '680px',
    margin: '0 auto',
    padding: '60px 50px',
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    lineHeight: '1.8',
  },
  senderBlock: {
    marginBottom: theme.spacing.xl,
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
  },
  date: {
    marginBottom: theme.spacing.section,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  recipientBlock: {
    marginBottom: theme.spacing.section,
    fontSize: theme.fontSize.md,
    lineHeight: '1.6',
  },
  subjectLine: {
    fontWeight: '700',
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    marginBottom: theme.spacing.section,
    paddingBottom: theme.spacing.md,
    borderBottom: `${theme.borderWidth.sm} solid ${theme.colors.border}`,
  },
  body: {
    marginBottom: theme.spacing.section,
    fontSize: theme.fontSize.md,
    lineHeight: '1.8',
    color: theme.colors.text,
  },
  paragraph: {
    margin: '0 0 12px 0',
    textIndent: '0',
  },
  closing: {
    marginBottom: theme.spacing.section,
    fontSize: theme.fontSize.md,
    lineHeight: '2',
    color: theme.colors.text,
  },
  signatureName: {
    fontWeight: '700',
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    borderTop: `${theme.borderWidth.sm} solid ${theme.colors.border}`,
  },
}

export function LetterTemplate({ data }: { data: LetterData }) {
  const body = data.body || ''
  const paragraphs = body.split(/\n\n+/).filter(Boolean)

  return (
    <div style={s.page}>
      {data.sender?.name && (
        <div style={s.senderBlock}>
          <div>{data.sender.name}</div>
          {data.sender.address && <div>{data.sender.address}</div>}
        </div>
      )}

      {data.date && <div style={s.date}>{data.date}</div>}

      <div style={s.recipientBlock}>
        <div>{data.recipient.name}</div>
        {data.recipient.address && <div>{data.recipient.address}</div>}
      </div>

      {data.subject && <div style={s.subjectLine}>Re: {data.subject}</div>}

      {paragraphs.length > 0 && (
        <div style={s.body}>
          {paragraphs.map((p, i) => (
            <p key={i} style={s.paragraph}>{p}</p>
          ))}
        </div>
      )}

      {data.closing && (
        <div style={s.closing}>
          <div>{data.closing},</div>
          {data.signature && <div style={s.signatureName}>{data.signature}</div>}
        </div>
      )}
    </div>
  )
}
