import React from 'react'
import { z } from 'zod'

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

const styles = {
  container: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    color: '#333',
    fontSize: '11px',
    lineHeight: '1.5',
  },
  header: {
    textAlign: 'center' as const,
    borderBottom: '2px solid #1e293b',
    paddingBottom: '15px',
    marginBottom: '20px',
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
  title: {
    fontSize: '14px',
    color: '#475569',
    margin: '0 0 8px 0',
    fontWeight: '400',
  },
  contactRow: {
    fontSize: '10px',
    color: '#64748b',
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap' as const,
  },
  section: {
    marginBottom: '18px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1e293b',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '4px',
    marginBottom: '8px',
  },
  summaryText: {
    color: '#475569',
    lineHeight: '1.6',
  },
  experienceItem: {
    marginBottom: '12px',
  },
  expHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '3px',
  },
  companyRole: {
    fontWeight: '700',
    fontSize: '12px',
    color: '#1e293b',
  },
  dates: {
    fontSize: '10px',
    color: '#64748b',
    whiteSpace: 'nowrap' as const,
  },
  bulletList: {
    margin: '4px 0 0 0',
    paddingLeft: '18px',
    color: '#475569',
  },
  bulletItem: {
    marginBottom: '2px',
  },
  eduItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '4px',
  },
  institution: {
    fontWeight: '600',
    fontSize: '11px',
    color: '#1e293b',
  },
  degree: {
    color: '#475569',
  },
  eduYear: {
    fontSize: '10px',
    color: '#64748b',
    whiteSpace: 'nowrap' as const,
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
  },
  skillItem: {
    backgroundColor: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: '3px',
    fontSize: '10px',
    color: '#334155',
  },
  certItem: {
    marginBottom: '3px',
    fontSize: '10px',
    color: '#475569',
  },
}

export function ResumeTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.name}>{data.name}</h1>
        <div style={styles.title}>{data.title}</div>
        <div style={styles.contactRow}>
          <span>{data.contact.email}</span>
          <span>{data.contact.phone}</span>
          {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
          {data.contact.website && <span>{data.contact.website}</span>}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Professional Summary</div>
        <div style={styles.summaryText}>{data.summary}</div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Experience</div>
        {data.experience.map((exp, i) => (
          <div key={i} style={styles.experienceItem}>
            <div style={styles.expHeader}>
              <span style={styles.companyRole}>
                {exp.role} at {exp.company}
              </span>
              <span style={styles.dates}>
                {exp.startDate} — {exp.endDate}
              </span>
            </div>
            <ul style={styles.bulletList}>
              {exp.bulletPoints.map((bp, j) => (
                <li key={j} style={styles.bulletItem}>
                  {bp}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Education</div>
        {data.education.map((edu, i) => (
          <div key={i} style={styles.eduItem}>
            <span>
              <span style={styles.institution}>{edu.institution}</span>
              <span style={styles.degree}>
                {' '}
                — {edu.degree} in {edu.field}
              </span>
            </span>
            <span style={styles.eduYear}>{edu.year}</span>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Skills</div>
        <div style={styles.skillsList}>
          {data.skills.map((skill, i) => (
            <span key={i} style={styles.skillItem}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {data.certifications && data.certifications.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Certifications</div>
          {data.certifications.map((cert, i) => (
            <div key={i} style={styles.certItem}>
              <strong>{cert.name}</strong> — {cert.issuer} ({cert.year})
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
