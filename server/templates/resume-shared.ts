// Module: server/templates/resume-shared.ts — Shared Zod schemas, types, and utilities
// used by all resume style variants (modern, classic, minimal).

import { z } from 'zod'

// ─── Zod schemas ──────────────────────────────────────────────

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

/** Bilingual labels (CN/EN) auto-detected from CJK characters in the name or summary. */
export interface Labels {
  professionalSummary: string
  projects: string
  experience: string
  education: string
  skills: string
  certifications: string
  keyAchievements: string
  present: string
  at: string
}

export function getLabels(data: Pick<ResumeData, 'name' | 'summary'>): Labels {
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
