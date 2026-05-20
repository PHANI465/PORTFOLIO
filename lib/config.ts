import portfolioData from '@/content/portfolio.json'
import projectsData from '@/content/projects.json'
import resumeData from '@/content/resume.json'
import { Portfolio, Project, Resume } from '@/types'

export function getPortfolio(): Portfolio {
  return portfolioData as Portfolio
}

export function getProjects(): Project[] {
  return projectsData as Project[]
}

export function getFeaturedProjects(): Project[] {
  return (projectsData as Project[]).filter(p => p.featured)
}

export function getProjectById(id: string): Project | undefined {
  return (projectsData as Project[]).find(p => p.id === id)
}

export function getResume(): Resume {
  return resumeData as Resume
}
