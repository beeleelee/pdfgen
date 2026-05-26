import React from 'react'
import { z } from 'zod'

export const LetterDataSchema = z.object({
  date: z.string().describe('Date of the letter'),
  recipient: z.object({
    name: z.string().describe('Recipient full name'),
    address: z.string().describe('Recipient mailing address'),
  }),
  subject: z.string().describe('Letter subject line (Re:)'),
  body: z.string().describe('Letter body. Use double newlines for paragraphs.'),
  closing: z.string().describe('Valediction / closing (e.g. Sincerely)'),
  signature: z.string().describe('Sender signature name'),
  sender: z
    .object({
      name: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
})

export type LetterData = z.infer<typeof LetterDataSchema>

const styles = {
  container: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    maxWidth: '680px',
    margin: '0 auto',
    padding: '60px 50px',
    color: '#1a1a1a',
    fontSize: '12px',
    lineHeight: '1.7',
  },
  senderBlock: {
    marginBottom: '20px',
    fontSize: '11px',
    color: '#4a4a4a',
  },
  date: {
    marginBottom: '25px',
    fontSize: '12px',
  },
  recipientBlock: {
    marginBottom: '25px',
    fontSize: '12px',
  },
  subjectLine: {
    fontWeight: '700',
    fontSize: '13px',
    marginBottom: '25px',
    paddingBottom: '8px',
    borderBottom: '1px solid #d0d0d0',
  },
  body: {
    marginBottom: '30px',
    whiteSpace: 'pre-wrap' as const,
    fontSize: '12px',
    lineHeight: '1.8',
  },
  closing: {
    marginBottom: '30px',
    fontSize: '12px',
  },
  signatureBlock: {
    marginTop: '8px',
    fontSize: '12px',
  },
  signatureName: {
    fontWeight: '700',
    fontSize: '13px',
    marginTop: '30px',
  },
}

export function LetterTemplate({ data }: { data: LetterData }) {
  const paragraphs = data.body.split(/\n\n+/)

  return (
    <div style={styles.container}>
      {data.sender?.name && (
        <div style={styles.senderBlock}>
          {data.sender.name && <div>{data.sender.name}</div>}
          {data.sender.address && <div>{data.sender.address}</div>}
        </div>
      )}

      <div style={styles.date}>{data.date}</div>

      <div style={styles.recipientBlock}>
        <div>{data.recipient.name}</div>
        <div>{data.recipient.address}</div>
      </div>

      <div style={styles.subjectLine}>Re: {data.subject}</div>

      <div style={styles.body}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ margin: '0 0 10px 0' }}>
            {p}
          </p>
        ))}
      </div>

      <div style={styles.closing}>
        <div>{data.closing},</div>
        <div style={styles.signatureName}>{data.signature}</div>
      </div>
    </div>
  )
}
