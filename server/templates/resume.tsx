// Module: server/templates/resume.tsx — Resume/CV template with bilingual (CN/EN) support.
// Includes Zod schemas for validation and a React component with professional layout,
// timeline-style experience blocks, skill pills, and section headers.

import React from 'react'
import { z } from 'zod'
import { theme } from './theme.js'

// ─── Zod schemas ──────────────────────────────────────────────
// Each schema maps to a section of the resume. The LLM generates data
// that gets validated against these before rendering.

export const ExperienceSchema = z.object({
  company: z.string().describe('Company or organization name'),
  role: z.string().describe('Job title'),
  startDate: z.string().optional().describe('Start date (e.g. Jan 2020)'),
  endDate: z.coerce.string().nullable().optional().describe('End date (e.g. Dec 2023, or "Present")'),
  content: z.string().optional().describe('Description of responsibilities and context'),
  // bulletPoints: daily tasks / regular duties
  bulletPoints: z
    .array(z.string())
    .optional()
    .describe('Key responsibilities and daily tasks'),
  // achievements: notable results / 业绩
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

// Cycling palette for skill pills — each skill gets the next color
const pillColors = [
  { border: '#3b82f6', text: '#3b82f6' },
  { border: '#06b6d4', text: '#06b6d4' },
  { border: '#8b5cf6', text: '#8b5cf6' },
  { border: '#10b981', text: '#10b981' },
  { border: '#f59e0b', text: '#f59e0b' },
]

// ─── Inline style definitions ─────────────────────────────────
// Centralized style object for the resume template. Organized by section
// to make the component JSX cleaner and facilitate reuse.
const s = {
  // Page-level container with subtle dot-grid background
  page: {
    fontFamily: theme.fonts.sans,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    color: theme.colors.text,
    fontSize: theme.fontSize.base,
    lineHeight: '1.5',
    backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.06) 0.5px, transparent 0.5px)',
    backgroundSize: '20px 20px',
  },
  // Header with dark gradient background and white text
  header: {
    background: theme.gradients.header,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg + ' ' + theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  headerAccent: {
    width: '40px',
    height: '2px',
    background: theme.gradients.accentUnderline,
    borderRadius: '1px',
    marginTop: theme.spacing.sm,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: '#ffffff',
    margin: '0',
    letterSpacing: '1px',
  },
  titleLine: {
    fontSize: theme.fontSize.lg,
    color: '#cbd5e1',
  },
  contactRow: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    marginTop: theme.spacing.sm,
  },
  // Section container with bottom margin
  section: {
    marginBottom: theme.spacing.md,
  },
  // Section title with uppercase label and colored underline
  sectionTitle: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: theme.spacing.sm,
  },
  sectionTitleUnderline: {
    width: '30px',
    height: '2px',
    background: theme.gradients.accentUnderline,
    borderRadius: '1px',
  },
  paragraph: {
    marginBottom: theme.spacing.xs,
  },
  summary: {
    color: theme.colors.textSecondary,
    lineHeight: '1.6',
    fontSize: theme.fontSize.base,
  },
  // Experience/project block with left blue border timeline style
  expBlock: {
    position: 'relative' as const,
    marginBottom: theme.spacing.sm,
    paddingLeft: '16px',
    borderLeft: '2px solid #3b82f6',
    ...theme.print.avoidBreak,
  },
  timelineDot: {
    position: 'absolute' as const,
    left: '-5px',
    top: '4px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
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
  // "Key Achievements" / 业绩 label with cyan accent
  achievementLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '600',
    fontSize: theme.fontSize.sm,
    color: theme.colors.accentTech,
    backgroundColor: 'rgba(6,182,212,0.08)',
    padding: '2px 8px',
    borderRadius: '4px',
    marginTop: theme.spacing.xs,
    marginBottom: '2px',
  },
  achievementDot: {
    width: '6px',
    height: '6px',
    backgroundColor: theme.colors.accentTech,
    borderRadius: '50%',
    flexShrink: 0,
  },
  // Education row with left border
  eduRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
    paddingLeft: '16px',
    borderLeft: '2px solid #3b82f6',
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
    borderWidth: '1px',
    borderStyle: 'solid' as const,
    backgroundColor: 'transparent',
  },
  certLine: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    paddingLeft: '16px',
    borderLeft: '2px solid #3b82f6',
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

/**
 * Picks Chinese or English labels based on detecting CJK characters in the name/summary.
 * This lets the template auto-adapt for bilingual users without explicit configuration.
 */
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

/** Renders an unordered list of bullet points. */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={s.bulletList}>
      {items.map((item, i) => (
        <li key={i} style={s.bullet}>{item}</li>
      ))}
    </ul>
  )
}

/** Formats a date range (e.g. "Jan 2020 — Present"). Returns null if no start date. */
function DateRange({ start, end, present }: { start?: string; end?: string | null; present: string }) {
  if (!start) return null
  return (
    <span style={s.expDates}>
      {start} — {end || present}
    </span>
  )
}

/** Single experience entry with timeline style, content paragraphs, bullet points, and achievements. */
function ExperienceBlock({ exp, labels }: { exp: z.infer<typeof ExperienceSchema>; labels: ReturnType<typeof getLabels> }) {
  return (
    <div style={s.expBlock}>
      <div style={s.timelineDot} />
      <div style={s.expHeader}>
        <span style={s.expRole}>
          <span>{exp.role}</span>
          {exp.company && <span style={s.expCompany}>{labels.at}{exp.company}</span>}
        </span>
        <DateRange start={exp.startDate} end={exp.endDate} present={labels.present} />
      </div>
      {/* Content is split on \n+ to handle multi-paragraph LLM output */}
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

/** Single project entry — similar layout to ExperienceBlock but with technology pills and URL. */
function ProjectBlock({ proj, labels }: { proj: z.infer<typeof ProjectSchema>; labels: ReturnType<typeof getLabels> }) {
  return (
    <div style={s.expBlock}>
      <div style={s.timelineDot} />
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
        <div style={s.projUrl}>→ {proj.url}</div>
      )}
    </div>
  )
}

/**
 * ResumeTemplate — the main resume component.
 * Renders sections in order: header → summary → projects → experience → education → skills → certifications.
 * Uses bilingual labels (CN/EN) based on the name/summary content.
 */
export function ResumeTemplate({ data }: { data: ResumeData }) {
  const contact = data.contact
  const experience = data.experience || []
  const projects = data.projects || []
  const education = data.education || []
  const skills = data.skills || []
  const l = getLabels(data)

  return (
    <div style={s.page}>
      {/* Header: name, title, contact info joined by bullets */}
      <div style={s.header}>
        <div style={s.nameRow}>
          <h1 style={s.name}>{data.name}</h1>
          {data.title && <span style={s.titleLine}>{data.title}</span>}
        </div>
        {contact && (
          <div style={s.contactRow}>
            {[contact.location, contact.email, contact.phone, contact.github, contact.linkedin, contact.website].filter(Boolean).join(' · ')}
          </div>
        )}
        <div style={s.headerAccent} />
      </div>

      {/* Professional Summary — split on newlines for multi-paragraph LLM output */}
      {data.summary && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span>{l.professionalSummary}</span>
            <div style={s.sectionTitleUnderline} />
          </div>
          <div style={s.summary}>
            {data.summary.split(/\n+/).filter(Boolean).map((para, i) => (
              <div key={i} style={s.paragraph}>{para}</div>
            ))}
          </div>
        </div>
      )}

      {/* Projects section (rendered before experience for Chinese resume convention) */}
      {projects.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span>{l.projects}</span>
            <div style={s.sectionTitleUnderline} />
          </div>
          {projects.map((proj, i) => (
            <ProjectBlock key={i} proj={proj} labels={l} />
          ))}
        </div>
      )}

      {/* Experience section */}
      {experience.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span>{l.experience}</span>
            <div style={s.sectionTitleUnderline} />
          </div>
          {experience.map((exp, i) => (
            <ExperienceBlock key={i} exp={exp} labels={l} />
          ))}
        </div>
      )}

      {/* Education section */}
      {education.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span>{l.education}</span>
            <div style={s.sectionTitleUnderline} />
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

      {/* Skills — rendered as colored pills that cycle through pillColors */}
      {skills.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span>{l.skills}</span>
            <div style={s.sectionTitleUnderline} />
          </div>
          <div style={s.skillsWrap}>
            {skills.map((skill, i) => (
              <span key={i} style={{ ...s.skillPill, borderColor: pillColors[i % pillColors.length].border, color: pillColors[i % pillColors.length].text }}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span>{l.certifications}</span>
            <div style={s.sectionTitleUnderline} />
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
