import projectsData from '@/content/projects.json'
import resumeData from '@/content/resume.json'
import { Project, Resume, ExperienceItem } from '@/types'

const projects = projectsData as Project[]
const resume = resumeData as Resume

/** lowercase, strip punctuation (keeping + and #), collapse whitespace */
const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9+#\s]/g, ' ').replace(/\s+/g, ' ').trim()

const tokens = (s: string) => norm(s).split(' ').filter(Boolean)

/**
 * Whether a tech/skill string refers to the same thing as `skill`.
 * Short names (R, Go, SQL, C++) must match a whole token, otherwise "R" would
 * match "React" and "Go" would match "Django". Longer names match on substring
 * either way, so "React" matches "React 18" and "GPT-4o" matches
 * "Azure OpenAI (GPT-4o)".
 */
export function techMatches(candidate: string, skill: string): boolean {
  const a = norm(candidate)
  const b = norm(skill)
  if (!a || !b) return false
  if (a === b) return true
  if (b.length <= 3) return tokens(candidate).includes(b)
  return a.includes(b) || b.includes(a)
}

export interface SkillProjectUse {
  project: Project
  /** highlights that explicitly mention the skill */
  evidence: string[]
}

/** Projects whose tech stack includes the skill, newest first. */
export function projectsForSkill(skill: string): SkillProjectUse[] {
  const b = norm(skill)
  return projects
    .filter(p => p.tech.some(t => techMatches(t, skill)))
    .sort((x, y) => (y.date || '').localeCompare(x.date || ''))
    .map(project => {
      const evidence = (project.highlights || [])
        .filter(h => {
          const hn = norm(h)
          return b.length <= 3 ? tokens(h).includes(b) : hn.includes(b)
        })
        .slice(0, 2)
      return { project, evidence }
    })
}

/** Roles that list the skill, most recent first. */
export function experienceForSkill(skill: string): ExperienceItem[] {
  return [...resume.experience]
    .filter(e => (e.skills || []).some(s => techMatches(s, skill)))
    .sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''))
}

/** The resume skill categories this skill belongs to. */
export function categoriesForSkill(skill: string): string[] {
  return resume.skills
    .filter(c => c.skills.some(s => techMatches(s, skill)))
    .map(c => c.category)
}

export interface SkillUsage {
  skill: string
  uses: SkillProjectUse[]
  roles: ExperienceItem[]
  categories: string[]
  projectCount: number
}

export function getSkillUsage(skill: string): SkillUsage {
  const uses = projectsForSkill(skill)
  return {
    skill,
    uses,
    roles: experienceForSkill(skill),
    categories: categoriesForSkill(skill),
    projectCount: uses.length,
  }
}

/** How many projects use each skill — used to show a count on the tag. */
export const projectCountForSkill = (skill: string) =>
  projects.filter(p => p.tech.some(t => techMatches(t, skill))).length
