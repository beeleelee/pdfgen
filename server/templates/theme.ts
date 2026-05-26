export const theme = {
  colors: {
    primary: '#1e40af',
    primaryLight: '#dbeafe',
    accent: '#2563eb',
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
  fonts: {
    sans: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    serif: "'Georgia', 'Times New Roman', serif",
    mono: "'JetBrains Mono', 'Courier New', monospace",
  },
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
