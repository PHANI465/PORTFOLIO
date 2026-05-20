import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const correct = process.env.DASHBOARD_PASSWORD

  if (!correct) {
    return NextResponse.json({ error: 'DASHBOARD_PASSWORD not set in .env.local' }, { status: 503 })
  }

  if (password === correct) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
}
