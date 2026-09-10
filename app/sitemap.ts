import type { MetadataRoute } from 'next'
import projectsData from '@/content/projects.json'
import { Project } from '@/types'

/**
 * Public routes only. The 100 day challenge is deliberately excluded so it
 * stays discoverable through the terminal rather than search, matching the
 * disallow in robots.ts. Direct URLs still work either way.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://phaneendragavara.dev').replace(/\/$/, '')
  const now = new Date()

  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const projects = (projectsData as Project[]).map(p => ({
    url: `${base}/projects/${p.id}`,
    lastModified: p.date ? new Date(`${p.date}-01`) : now,
    changeFrequency: 'monthly' as const,
    priority: p.featured ? 0.8 : 0.6,
  }))

  return [...pages, ...projects]
}
