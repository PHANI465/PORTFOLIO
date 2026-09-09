import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/challenge/auth'
import { adminClient, fetchConfig, rowToConfig, configToRow } from '@/lib/challenge/supabase'
import { ChallengeConfig } from '@/lib/challenge/types'

/** GET — public read of the challenge configuration. */
export async function GET() {
  const config = await fetchConfig()
  return NextResponse.json({ config })
}

/** PUT — update configuration. Admin only. */
export async function PUT(req: NextRequest) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sb = adminClient()
  if (!sb) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })

  let body: Partial<ChallengeConfig>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body.challengeLength !== undefined && Number(body.challengeLength) < 1) {
    return NextResponse.json({ error: 'challengeLength must be at least 1' }, { status: 400 })
  }
  if (body.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(body.startDate))) {
    return NextResponse.json({ error: 'startDate must be yyyy-mm-dd' }, { status: 400 })
  }

  const { data, error } = await sb
    .from('challenge_config')
    .update(configToRow(body))
    .eq('id', 1)
    .select()
    .maybeSingle()

  if (error) {
    console.error('[challenge] update config:', error.message)
    return NextResponse.json({ error: 'Could not update configuration.' }, { status: 500 })
  }

  return NextResponse.json({ config: rowToConfig(data) })
}
