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

const s = {
  page: {
    fontFamily: theme.fonts.sans,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px',
    color: theme.colors.text,
    fontSize: theme.fontSize.base,
    lineHeight: '1.6',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '24px',
  },
  initialsBox: {
    backgroundColor: '#334155',
    color: '#ffffff',
    borderRadius: theme.borderRadius.sm,
    padding: '8px 12px',
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    lineHeight: '1.2',
    textAlign: 'center' as const,
    minWidth: '44px',
  },
  headerInfo: {
    flex: '1',
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
    margin: '0',
    letterSpacing: '0.5px',
  },
  titleLine: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: '2px',
  },
  twoCol: {
    display: 'flex',
    gap: '28px',
  },
  leftCol: {
    width: '180px',
    flexShrink: 0,
  },
  rightCol: {
    flex: '1',
    minWidth: 0,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    marginBottom: theme.spacing.sm,
  },
  leftSectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: theme.spacing.sm,
  },
  paragraph: {
    marginBottom: theme.spacing.xs,
  },
  summary: {
    color: theme.colors.textSecondary,
    lineHeight: '1.7',
    fontSize: theme.fontSize.base,
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
    fontWeight: '600',
    fontSize: theme.fontSize.md,
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
    fontSize: theme.fontSize.base,
  },
  bulletList: {
    margin: '2px 0 0 0',
    paddingLeft: '14px',
    color: theme.colors.textSecondary,
  },
  bullet: {
    marginBottom: '2px',
  },
  achievementLabel: {
    fontWeight: '600',
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    marginTop: theme.spacing.xs,
    marginBottom: '2px',
  },
  eduRow: {
    marginBottom: theme.spacing.xs,
  },
  eduSchool: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  eduDetail: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  eduYear: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
  },
  leftBlock: {
    marginBottom: theme.spacing.md,
  },
  contactList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: '1.8',
  },
  skillsWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
  },
  skillTag: {
    backgroundColor: '#f1f5f9',
    color: theme.colors.textSecondary,
    padding: '2px 8px',
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
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
  techTag: {
    backgroundColor: '#f1f5f9',
    color: theme.colors.muted,
    padding: '1px 6px',
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.xs,
    fontWeight: '500',
  },
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
            <span key={i} style={s.techTag}>{t}</span>
          ))}
        </div>
      )}
      {proj.url && (
        <div style={s.projUrl}>→ {proj.url}</div>
      )}
    </div>
  )
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ResumeUniTemplate({ data }: { data: ResumeData }) {
  const contact = data.contact
  const experience = data.experience || []
  const projects = data.projects || []
  const education = data.education || []
  const skills = data.skills || []
  const l = getLabels(data)

  const leftContent = (
    <>
      {contact && (
        <div style={s.leftBlock}>
          <div style={s.leftSectionTitle}>{l.professionalSummary}</div>
          <ul style={s.contactList}>
            {contact.location && <li>{contact.location}</li>}
            {contact.email && <li>{contact.email}</li>}
            {contact.phone && <li>{contact.phone}</li>}
            {contact.github && <li>{contact.github}</li>}
            {contact.linkedin && <li>{contact.linkedin}</li>}
            {contact.website && <li>{contact.website}</li>}
          </ul>
        </div>
      )}

      {skills.length > 0 && (
        <div style={s.leftBlock}>
          <div style={s.leftSectionTitle}>{l.skills}</div>
          <div style={s.skillsWrap}>
            {skills.map((skill, i) => (
              <span key={i} style={s.skillTag}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <div style={s.leftBlock}>
          <div style={s.leftSectionTitle}>{l.certifications}</div>
          {data.certifications.map((cert, i) => (
            <div key={i} style={s.certLine}>
              <strong>{cert.name}</strong>
              {cert.issuer && <div>{cert.issuer}</div>}
              {cert.year && <div>{cert.year}</div>}
            </div>
          ))}
        </div>
      )}
    </>
  )

  const rightContent = (
    <>
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

      {projects.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>{l.projects}</div>
          {projects.map((proj, i) => (
            <ProjectBlock key={i} proj={proj} labels={l} />
          ))}
        </div>
      )}

      {experience.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>{l.experience}</div>
          {experience.map((exp, i) => (
            <ExperienceBlock key={i} exp={exp} labels={l} />
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>{l.education}</div>
          {education.map((edu, i) => (
            <div key={i} style={s.eduRow}>
              <span style={s.eduSchool}>{edu.institution}</span>
              {edu.degree && (
                <span style={s.eduDetail}>
                  {' — '}{edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  {edu.year && <span> ({edu.year})</span>}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.initialsBox}>
          {getInitials(data.name).split('').map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>
        <div style={s.headerInfo}>
          <h1 style={s.name}>{data.name}</h1>
          {data.title && <div style={s.titleLine}>{data.title}</div>}
        </div>
      </div>

      <div style={s.twoCol}>
        <div style={s.leftCol}>
          {leftContent}
        </div>
        <div style={s.rightCol}>
          {rightContent}
        </div>
      </div>
    </div>
  )
}
