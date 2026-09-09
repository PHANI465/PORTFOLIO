import { NextResponse } from 'next/server'
import { isAdminRequest, adminAuthConfigured } from '@/lib/challenge/auth'

/** Tells the admin UI whether to show the form or the login screen. */
export async function GET() {
  return NextResponse.json({
    authenticated: isAdminRequest(),
    configured: adminAuthConfigured(),
  })
}
