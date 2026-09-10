'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'

/**
 * Custom 404. Inherits the active theme so a mistyped URL still feels like
 * part of the site rather than a framework default, and points the visitor
 * back to the two pages worth landing on.
 */
export default function NotFound() {
  const { theme } = useTheme()
  const { accent, accent2, light: isLight, mono: isTerminal } = getAccents(theme)

  const heading = isTerminal ? '#00ff41' : isLight ? '#0f172a' : '#ffffff'
  const body = isTerminal ? 'rgba(0,255,65,0.6)' : isLight ? '#64748b' : 'rgba(255,255,255,0.55)'
  const mono = isTerminal ? { fontFamily: 'Share Tech Mono, monospace' } : undefined

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
        style={mono}
      >
        <p
          className="font-mono text-7xl md:text-8xl font-bold tracking-tight mb-4"
          style={{
            backgroundImage: `linear-gradient(135deg, ${accent}, ${accent2})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            // both are required: Chrome/Safari honour text-fill-color over color
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          404
        </p>

        <h1 className="text-xl font-semibold mb-3" style={{ color: heading }}>
          {isTerminal ? 'No such file or directory' : 'This page does not exist'}
        </h1>

        <p className="text-sm leading-relaxed mb-8" style={{ color: body }}>
          The link may be out of date, or the address slightly off.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}
          >
            {isTerminal ? 'cd ~' : 'Back home'}
          </Link>
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors"
            style={{
              color: isLight ? '#334155' : heading,
              borderColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.18)',
            }}
          >
            {isTerminal ? 'ls ./projects' : 'View projects'}
          </Link>
        </div>

        <p className="text-[11px] mt-10" style={{ color: body, opacity: 0.7 }}>
          Tip: press <kbd className="px-1.5 py-0.5 rounded border border-current">`</kbd> anywhere to open the terminal.
        </p>
      </motion.div>
    </main>
  )
}
