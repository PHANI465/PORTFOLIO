#!/usr/bin/env node
/**
 * Generates the values for the challenge admin environment variables.
 *
 *   npm run challenge:hash -- "your-password-here"
 *
 * Prints a scrypt salt:hash pair and a random session secret. The plaintext
 * password is never stored anywhere: only the hash goes into the environment.
 */
const { scryptSync, randomBytes } = require('crypto')

const password = process.argv[2]
if (!password) {
  console.error('\nUsage: npm run challenge:hash -- "your-password"\n')
  process.exit(1)
}
if (password.length < 10) {
  console.error('\nUse at least 10 characters.\n')
  process.exit(1)
}

const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64).toString('hex')

console.log('\nAdd these to .env.local and to your Vercel project settings:\n')
console.log(`CHALLENGE_ADMIN_USER=your-username`)
console.log(`CHALLENGE_ADMIN_PASSWORD_HASH=${salt}:${hash}`)
console.log(`CHALLENGE_SESSION_SECRET=${randomBytes(32).toString('hex')}`)
console.log('\nKeep all three server-side. Never prefix them with NEXT_PUBLIC_.\n')
