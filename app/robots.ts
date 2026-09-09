import type { MetadataRoute } from 'next'

/**
 * The 100 day challenge is meant to be found through the terminal, not search,
 * so it is disallowed for crawlers. Direct URLs still work: this only affects
 * indexing, never access.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/challenge', '/challenge/', '/dashboard'] }],
  }
}
