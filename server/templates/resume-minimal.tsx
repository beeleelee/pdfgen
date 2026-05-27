// Module: server/templates/resume-minimal.tsx — Minimal resume style.
// Features: clean sans-serif, thin HR separators, no colors or backgrounds, max whitespace.

import React from 'react'
import { z } from 'zod'
import { theme } from './theme.js'
import {
  ResumeData,
  ResumeDataSchema,
  ExperienceSchema,
  ProjectSchema,
  EducationSchema,
  getLabels,
  type Labels,
} from './resume-shared.js'

export { ResumeDataSchema }

// ─── Style definitions ───────────────────────────────────────
const s = {
  page: {
    fontFamily: theme.fonts.sans,
    maxWidth: '700px',
    margin: '0 auto',
    padding: '48px 32px',
    color: theme.colors.text,
    fontSize: theme.fontSize.base,
    lineHeight: '1.6',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '300',
    color: theme.colors.text,
    margin: '0',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
  },
  contactCol: {
    textAlign: 'right' as const,
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    lineHeight: '1.8',
  },
  titleLine: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
  hr: {
    border: 'none',
    borderTop: `1px solid ${theme.colors.border}`,
    margin: `${theme.spacing.lg} 0`,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    marginBottom: theme.spacing.sm,
  },
  paragraph: {
    marginBottom: theme.spacing.xs,
  },
  summary: {
    color: theme.colors.textSecondary,
    lineHeight: '1.7',
    fontSize: theme.fontSize.sm,
  },
  expBlock: {
    marginBottom: theme.spacing.sm,
    ...theme.print.avoidBreak,
  },
  expHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '2px',
  },
  expRole: {
    fontWeight: '500',
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  expCompany: {
    fontWeight: '400',
    color: theme.colors.textSecondary,
  },
  expDates: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted,
    whiteSpace: 'nowrap' as const,
  },
  contentText: {
    color: theme.colors.textSecondary,
    lineHeight: '1.6',
    fontSize: theme.fontSize.sm,
  },
  bulletList: {
    margin: '2px 0 0 0',
    paddingLeft: '14px',
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  bullet: {
    marginBottom: '2px',
  },
  achievementLabel: {
    fontWeight: '600',
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    marginTop: theme.spacing.xs,
    marginBottom: '2px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  eduRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs,
  },
  eduSchool: {
    fontWeight: '500',
    color: theme.colors.text,
  },
  eduDetail: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  eduYear: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted,
    whiteSpace: 'nowrap' as const,
  },
  skillsWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
  },
  skillPill: {
    color: theme.colors.textSecondary,
    padding: '1px 0',
    fontSize: theme.fontSize.sm,
    fontWeight: '400',
  },
  skillSep: {
    color: theme.colors.muted,
    fontSize: theme.fontSize.sm,
  },
  certLine: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  projUrl: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    marginBottom: theme.spacing.xs,
  },
  techWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '3px',
    marginTop: theme.spacing.xs,
  },
  techPill: {
    color: theme.colors.muted,
    fontSize: theme.fontSize.xs,
    fontWeight: '500',
  },
}

// ─── Sub-components ──────────────────────────────────────────

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

function ExperienceBlock({ exp, labels }: { exp: z.infer<typeof ExperienceSchema>; labels: Labels }) {
  return (
    <div style={s.expBlock}>
      <div style={s.expHeader}>
        <span style={s.expRole}>
          <span>{exp.role}</span>
          {exp.company && <span style={s.expCompany}> · {exp.company}</span>}
        </span>
        <DateRange start={exp.startDate} end={exp.endDate} present={labels.present} />
      </div>
      {exp.content && (
        <div style={s.contentText}>
            {exp.content.split(/\n+/).filter(Boolean).map((para: string, i: number) => (
              <div key={i} style={s.paragraph}>{para}</div>
            ))}
          </div>
      )}
      {exp.bulletPoints && exp.bulletPoints.length > 0 && (
        <BulletList items={exp.bulletPoints} />
      )}
      {exp.achievements && exp.achievements.length > 0 && (
        <>
          <div style={s.achievementLabel}>{labels.keyAchievements}</div>
          <BulletList items={exp.achievements} />
        </>
      )}
    </div>
  )
}

function ProjectBlock({ proj, labels }: { proj: z.infer<typeof ProjectSchema>; labels: Labels }) {
  const technologies = proj.technologies
  return (
    <div style={s.expBlock}>
      <div style={s.expHeader}>
        <span style={s.expRole}>
          <span>{proj.name}</span>
          {proj.role && <span style={s.expCompany}> · {proj.role}</span>}
        </span>
        <DateRange start={proj.startDate} end={proj.endDate} present={labels.present} />
      </div>
      {proj.description && (
        <div style={s.contentText}>
            {proj.description.split(/\n+/).filter(Boolean).map((para: string, i: number) => (
              <div key={i} style={s.paragraph}>{para}</div>
            ))}
          </div>
      )}
      {proj.achievements && proj.achievements.length > 0 && (
        <>
          <div style={s.achievementLabel}>{labels.keyAchievements}</div>
          <BulletList items={proj.achievements} />
        </>
      )}
      {technologies && technologies.length > 0 && (
        <div style={s.techWrap}>
          {technologies.map((t: string, i: number) => (
            <span key={i} style={s.techPill}>{t}{i < technologies.length - 1 ? ' ·' : ''}</span>
          ))}
        </div>
      )}
      {proj.url && (
        <div style={s.projUrl}>→ {proj.url}</div>
      )}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────

export function ResumeMinimalTemplate({ data }: { data: ResumeData }) {
  const contact = data.contact
  const experience = data.experience || []
  const projects = data.projects || []
  const education = data.education || []
  const skills = data.skills || []
  const l = getLabels(data)

  return (
    <div style={s.page}>
      {/* Header row: name left, contact right */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.name}>{data.name}</h1>
          {data.title && <div style={s.titleLine}>{data.title}</div>}
        </div>
        {contact && (
          <div style={s.contactCol}>
            {contact.email && <div>{contact.email}</div>}
            {contact.phone && <div>{contact.phone}</div>}
            {contact.location && <div>{contact.location}</div>}
            {contact.github && <div>{contact.github}</div>}
            {contact.linkedin && <div>{contact.linkedin}</div>}
            {contact.website && <div>{contact.website}</div>}
          </div>
        )}
      </div>

      <hr style={s.hr} />

      {/* Summary */}
      {data.summary && (
        <div style={s.section}>
          <div style={s.sectionTitle}>{l.professionalSummary}</div>
          <div style={s.summary}>
            {data.summary.split(/\n+/).filter(Boolean).map((para, i) => (
              <div key={i} style={s.paragraph}>{para}</div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>{l.projects}</div>
          {projects.map((proj, i) => (
            <ProjectBlock key={i} proj={proj} labels={l} />
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>{l.experience}</div>
          {experience.map((exp, i) => (
            <ExperienceBlock key={i} exp={exp} labels={l} />
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>{l.education}</div>
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

      {/* Skills */}
      {skills.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>{l.skills}</div>
          <div style={s.skillsWrap}>
            {skills.map((skill, i) => (
              <span key={i}>
                <span style={s.skillPill}>{skill}</span>
                {i < skills.length - 1 && <span style={s.skillSep}> · </span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>{l.certifications}</div>
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
