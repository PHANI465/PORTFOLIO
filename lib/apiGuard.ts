import { NextRequest, NextResponse } from 'next/server'

/**
 * Abuse protection for the public, unauthenticated API routes.
 *
 * /api/assistant and /api/contact spend real money (OpenAI tokens, Resend
 * sends) and require no credential by design, so without a guard anyone can
 * loop them and drain the account. These two checks raise the bar a lot for
 * near-zero complexity:
 *
 *   sameOrigin  - the request must come from this site, not another page
 *                 embedding the endpoint or a bare script.
 *   rateLimit   - a per-IP budget over a rolling window.
 *
 * Caveat worth knowing: serverless instances do not share memory, so the
 * counter is per-instance rather than global. It stops casual scraping and
 * accidental loops, not a determined distributed attacker. Moving to a
 * shared store (Upstash Redis, Vercel KV) is the upgrade path if abuse
 * ever actually happens.
 */

interface Bucket { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()
const MAX_KEYS = 5000

function clientKey(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  return (fwd ? fwd.split(',')[0] : req.headers.get('x-real-ip') || 'unknown').trim()
}

/** Returns null when allowed, or a 429 response when over budget. */
export function rateLimit(
  req: NextRequest,
  { limit, windowMs, name }: { limit: number; windowMs: number; name: string }
): NextResponse | null {
  const key = `${name}:${clientKey(req)}`
  const now = Date.now()

  // cheap eviction so the map cannot grow without bound
  if (buckets.size > MAX_KEYS) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k)
    if (buckets.size > MAX_KEYS) buckets.clear()
  }

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  bucket.count += 1
  if (bucket.count > limit) {
    const retry = Math.ceil((bucket.resetAt - now) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. Please slow down and try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retry) } }
    )
  }
  return null
}

/**
 * Rejects requests that did not originate from this site.
 * Browsers always send Origin on cross-site POSTs, so this blocks other
 * pages embedding the endpoint. A direct script can forge the header, which
 * is what the rate limit is for.
 */
export function sameOrigin(req: NextRequest): NextResponse | null {
  const host = req.headers.get('host')
  if (!host) return null

  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  const source = origin || referer
  if (!source) return null // same-origin GETs and curl send neither

  try {
    if (new URL(source).host === host) return null
  } catch {
    // malformed header, fall through to the rejection below
  }

  return NextResponse.json({ error: 'Cross-origin requests are not allowed.' }, { status: 403 })
}
