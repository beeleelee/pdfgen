import React from 'react'
import { z } from 'zod'
import { theme } from './theme.js'

export const ExperienceSchema = z.object({
  company: z.string().describe('Company or organization name'),
  role: z.string().describe('Job title'),
  startDate: z.string().optional().describe('Start date (e.g. Jan 2020)'),
  endDate: z.coerce.string().nullable().optional().describe('End date (e.g. Dec 2023, or "Present")'),
  content: z.string().optional().describe('Description of responsibilities and context'),
  bulletPoints: z
    .array(z.string())
    .optional()
    .describe('Key responsibilities and daily tasks'),
  achievements: z
    .array(z.string())
    .optional()
    .describe('Notable accomplishments and results'),
})

export const EducationSchema = z.object({
  institution: z.string().describe('School or university name'),
  degree: z.string().optional().describe('Degree type (e.g. B.S., M.S.)'),
  field: z.string().optional().describe('Field of study'),
  year: z.coerce.string().optional().describe('Graduation year'),
})

export const ProjectSchema = z.object({
  name: z.string().describe('Project name'),
  role: z.string().optional().describe('Your role on the project'),
  startDate: z.string().optional().describe('Start date (e.g. Jan 2020)'),
  endDate: z.coerce.string().nullable().optional().describe('End date (e.g. Dec 2023, or "Present")'),
  description: z.string().optional().describe('Project description and context'),
  achievements: z
    .array(z.string())
    .optional()
    .describe('Key accomplishments and results'),
  url: z.string().optional().describe('Project URL (e.g. GitHub)'),
  technologies: z.array(z.string()).optional().describe('Technologies used'),
})

export const ResumeDataSchema = z.object({
  name: z.string(),
  title: z.string().optional().describe('Professional headline'),
  contact: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
    github: z.string().optional(),
    location: z.string().optional(),
  }).optional(),
  summary: z.string().optional().describe('Professional summary paragraph'),
  experience: z.array(ExperienceSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  education: z.array(EducationSchema).optional(),
  skills: z.array(z.string()).optional(),
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

const pillColors = [
  { bg: '#eff6ff', text: '#1e40af' },
  { bg: '#f0fdf4', text: '#15803d' },
  { bg: '#fff7ed', text: '#c2410c' },
  { bg: '#f5f3ff', text: '#6d28d9' },
  { bg: '#fce7f3', text: '#be185d' },
]

const s = {
  page: {
    fontFamily: theme.fonts.sans,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    color: theme.colors.text,
    fontSize: theme.fontSize.base,
    lineHeight: '1.5',
  },
  header: {
    backgroundColor: theme.colors.bgHighlight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg + ' ' + theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.primary,
    margin: '0',
    letterSpacing: '1px',
  },
  titleLine: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    marginTop: '2px',
  },
  contactRow: {
    fontSize: theme.fontSize.sm,
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
    marginTop: theme.spacing.sm,
  },
  contactBadge: {
    backgroundColor: theme.colors.bg,
    color: theme.colors.textSecondary,
    padding: '1px 8px',
    borderRadius: '10px',
    border: `1px solid ${theme.colors.border}`,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: theme.spacing.sm,
  },
  sectionTitleBar: {
    width: '3px',
    height: '14px',
    backgroundColor: theme.colors.primary,
    borderRadius: '2px',
    flexShrink: 0,
  },
  paragraph: {
    marginBottom: theme.spacing.xs,
  },
  summary: {
    color: theme.colors.textSecondary,
    lineHeight: '1.6',
    fontSize: theme.fontSize.base,
    paddingLeft: '11px',
    borderLeft: `2px solid ${theme.colors.border}`,
  },
  expBlock: {
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
    borderLeft: `2px solid ${theme.colors.border}`,
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
  contentText: {
    color: theme.colors.textSecondary,
    lineHeight: '1.6',
  },
  bulletList: {
    margin: '4px 0 0 0',
    paddingLeft: '14px',
    color: theme.colors.textSecondary,
  },
  bullet: {
    marginBottom: theme.spacing.xs,
  },
  achievementLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '600',
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    marginBottom: '2px',
  },
  achievementDot: {
    width: '6px',
    height: '6px',
    backgroundColor: theme.colors.accent,
    borderRadius: '50%',
    flexShrink: 0,
  },
  eduRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
    borderLeft: `2px solid ${theme.colors.border}`,
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
    padding: '2px 8px',
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
  },
  certLine: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    paddingLeft: theme.spacing.sm,
    borderLeft: `2px solid ${theme.colors.border}`,
  },
  projUrl: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    marginBottom: theme.spacing.xs,
  },
  techWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    marginTop: theme.spacing.xs,
  },
  techPill: {
    backgroundColor: theme.colors.bgMuted,
    color: theme.colors.textSecondary,
    padding: '2px 7px',
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.xs,
    fontWeight: '500',
  },
}

function getLabels(data: ResumeData) {
  const isCn = /[\u4e00-\u9fff]/.test(data.name || data.summary || '')
  return isCn
    ? {
        professionalSummary: '个人优势',
        projects: '项目经历',
        experience: '工作经历',
        education: '教育经历',
        skills: '技能',
        certifications: '证书',
        keyAchievements: '业绩',
        present: '至今',
        at: ' · ',
      }
    : {
        professionalSummary: 'Professional Summary',
        projects: 'Projects',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        certifications: 'Certifications',
        keyAchievements: 'Key Achievements',
        present: 'Present',
        at: ' at ',
      }
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={s.bulletList}>
      {items.map((item, i) => (
        <li key={i} style={s.bullet}>{item}</li>
      ))}
    </ul>
  )
}

function DateRange({ start, end, present }: { start?: string; end?: string | null; present: string }) {
  if (!start) return null
  return (
    <span style={s.expDates}>
      {start} — {end || present}
    </span>
  )
}

function ExperienceBlock({ exp, labels }: { exp: z.infer<typeof ExperienceSchema>; labels: ReturnType<typeof getLabels> }) {
  return (
    <div style={s.expBlock}>
      <div style={s.expHeader}>
        <span style={s.expRole}>
          <span>{exp.role}</span>
          {exp.company && <span style={s.expCompany}>{labels.at}{exp.company}</span>}
        </span>
        <DateRange start={exp.startDate} end={exp.endDate} present={labels.present} />
      </div>
      {exp.content && (
        <div style={s.contentText}>
            {exp.content.split(/\n+/).filter(Boolean).map((para, i) => (
              <div key={i} style={s.paragraph}>{para}</div>
            ))}
          </div>
      )}
      {exp.bulletPoints && exp.bulletPoints.length > 0 && (
        <BulletList items={exp.bulletPoints} />
      )}
      {exp.achievements && exp.achievements.length > 0 && (
        <>
          <div style={s.achievementLabel}>
            <div style={s.achievementDot} />
            <span>{labels.keyAchievements}</span>
          </div>
          <BulletList items={exp.achievements} />
        </>
      )}
    </div>
  )
}

function ProjectBlock({ proj, labels }: { proj: z.infer<typeof ProjectSchema>; labels: ReturnType<typeof getLabels> }) {
  return (
    <div style={s.expBlock}>
      <div style={s.expHeader}>
        <span style={s.expRole}>
          <span>{proj.name}</span>
          {proj.role && <span style={s.expCompany}> — {proj.role}</span>}
        </span>
        <DateRange start={proj.startDate} end={proj.endDate} present={labels.present} />
      </div>
      {proj.description && (
        <div style={s.contentText}>
            {proj.description.split(/\n+/).filter(Boolean).map((para, i) => (
              <div key={i} style={s.paragraph}>{para}</div>
            ))}
          </div>
      )}
      {proj.achievements && proj.achievements.length > 0 && (
        <>
          <div style={s.achievementLabel}>
            <div style={s.achievementDot} />
            <span>{labels.keyAchievements}</span>
          </div>
          <BulletList items={proj.achievements} />
        </>
      )}
      {proj.technologies && proj.technologies.length > 0 && (
        <div style={s.techWrap}>
          {proj.technologies.map((t, i) => (
            <span key={i} style={s.techPill}>{t}</span>
          ))}
        </div>
      )}
      {proj.url && (
        <div style={s.projUrl}>{proj.url}</div>
      )}
    </div>
  )
}

export function ResumeTemplate({ data }: { data: ResumeData }) {
  const contact = data.contact
  const experience = data.experience || []
  const projects = data.projects || []
  const education = data.education || []
  const skills = data.skills || []
  const l = getLabels(data)

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.name}>{data.name}</h1>
        {data.title && <div style={s.titleLine}>{data.title}</div>}
        {contact && (
          <div style={s.contactRow}>
            {contact.location && <span style={s.contactBadge}>{contact.location}</span>}
            {contact.email && <span style={s.contactBadge}>{contact.email}</span>}
            {contact.phone && <span style={s.contactBadge}>{contact.phone}</span>}
            {contact.github && <span style={s.contactBadge}>{contact.github}</span>}
            {contact.linkedin && <span style={s.contactBadge}>{contact.linkedin}</span>}
            {contact.website && <span style={s.contactBadge}>{contact.website}</span>}
          </div>
        )}
      </div>

      {data.summary && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <div style={s.sectionTitleBar} />
            <span>{l.professionalSummary}</span>
          </div>
          <div style={s.summary}>
            {data.summary.split(/\n+/).filter(Boolean).map((para, i) => (
              <div key={i} style={s.paragraph}>{para}</div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <div style={s.sectionTitleBar} />
            <span>{l.projects}</span>
          </div>
          {projects.map((proj, i) => (
            <ProjectBlock key={i} proj={proj} labels={l} />
          ))}
        </div>
      )}

      {experience.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <div style={s.sectionTitleBar} />
            <span>{l.experience}</span>
          </div>
          {experience.map((exp, i) => (
            <ExperienceBlock key={i} exp={exp} labels={l} />
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <div style={s.sectionTitleBar} />
            <span>{l.education}</span>
          </div>
          {education.map((edu, i) => (
            <div key={i} style={s.eduRow}>
              <span>
                <span style={s.eduSchool}>{edu.institution}</span>
                {edu.degree && (
                  <span style={s.eduDetail}> — {edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                )}
              </span>
              {edu.year && <span style={s.eduYear}>{edu.year}</span>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <div style={s.sectionTitleBar} />
            <span>{l.skills}</span>
          </div>
          <div style={s.skillsWrap}>
            {skills.map((skill, i) => (
              <span key={i} style={{ ...s.skillPill, backgroundColor: pillColors[i % pillColors.length].bg, color: pillColors[i % pillColors.length].text }}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <div style={s.sectionTitleBar} />
            <span>{l.certifications}</span>
          </div>
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
