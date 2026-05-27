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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px',
    color: '#24292f',
    fontSize: theme.fontSize.base,
    lineHeight: '1.6',
  },
  header: {
    paddingBottom: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderBottom: '1px solid #d0d7de',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  name: {
    fontSize: '26px',
    fontWeight: '600',
    color: '#24292f',
    margin: '0',
  },
  titleLine: {
    fontSize: theme.fontSize.lg,
    color: '#57606a',
  },
  contactRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px 20px',
    fontSize: theme.fontSize.sm,
    color: '#57606a',
    marginTop: theme.spacing.sm,
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  section: {
    marginBottom: theme.spacing.lg,
    ...theme.print.avoidBreak,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: theme.spacing.sm,
  },
  sectionAccent: {
    width: '3px',
    height: '16px',
    borderRadius: '2px',
    backgroundColor: '#0969da',
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: '#24292f',
  },
  paragraph: {
    marginBottom: theme.spacing.xs,
  },
  summary: {
    color: '#57606a',
    lineHeight: '1.7',
    paddingLeft: '11px',
  },
  expBlock: {
    marginBottom: theme.spacing.sm,
    paddingLeft: '11px',
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
    color: '#24292f',
  },
  expCompany: {
    fontWeight: '400',
    color: '#57606a',
  },
  expDates: {
    fontSize: theme.fontSize.sm,
    color: '#6e7781',
    whiteSpace: 'nowrap' as const,
  },
  contentText: {
    color: '#57606a',
    lineHeight: '1.6',
  },
  bulletList: {
    margin: '2px 0 0 0',
    paddingLeft: '14px',
    color: '#57606a',
  },
  bullet: {
    marginBottom: '2px',
  },
  achievementLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: '#116329',
    marginTop: theme.spacing.xs,
    marginBottom: '2px',
  },
  eduRow: {
    paddingLeft: '11px',
    marginBottom: theme.spacing.xs,
  },
  eduSchool: {
    fontWeight: '600',
    color: '#24292f',
  },
  eduDetail: {
    color: '#57606a',
  },
  eduYear: {
    color: '#6e7781',
    fontSize: theme.fontSize.sm,
  },
  skillsWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    paddingLeft: '11px',
  },
  skillPill: {
    backgroundColor: '#ddf4ff',
    color: '#0969da',
    padding: '2px 8px',
    borderRadius: '100px',
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
  },
  certLine: {
    paddingLeft: '11px',
    marginBottom: theme.spacing.xs,
    fontSize: theme.fontSize.base,
    color: '#57606a',
  },
  projUrl: {
    fontSize: theme.fontSize.sm,
    color: '#0969da',
    marginBottom: theme.spacing.xs,
  },
  techWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '3px',
    marginTop: theme.spacing.xs,
  },
  techPill: {
    backgroundColor: '#f6f8fa',
    color: '#57606a',
    padding: '1px 6px',
    borderRadius: '100px',
    fontSize: theme.fontSize.xs,
    fontWeight: '500',
  },
}

const accentColors = ['#0969da', '#cf222e', '#1a7f37', '#8250df', '#bf3989', '#0550ae']

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

function SectionWrapper({ title, accentColor, children }: { title: string; accentColor: string; children: React.ReactNode }) {
  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <div style={{ ...s.sectionAccent, backgroundColor: accentColor }} />
        <span style={s.sectionTitle}>{title}</span>
      </div>
      {children}
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

export function ResumeGithubTemplate({ data }: { data: ResumeData }) {
  const contact = data.contact
  const experience = data.experience || []
  const projects = data.projects || []
  const education = data.education || []
  const skills = data.skills || []
  const l = getLabels(data)

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.nameRow}>
          <h1 style={s.name}>{data.name}</h1>
          {data.title && <span style={s.titleLine}>{data.title}</span>}
        </div>
        {contact && (
          <div style={s.contactRow}>
            {contact.location && <span style={s.contactItem}>{contact.location}</span>}
            {contact.email && <span style={s.contactItem}>✉ {contact.email}</span>}
            {contact.phone && <span style={s.contactItem}>{contact.phone}</span>}
            {contact.github && <span style={s.contactItem}>{contact.github}</span>}
            {contact.linkedin && <span style={s.contactItem}>{contact.linkedin}</span>}
            {contact.website && <span style={s.contactItem}>{contact.website}</span>}
          </div>
        )}
      </div>

      {data.summary && (
        <SectionWrapper title={l.professionalSummary} accentColor={accentColors[0]}>
          <div style={s.summary}>
            {data.summary.split(/\n+/).filter(Boolean).map((para, i) => (
              <div key={i} style={s.paragraph}>{para}</div>
            ))}
          </div>
        </SectionWrapper>
      )}

      {projects.length > 0 && (
        <SectionWrapper title={l.projects} accentColor={accentColors[2]}>
          {projects.map((proj, i) => (
            <ProjectBlock key={i} proj={proj} labels={l} />
          ))}
        </SectionWrapper>
      )}

      {experience.length > 0 && (
        <SectionWrapper title={l.experience} accentColor={accentColors[0]}>
          {experience.map((exp, i) => (
            <ExperienceBlock key={i} exp={exp} labels={l} />
          ))}
        </SectionWrapper>
      )}

      {education.length > 0 && (
        <SectionWrapper title={l.education} accentColor={accentColors[3]}>
          {education.map((edu, i) => (
            <div key={i} style={s.eduRow}>
              <span style={s.eduSchool}>{edu.institution}</span>
              {edu.degree && (
                <span style={s.eduDetail}>
                  {' — '}{edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </span>
              )}
              {edu.year && <span style={s.eduYear}> ({edu.year})</span>}
            </div>
          ))}
        </SectionWrapper>
      )}

      {skills.length > 0 && (
        <SectionWrapper title={l.skills} accentColor={accentColors[4]}>
          <div style={s.skillsWrap}>
            {skills.map((skill, i) => (
              <span key={i} style={s.skillPill}>{skill}</span>
            ))}
          </div>
        </SectionWrapper>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <SectionWrapper title={l.certifications} accentColor={accentColors[1]}>
          {data.certifications.map((cert, i) => (
            <div key={i} style={s.certLine}>
              <strong>{cert.name}</strong>
              {cert.issuer && <> — {cert.issuer}</>}
              {cert.year && <> ({cert.year})</>}
            </div>
          ))}
        </SectionWrapper>
      )}
    </div>
  )
}
