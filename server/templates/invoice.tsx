import React from 'react'
import { z } from 'zod'

export const InvoiceDataSchema = z.object({
  invoiceNumber: z.string().describe('Unique invoice identifier'),
  issueDate: z.string().describe('Date of issue (e.g. 2024-01-15)'),
  dueDate: z.string().describe('Payment due date (e.g. 2024-02-15)'),
  sender: z.object({
    name: z.string(),
    address: z.string(),
    email: z.string().email(),
  }),
  recipient: z.object({
    name: z.string(),
    address: z.string(),
    email: z.string().email().optional(),
  }),
  lineItems: z
    .array(
      z.object({
        description: z.string(),
        quantity: z.number().positive(),
        rate: z.number().positive(),
        amount: z.number().positive(),
      })
    )
    .min(1),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative().optional(),
  taxRate: z.number().nonnegative().optional(),
  total: z.number().nonnegative(),
  notes: z.string().optional(),
})

export type InvoiceData = z.infer<typeof InvoiceDataSchema>

const styles = {
  container: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    color: '#333',
    fontSize: '12px',
    lineHeight: '1.5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    borderBottom: '3px solid #2563eb',
    paddingBottom: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2563eb',
    margin: '0',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
  },
  invoiceMeta: {
    textAlign: 'right' as const,
    fontSize: '11px',
    color: '#666',
  },
  metaLabel: {
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  addressBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '25px',
  },
  addressBlock: {
    width: '45%',
    fontSize: '11px',
  },
  name: {
    fontWeight: '700',
    fontSize: '13px',
    color: '#111',
    marginBottom: '3px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#f8fafc',
    padding: '10px 12px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #e2e8f0',
    fontSize: '11px',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '11px',
  },
  amountRight: {
    padding: '10px 12px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '11px',
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
    fontSize: '11px',
  },
  totalLabel: {
    fontWeight: '600',
    color: '#475569',
  },
  totalAmount: {
    textAlign: 'right' as const,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  grandTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderTop: '2px solid #2563eb',
    fontSize: '16px',
    fontWeight: '700',
    color: '#2563eb',
  },
  notes: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#f8fafc',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#475569',
  },
  notesLabel: {
    fontWeight: '700',
    color: '#333',
    marginBottom: '5px',
  },
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function InvoiceTemplate({ data }: { data: InvoiceData }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Invoice</h1>
        <div style={styles.invoiceMeta}>
          <div>
            <span style={styles.metaLabel}>Invoice #:</span>{' '}
            {data.invoiceNumber}
          </div>
          <div>
            <span style={styles.metaLabel}>Issue Date:</span> {data.issueDate}
          </div>
          <div>
            <span style={styles.metaLabel}>Due Date:</span> {data.dueDate}
          </div>
        </div>
      </div>

      <div style={styles.addressBox}>
        <div style={styles.addressBlock}>
          <div style={styles.sectionTitle}>From</div>
          <div style={styles.name}>{data.sender.name}</div>
          <div>{data.sender.address}</div>
          <div>{data.sender.email}</div>
        </div>
        <div style={styles.addressBlock}>
          <div style={styles.sectionTitle}>To</div>
          <div style={styles.name}>{data.recipient.name}</div>
          <div>{data.recipient.address}</div>
          {data.recipient.email && <div>{data.recipient.email}</div>}
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Description</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Qty</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Rate</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item, i) => (
            <tr key={i}>
              <td style={styles.td}>{item.description}</td>
              <td style={styles.amountRight}>{item.quantity}</td>
              <td style={styles.amountRight}>{formatCurrency(item.rate)}</td>
              <td style={styles.amountRight}>{formatCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.totals}>
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Subtotal</span>
          <span style={styles.totalAmount}>
            {formatCurrency(data.subtotal)}
          </span>
        </div>
        {data.tax !== undefined && (
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>
              Tax{data.taxRate ? ` (${data.taxRate}%)` : ''}
            </span>
            <span style={styles.totalAmount}>
              {formatCurrency(data.tax)}
            </span>
          </div>
        )}
        <div style={styles.grandTotal}>
          <span>Total</span>
          <span>{formatCurrency(data.total)}</span>
        </div>
      </div>

      {data.notes && (
        <div style={styles.notes}>
          <div style={styles.notesLabel}>Notes</div>
          <div>{data.notes}</div>
        </div>
      )}
    </div>
  )
}
