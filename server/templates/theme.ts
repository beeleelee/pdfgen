// Module: server/templates/theme.ts — Shared design token theme for all PDF templates.
// All templates import this to ensure consistent colors, typography, spacing, and
// print-friendly CSS properties across invoice, resume, and letter documents.

export const theme = {
  // Color palette — blue-based professional scheme
  colors: {
    primary: '#1e40af',
    primaryLight: '#dbeafe',
    primaryDark: '#1e3a5f',
    accent: '#2563eb',
    accentTech: '#06b6d4',
    text: '#1e293b',
    textSecondary: '#475569',
    muted: '#94a3b8',
    border: '#e2e8f0',
    borderDark: '#cbd5e1',
    bg: '#ffffff',
    bgMuted: '#f8fafc',
    bgHighlight: '#eff6ff',
    success: '#059669',
    danger: '#dc2626',
  },
  // Gradient definitions for header backgrounds and decorative underlines
  gradients: {
    header: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
    accentUnderline: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
  },
  // Font stacks — Inter is loaded via Google Fonts in wrapHtml()
  fonts: {
    sans: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    serif: "'Georgia', 'Times New Roman', serif",
    mono: "'JetBrains Mono', 'Courier New', monospace",
  },
  // Font sizes (small because PDFs use physical page dimensions)
  fontSize: {
    xs: '9px',
    sm: '10px',
    base: '11px',
    md: '12px',
    lg: '14px',
    xl: '18px',
    xxl: '24px',
    title: '30px',
  },
  // Consistent spacing scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    section: '32px',
  },
  borderRadius: {
    sm: '3px',
    md: '6px',
  },
  borderWidth: {
    sm: '1px',
    md: '2px',
    lg: '3px',
  },
  // Print-specific CSS utilities to prevent awkward page breaks
  print: {
    avoidBreak: {
      pageBreakInside: 'avoid' as const,
    },
    keepTogether: {
      pageBreakInside: 'avoid' as const,
      breakInside: 'avoid' as const,
    },
  },
}
