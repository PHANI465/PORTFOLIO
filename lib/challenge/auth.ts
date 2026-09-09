import { createHmac, timingSafeEqual, scryptSync, randomBytes } from 'crypto'
import { cookies } from 'next/headers'

/**
 * Single-admin authentication for challenge write operations.
 *
 * Why not NextAuth: there is exactly one user and no OAuth provider, so a
 * signed httpOnly cookie is the smaller, production-appropriate choice.
 *
 * The password is never stored in plaintext. Set CHALLENGE_ADMIN_PASSWORD_HASH
 * to a "salt:hash" scrypt pair (generate with `npm run challenge:hash`).
 * Nothing here is ever sent to the browser: the cookie is httpOnly and holds
 * only an expiry plus an HMAC signature, never the password or the secret.
 */

const COOKIE = 'challenge_session'
const MAX_AGE_SECONDS = 60 * 60 * 12 // 12 hours

const secret = () => process.env.CHALLENGE_SESSION_SECRET || ''

/** Hash a plaintext password into the "salt:hash" form stored in env. */
export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(plain, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

/** Constant-time check of a submitted username + password against env. */
export function verifyCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.CHALLENGE_ADMIN_USER || ''
  const stored = process.env.CHALLENGE_ADMIN_PASSWORD_HASH || ''
  if (!expectedUser || !stored || !secret()) return false

  const [salt, expectedHash] = stored.split(':')
  if (!salt || !expectedHash) return false

  const userOk = safeEqual(username, expectedUser)
  let passOk = false
  try {
    passOk = safeEqual(scryptSync(password, salt, 64).toString('hex'), expectedHash)
  } catch {
    passOk = false
  }
  // evaluate both before returning so timing does not leak which half failed
  return userOk && passOk
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex')
}

/** Token format: "<expiryMs>.<hmac>" */
export function createSessionToken(): string {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000
  return `${expires}.${sign(String(expires))}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !secret()) return false
  const [expStr, sig] = token.split('.')
  if (!expStr || !sig) return false
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  try {
    return safeEqual(sig, sign(expStr))
  } catch {
    return false
  }
}

export const sessionCookieName = COOKIE
export const sessionMaxAge = MAX_AGE_SECONDS

/** True when the incoming request carries a valid admin session. */
export function isAdminRequest(): boolean {
  try {
    return verifySessionToken(cookies().get(COOKIE)?.value)
  } catch {
    return false
  }
}

/** Whether the server has everything it needs to allow admin login at all. */
export function adminAuthConfigured(): boolean {
  return Boolean(
    process.env.CHALLENGE_ADMIN_USER &&
    process.env.CHALLENGE_ADMIN_PASSWORD_HASH &&
    process.env.CHALLENGE_SESSION_SECRET
  )
}
