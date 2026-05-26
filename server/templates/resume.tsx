import React from 'react'
import { z } from 'zod'
import { theme } from './theme.js'

export const ExperienceSchema = z.object({
  company: z.string().describe('Company or organization name'),
  role: z.string().describe('Job title'),
  startDate: z.string().describe('Start date (e.g. Jan 2020)'),
  endDate: z.coerce.string().nullable().optional().describe('End date (e.g. Dec 2023, or "Present")'),
  bulletPoints: z
    .array(z.string())
    .describe('Key accomplishments and responsibilities'),
})

export const EducationSchema = z.object({
  institution: z.string().describe('School or university name'),
  degree: z.string().describe('Degree type (e.g. B.S., M.S.)'),
  field: z.string().describe('Field of study'),
  year: z.coerce.string().describe('Graduation year'),
})

export const ResumeDataSchema = z.object({
  name: z.string(),
  title: z.string().describe('Professional headline'),
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
  }),
  summary: z.string().describe('Professional summary paragraph'),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(z.string()),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string().optional(),
        year: z.coerce.string().optional(),
      })
    )
    .optional(),
})

export type ResumeData = z.infer<typeof ResumeDataSchema>

const s = {
  page: {
    fontFamily: theme.fonts.sans,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    color: theme.colors.text,
    fontSize: theme.fontSize.base,
    lineHeight: '1.5',
  },
  header: {
    borderBottom: `${theme.borderWidth.md} solid ${theme.colors.primary}`,
    paddingBottom: theme.spacing.xl,
    marginBottom: theme.spacing.section,
  },
  name: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.primary,
    margin: '0 0 4px 0',
    letterSpacing: '1px',
  },
  titleLine: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  contactRow: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap' as const,
  },
  section: {
    marginBottom: theme.spacing.xl,
    ...theme.print.avoidBreak,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    borderBottom: `${theme.borderWidth.sm} solid ${theme.colors.border}`,
    paddingBottom: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  summary: {
    color: theme.colors.textSecondary,
    lineHeight: '1.6',
    fontSize: theme.fontSize.base,
  },
  expBlock: {
    marginBottom: theme.spacing.lg,
    ...theme.print.avoidBreak,
  },
  expHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs,
  },
  expRole: {
    fontWeight: '700',
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
  },
  expCompany: {
    fontWeight: '400',
    color: theme.colors.textSecondary,
  },
  expDates: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    whiteSpace: 'nowrap' as const,
  },
  bulletList: {
    margin: '4px 0 0 0',
    paddingLeft: '18px',
    color: theme.colors.textSecondary,
  },
  bullet: {
    marginBottom: theme.spacing.xs,
  },
  eduRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },
  eduSchool: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  eduDetail: {
    color: theme.colors.textSecondary,
  },
  eduYear: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    whiteSpace: 'nowrap' as const,
  },
  skillsWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  skillPill: {
    backgroundColor: theme.colors.bgHighlight,
    color: theme.colors.primary,
    padding: '3px 10px',
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
  },
  certLine: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
  },
}

export function ResumeTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.name}>{data.name}</h1>
        <div style={s.titleLine}>{data.title}</div>
        <div style={s.contactRow}>
          <span>{data.contact.email}</span>
          <span>{data.contact.phone}</span>
          {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
          {data.contact.website && <span>{data.contact.website}</span>}
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Professional Summary</div>
        <div style={s.summary}>{data.summary}</div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Experience</div>
        {data.experience.map((exp, i) => (
          <div key={i} style={s.expBlock}>
            <div style={s.expHeader}>
              <span style={s.expRole}>
                <span style={s.expRole}>{exp.role}</span>
                <span style={s.expCompany}> at {exp.company}</span>
              </span>
              <span style={s.expDates}>
                {exp.startDate} — {exp.endDate || 'Present'}
              </span>
            </div>
            <ul style={s.bulletList}>
              {exp.bulletPoints.map((bp, j) => (
                <li key={j} style={s.bullet}>{bp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Education</div>
        {data.education.map((edu, i) => (
          <div key={i} style={s.eduRow}>
            <span>
              <span style={s.eduSchool}>{edu.institution}</span>
              <span style={s.eduDetail}> — {edu.degree} in {edu.field}</span>
            </span>
            <span style={s.eduYear}>{edu.year}</span>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Skills</div>
        <div style={s.skillsWrap}>
          {data.skills.map((skill, i) => (
            <span key={i} style={s.skillPill}>{skill}</span>
          ))}
        </div>
      </div>

      {data.certifications && data.certifications.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Certifications</div>
          {data.certifications.map((cert, i) => (
            <div key={i} style={s.certLine}>
              <strong>{cert.name}</strong>
              {cert.issuer && <> — {cert.issuer}</>}
              {cert.year && <> ({cert.year})</>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
