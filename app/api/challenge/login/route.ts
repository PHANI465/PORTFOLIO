import { NextRequest, NextResponse } from 'next/server'
import {
  verifyCredentials, createSessionToken, sessionCookieName,
  sessionMaxAge, adminAuthConfigured,
} from '@/lib/challenge/auth'

export async function POST(req: NextRequest) {
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      { error: 'Admin auth is not configured on the server.' },
      { status: 503 }
    )
  }

  let username = ''
  let password = ''
  try {
    const body = await req.json()
    username = String(body.username ?? '')
    password = String(body.password ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!verifyCredentials(username, password)) {
    // Deliberately vague: never reveal which half was wrong.
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(sessionCookieName, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionMaxAge,
  })
  return res
}
