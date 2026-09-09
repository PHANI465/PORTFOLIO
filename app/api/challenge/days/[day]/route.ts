import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/challenge/auth'
import { adminClient, publicClient, rowToDay, dayToRow } from '@/lib/challenge/supabase'
import { ChallengeDay } from '@/lib/challenge/types'

interface Ctx { params: { day: string } }

const parseDay = (v: string) => {
  const n = Number(v)
  return Number.isInteger(n) && n >= 1 ? n : null
}

/** GET — public read of one published day. */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const dayNumber = parseDay(params.day)
  if (dayNumber === null) {
    return NextResponse.json({ error: 'Invalid day number' }, { status: 400 })
  }

  const sb = publicClient()
  if (!sb) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const { data, error } = await sb
    .from('challenge_days')
    .select('*')
    .eq('day_number', dayNumber)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    console.error('[challenge] get day:', error.message)
    return NextResponse.json({ error: 'Could not load that day.' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'No entry for that day' }, { status: 404 })

  return NextResponse.json({ day: rowToDay(data) })
}

/** PUT — update a day. Admin only. */
export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const dayNumber = parseDay(params.day)
  if (dayNumber === null) {
    return NextResponse.json({ error: 'Invalid day number' }, { status: 400 })
  }

  const sb = adminClient()
  if (!sb) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })

  let body: Partial<ChallengeDay>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const row = dayToRow(body)
  delete row.day_number // the day number is the identifier, not editable here

  if (!Object.keys(row).length) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const { data, error } = await sb
    .from('challenge_days')
    .update(row)
    .eq('day_number', dayNumber)
    .select()
    .maybeSingle()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'That date is already used by another day.' }, { status: 409 })
    }
    console.error('[challenge] update day:', error.message)
    return NextResponse.json({ error: 'Could not update the day.' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'No entry for that day' }, { status: 404 })

  return NextResponse.json({ day: rowToDay(data) })
}

/** DELETE — remove a day and its stored images. Admin only. */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const dayNumber = parseDay(params.day)
  if (dayNumber === null) {
    return NextResponse.json({ error: 'Invalid day number' }, { status: 400 })
  }

  const sb = adminClient()
  if (!sb) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })

  // Read first so we can clean up the images this day owns.
  const { data: existing } = await sb
    .from('challenge_days')
    .select('*')
    .eq('day_number', dayNumber)
    .maybeSingle()

  if (!existing) return NextResponse.json({ error: 'No entry for that day' }, { status: 404 })

  const { error } = await sb.from('challenge_days').delete().eq('day_number', dayNumber)
  if (error) {
    console.error('[challenge] delete day:', error.message)
    return NextResponse.json({ error: 'Could not delete the day.' }, { status: 500 })
  }

  // Best effort image cleanup so storage does not accumulate orphans.
  const paths = [existing.image1_url, existing.image2_url, existing.image3_url, existing.progress_photo_url]
    .filter(Boolean)
    .map((u: string) => u.split('/challenge/').pop())
    .filter(Boolean) as string[]
  if (paths.length) {
    const { error: rmErr } = await sb.storage.from('challenge').remove(paths)
    if (rmErr) console.warn('[challenge] image cleanup:', rmErr.message)
  }

  return NextResponse.json({ success: true })
}
