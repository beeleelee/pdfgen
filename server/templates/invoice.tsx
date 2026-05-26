import React from 'react'
import { z } from 'zod'
import { theme } from './theme.js'

export const InvoiceDataSchema = z.object({
  invoiceNumber: z.string().optional().describe('Unique invoice identifier'),
  issueDate: z.coerce.string().optional().describe('Date of issue (e.g. 2024-01-15)'),
  dueDate: z.coerce.string().optional().describe('Payment due date (e.g. 2024-02-15)'),
  sender: z.object({
    name: z.string(),
    address: z.string().optional(),
    email: z.string().optional(),
  }),
  recipient: z.object({
    name: z.string(),
    address: z.string().optional(),
    email: z.string().optional(),
  }),
  lineItems: z
    .array(
      z.object({
        description: z.string(),
        quantity: z.coerce.number().nonnegative().optional(),
        rate: z.coerce.number().nonnegative().optional(),
        amount: z.coerce.number().nonnegative().optional(),
      })
    ),
  subtotal: z.coerce.number().nonnegative().optional(),
  tax: z.coerce.number().nonnegative().optional(),
  taxRate: z.coerce.number().nonnegative().optional(),
  total: z.coerce.number().nonnegative().optional(),
  notes: z.string().optional(),
})

export type InvoiceData = z.infer<typeof InvoiceDataSchema>

const s = {
  page: {
    fontFamily: theme.fonts.sans,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '48px 40px',
    color: theme.colors.text,
    fontSize: theme.fontSize.base,
    lineHeight: '1.6',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.section,
    borderBottom: `${theme.borderWidth.lg} solid ${theme.colors.primary}`,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: '700',
    color: theme.colors.primary,
    margin: '0',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
  },
  meta: {
    textAlign: 'right' as const,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  metaLabel: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  sectionLabel: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: theme.spacing.sm,
  },
  addressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.section,
  },
  addressCol: {
    width: '45%',
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
  },
  addressName: {
    fontWeight: '700',
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: theme.spacing.xl,
  },
  th: {
    backgroundColor: theme.colors.bgMuted,
    padding: '12px',
    textAlign: 'left' as const,
    borderBottom: `${theme.borderWidth.md} solid ${theme.colors.borderDark}`,
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  thRight: {
    backgroundColor: theme.colors.bgMuted,
    padding: '12px',
    textAlign: 'right' as const,
    borderBottom: `${theme.borderWidth.md} solid ${theme.colors.borderDark}`,
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  td: {
    padding: '12px',
    borderBottom: `${theme.borderWidth.sm} solid ${theme.colors.border}`,
    fontSize: theme.fontSize.base,
  },
  tdRight: {
    padding: '12px',
    borderBottom: `${theme.borderWidth.sm} solid ${theme.colors.border}`,
    fontSize: theme.fontSize.base,
    textAlign: 'right' as const,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  totals: {
    marginLeft: 'auto',
    width: '280px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: theme.fontSize.base,
  },
  totalValue: {
    textAlign: 'right' as const,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  grandTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderTop: `${theme.borderWidth.md} solid ${theme.colors.primary}`,
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  notes: {
    marginTop: theme.spacing.section,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.bgMuted,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    ...theme.print.keepTogether,
  },
  notesLabel: {
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
}

function fmt(n: number): string {
  return `$${n.toFixed(2)}`
}

function num(n: number | undefined | null, fallback = 0): number {
  return (n != null && !isNaN(n)) ? n : fallback
}

function computeSubtotal(items: InvoiceData['lineItems']): number {
  return items.reduce((sum, item) => {
    const amount = num(item.amount)
    if (amount > 0) return sum + amount
    return sum + num(item.quantity) * num(item.rate)
  }, 0)
}

function formatDate(d: string): string {
  if (d) return d
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function InvoiceTemplate({ data }: { data: InvoiceData }) {
  const items = data.lineItems || []
  const subtotal = data.subtotal ?? computeSubtotal(items)
  const total = data.total ?? (subtotal + (data.tax || 0))

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Invoice</h1>
        <div style={s.meta}>
          <div><span style={s.metaLabel}>Invoice:</span> {data.invoiceNumber || 'INV-001'}</div>
          <div><span style={s.metaLabel}>Issued:</span> {formatDate(data.issueDate || '')}</div>
          <div><span style={s.metaLabel}>Due:</span> {formatDate(data.dueDate || '')}</div>
        </div>
      </div>

      <div style={s.addressRow}>
        <div style={s.addressCol}>
          <div style={s.sectionLabel}>From</div>
          <div style={s.addressName}>{data.sender.name}</div>
          {data.sender.address && <div>{data.sender.address}</div>}
          {data.sender.email && <div>{data.sender.email}</div>}
        </div>
        <div style={s.addressCol}>
          <div style={s.sectionLabel}>To</div>
          <div style={s.addressName}>{data.recipient.name}</div>
          {data.recipient.address && <div>{data.recipient.address}</div>}
          {data.recipient.email && <div>{data.recipient.email}</div>}
        </div>
      </div>

      {items.length > 0 && (
        <>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Description</th>
                <th style={s.thRight}>Qty</th>
                <th style={s.thRight}>Rate</th>
                <th style={s.thRight}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={s.td}>{item.description}</td>
                  <td style={s.tdRight}>{num(item.quantity, 1)}</td>
                  <td style={s.tdRight}>{fmt(num(item.rate))}</td>
                  <td style={s.tdRight}>{fmt(num(item.amount) || num(item.quantity) * num(item.rate))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={s.totals}>
            <div style={s.totalRow}>
              <span>Subtotal</span>
              <span style={s.totalValue}>{fmt(subtotal)}</span>
            </div>
            {data.tax !== undefined && (
              <div style={s.totalRow}>
                <span>Tax{data.taxRate ? ` (${data.taxRate}%)` : ''}</span>
                <span style={s.totalValue}>{fmt(data.tax)}</span>
              </div>
            )}
            <div style={s.grandTotal}>
              <span>Total Due</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
        </>
      )}

      {data.notes && (
        <div style={s.notes}>
          <div style={s.notesLabel}>Notes</div>
          <div>{data.notes}</div>
        </div>
      )}
    </div>
  )
}
