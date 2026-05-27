// Module: server/templates/resume-classic.tsx — Classic resume style.
// Features: serif font, centered header, bordered section boxes, traditional paper-like layout.

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
    fontFamily: theme.fonts.serif,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '48px',
    color: theme.colors.text,
    fontSize: theme.fontSize.base,
    lineHeight: '1.6',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: theme.spacing.section,
    paddingBottom: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  name: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    margin: '0 0 4px 0',
    letterSpacing: '0.5px',
  },
  titleLine: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  contactRow: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    marginTop: theme.spacing.sm,
  },
  sectionBox: {
    marginBottom: theme.spacing.lg,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.bgMuted,
    padding: theme.spacing.lg,
    ...theme.print.avoidBreak,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  paragraph: {
    marginBottom: theme.spacing.xs,
  },
  summary: {
    color: theme.colors.textSecondary,
    lineHeight: '1.7',
    fontStyle: 'italic' as const,
  },
  expBlock: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.border}`,
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
    fontStyle: 'italic' as const,
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
    paddingLeft: '18px',
    color: theme.colors.textSecondary,
  },
  bullet: {
    marginBottom: theme.spacing.xs,
  },
  achievementLabel: {
    fontWeight: '600',
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    marginTop: theme.spacing.xs,
    marginBottom: '2px',
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
    marginTop: theme.spacing.xs,
  },
  skillPill: {
    backgroundColor: theme.colors.bgHighlight,
    color: theme.colors.primary,
    padding: '3px 10px',
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    border: `1px solid ${theme.colors.primaryLight}`,
  },
  certLine: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.fontSize.base,
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
          {exp.company && <span style={s.expCompany}> — {exp.company}</span>}
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
      {proj.technologies && proj.technologies.length > 0 && (
        <div style={s.techWrap}>
          {proj.technologies.map((t: string, i: number) => (
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

// ─── Main component ──────────────────────────────────────────

export function ResumeClassicTemplate({ data }: { data: ResumeData }) {
  const contact = data.contact
  const experience = data.experience || []
  const projects = data.projects || []
  const education = data.education || []
  const skills = data.skills || []
  const l = getLabels(data)

  return (
    <div style={s.page}>
      {/* Centered header */}
      <div style={s.header}>
        <h1 style={s.name}>{data.name}</h1>
        {data.title && <div style={s.titleLine}>{data.title}</div>}
        {contact && (
          <div style={s.contactRow}>
            {[contact.location, contact.email, contact.phone, contact.github, contact.linkedin, contact.website].filter(Boolean).join(' · ')}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div style={s.sectionBox}>
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
        <div style={s.sectionBox}>
          <div style={s.sectionTitle}>{l.projects}</div>
          {projects.map((proj, i) => (
            <ProjectBlock key={i} proj={proj} labels={l} />
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={s.sectionBox}>
          <div style={s.sectionTitle}>{l.experience}</div>
          {experience.map((exp, i) => (
            <ExperienceBlock key={i} exp={exp} labels={l} />
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={s.sectionBox}>
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
        <div style={s.sectionBox}>
          <div style={s.sectionTitle}>{l.skills}</div>
          <div style={s.skillsWrap}>
            {skills.map((skill, i) => (
              <span key={i} style={s.skillPill}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div style={s.sectionBox}>
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
