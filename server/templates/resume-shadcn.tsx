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
    padding: '40px',
    color: '#0c0a09',
    fontSize: theme.fontSize.base,
    lineHeight: '1.6',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: '28px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0c0a09',
    margin: '0',
    letterSpacing: '-0.5px',
  },
  titleLine: {
    fontSize: theme.fontSize.md,
    color: '#78716c',
    marginTop: '2px',
    fontWeight: '500',
  },
  contactWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px 16px',
    fontSize: theme.fontSize.sm,
    color: '#78716c',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTop: '1px solid #e7e5e4',
  },
  section: {
    marginBottom: '24px',
    borderRadius: '8px',
    border: '1px solid #e7e5e4',
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: '#fafaf9',
    padding: '10px 16px',
    borderBottom: '1px solid #e7e5e4',
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: '#44403c',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  sectionBody: {
    padding: '16px',
  },
  paragraph: {
    marginBottom: theme.spacing.xs,
  },
  summary: {
    color: '#57534e',
    lineHeight: '1.7',
    fontSize: theme.fontSize.base,
  },
  expBlock: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottom: '1px solid #f5f5f4',
    ...theme.print.avoidBreak,
  },
  expHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '4px',
  },
  expRole: {
    fontWeight: '600',
    fontSize: theme.fontSize.md,
    color: '#0c0a09',
  },
  expCompany: {
    fontWeight: '400',
    color: '#78716c',
  },
  expDates: {
    fontSize: theme.fontSize.sm,
    color: '#a8a29e',
    whiteSpace: 'nowrap' as const,
  },
  contentText: {
    color: '#57534e',
    lineHeight: '1.6',
  },
  bulletList: {
    margin: '4px 0 0 0',
    paddingLeft: '14px',
    color: '#57534e',
  },
  bullet: {
    marginBottom: theme.spacing.xs,
  },
  achievementLabel: {
    display: 'inline-block',
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: '#d97706',
    backgroundColor: '#fffbeb',
    padding: '1px 8px',
    borderRadius: '4px',
    marginTop: theme.spacing.xs,
    marginBottom: '4px',
  },
  eduRow: {
    marginBottom: theme.spacing.sm,
  },
  eduSchool: {
    fontWeight: '600',
    color: '#0c0a09',
  },
  eduDetail: {
    color: '#57534e',
  },
  eduYear: {
    color: '#a8a29e',
    fontSize: theme.fontSize.sm,
  },
  skillsWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  skillPill: {
    backgroundColor: '#fafaf9',
    color: '#44403c',
    padding: '3px 10px',
    borderRadius: '6px',
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    border: '1px solid #e7e5e4',
  },
  certLine: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.fontSize.base,
    color: '#57534e',
  },
  projUrl: {
    fontSize: theme.fontSize.sm,
    color: '#d97706',
    marginBottom: theme.spacing.xs,
  },
  techWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    marginTop: theme.spacing.xs,
  },
  techPill: {
    backgroundColor: '#fafaf9',
    color: '#78716c',
    padding: '1px 7px',
    borderRadius: '4px',
    fontSize: theme.fontSize.xs,
    fontWeight: '500',
    border: '1px solid #e7e5e4',
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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <span style={s.sectionTitle}>{title}</span>
      </div>
      <div style={s.sectionBody}>
        {children}
      </div>
    </div>
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

export function ResumeShadcnTemplate({ data }: { data: ResumeData }) {
  const contact = data.contact
  const experience = data.experience || []
  const projects = data.projects || []
  const education = data.education || []
  const skills = data.skills || []
  const l = getLabels(data)

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerTop}>
          <div>
            <h1 style={s.name}>{data.name}</h1>
            {data.title && <div style={s.titleLine}>{data.title}</div>}
          </div>
        </div>
        {contact && (
          <div style={s.contactWrap}>
            {contact.location && <span>{contact.location}</span>}
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.github && <span>{contact.github}</span>}
            {contact.linkedin && <span>{contact.linkedin}</span>}
            {contact.website && <span>{contact.website}</span>}
          </div>
        )}
      </div>

      {data.summary && (
        <SectionCard title={l.professionalSummary}>
          <div style={s.summary}>
            {data.summary.split(/\n+/).filter(Boolean).map((para, i) => (
              <div key={i} style={s.paragraph}>{para}</div>
            ))}
          </div>
        </SectionCard>
      )}

      {projects.length > 0 && (
        <SectionCard title={l.projects}>
          {projects.map((proj, i) => (
            <ProjectBlock key={i} proj={proj} labels={l} />
          ))}
        </SectionCard>
      )}

      {experience.length > 0 && (
        <SectionCard title={l.experience}>
          {experience.map((exp, i) => (
            <ExperienceBlock key={i} exp={exp} labels={l} />
          ))}
        </SectionCard>
      )}

      {education.length > 0 && (
        <SectionCard title={l.education}>
          {education.map((edu, i) => (
            <div key={i} style={s.eduRow}>
              <span style={s.eduSchool}>{edu.institution}</span>
              {edu.degree && (
                <span style={s.eduDetail}>
                  {' — '}{edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  {edu.year && <span style={s.eduYear}> ({edu.year})</span>}
                </span>
              )}
            </div>
          ))}
        </SectionCard>
      )}

      {skills.length > 0 && (
        <SectionCard title={l.skills}>
          <div style={s.skillsWrap}>
            {skills.map((skill, i) => (
              <span key={i} style={s.skillPill}>{skill}</span>
            ))}
          </div>
        </SectionCard>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <SectionCard title={l.certifications}>
          {data.certifications.map((cert, i) => (
            <div key={i} style={s.certLine}>
              <strong>{cert.name}</strong>
              {cert.issuer && <> — {cert.issuer}</>}
              {cert.year && <> ({cert.year})</>}
            </div>
          ))}
        </SectionCard>
      )}
    </div>
  )
}
