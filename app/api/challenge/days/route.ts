import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/challenge/auth'
import { adminClient, fetchPublishedDays, rowToDay, dayToRow } from '@/lib/challenge/supabase'
import { ChallengeDay } from '@/lib/challenge/types'

/** GET /api/challenge/days — public list of published days. No auth. */
export async function GET() {
  const days = await fetchPublishedDays()
  return NextResponse.json({ days })
}

/**
 * POST /api/challenge/days — create a day. Admin only.
 * Authorization is checked here on the server; the service-role key is the
 * only thing that can write, and it never reaches the browser.
 */
export async function POST(req: NextRequest) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sb = adminClient()
  if (!sb) {
    return NextResponse.json(
      { error: 'Supabase is not configured on the server.' },
      { status: 503 }
    )
  }

  let body: Partial<ChallengeDay>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const dayNumber = Number(body.dayNumber)
  if (!Number.isInteger(dayNumber) || dayNumber < 1) {
    return NextResponse.json({ error: 'dayNumber must be a positive integer' }, { status: 400 })
  }
  if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(String(body.date))) {
    return NextResponse.json({ error: 'date must be yyyy-mm-dd' }, { status: 400 })
  }
  if (body.weightKg !== null && body.weightKg !== undefined && Number.isNaN(Number(body.weightKg))) {
    return NextResponse.json({ error: 'weight must be a number or empty' }, { status: 400 })
  }

  const row = dayToRow({
    ...body,
    dayNumber,
    published: body.published ?? true,
    publishedAt: (body.published ?? true) ? new Date().toISOString() : null,
  })

  const { data, error } = await sb.from('challenge_days').insert(row).select().single()

  if (error) {
    // 23505 = unique violation: duplicate day number or duplicate date
    if (error.code === '23505') {
      return NextResponse.json(
        { error: `Day ${dayNumber} or that date already exists. Edit the existing entry instead.` },
        { status: 409 }
      )
    }
    console.error('[challenge] create day:', error.message)
    return NextResponse.json({ error: 'Could not save the day.' }, { status: 500 })
  }

  return NextResponse.json({ day: rowToDay(data) }, { status: 201 })
}
