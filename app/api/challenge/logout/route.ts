import { NextResponse } from 'next/server'
import { sessionCookieName } from '@/lib/challenge/auth'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(sessionCookieName, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
