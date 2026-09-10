import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { rateLimit } from '@/lib/apiGuard'

export async function POST(req: NextRequest) {
  // A login endpoint with no throttle is a password oracle.
  const blocked = rateLimit(req, { limit: 8, windowMs: 15 * 60_000, name: 'dashboard-auth' })
  if (blocked) return blocked

  const { password } = await req.json()
  const correct = process.env.DASHBOARD_PASSWORD

  if (!correct) {
    return NextResponse.json({ error: 'DASHBOARD_PASSWORD not set in .env.local' }, { status: 503 })
  }

  const a = Buffer.from(String(password ?? ''))
  const b = Buffer.from(correct)
  const ok = a.length === b.length && timingSafeEqual(a, b)

  if (ok) return NextResponse.json({ success: true })
  return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
}
