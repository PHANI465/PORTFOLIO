'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/**
 * Root error boundary. Without this a runtime error shows Next's unstyled
 * default page, which on a portfolio reads as a broken site.
 *
 * Deliberately theme-independent: if rendering failed, the theme provider may
 * be the thing that broke, so this uses fixed colours and no context.
 */
export default function GlobalError({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[portfolio] unhandled error:', error)
  }, [error])

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-[#0b0717] text-white">
      <div className="text-center max-w-md">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Something broke</p>
        <h1 className="text-2xl font-semibold mb-3">This page hit an error</h1>
        <p className="text-sm text-white/50 leading-relaxed mb-8">
          It has been logged. Trying again often clears it, since most causes are transient.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium border border-white/18 text-white/85 hover:bg-white/10 transition-colors"
          >
            Back home
          </Link>
        </div>

        {error.digest && (
          <p className="text-[11px] text-white/25 mt-8 font-mono">reference: {error.digest}</p>
        )}
      </div>
    </main>
  )
}
