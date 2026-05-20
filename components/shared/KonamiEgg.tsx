'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SEQUENCE = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
]

export default function KonamiEgg() {
  const idxRef = useRef(0)
  const [show, setShow] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      const key = e.key.toLowerCase()
      const expected = SEQUENCE[idxRef.current].toLowerCase()

      if (key === expected) {
        idxRef.current += 1
        if (idxRef.current === SEQUENCE.length) {
          idxRef.current = 0
          setShow(true)
          if (timerRef.current) clearTimeout(timerRef.current)
          timerRef.current = setTimeout(() => setShow(false), 5000)
        }
      } else {
        idxRef.current = key === SEQUENCE[0].toLowerCase() ? 1 : 0
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="konami"
          initial={{ opacity: 0, y: 32, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[99999] w-[320px] text-center px-6 py-5 rounded-2xl border border-white/10 shadow-2xl"
          style={{
            background: 'rgba(12, 8, 28, 0.96)',
            backdropFilter: 'blur(28px)',
            boxShadow: '0 0 0 1px rgba(139,92,246,0.3), 0 24px 60px rgba(0,0,0,0.6)',
          }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl mb-3"
          >
            🎮
          </motion.div>
          <p className="text-white font-bold text-sm mb-1.5">You found the secret!</p>
          <p className="text-white/50 text-xs leading-relaxed">
            The Konami code — a classic. If you caught that, we&apos;d probably get along just fine.{' '}
            <a
              href="mailto:phaneendragavara436@gmail.com"
              className="text-purple-400 underline underline-offset-2 hover:text-purple-300 transition-colors"
            >
              Let&apos;s talk.
            </a>
          </p>
          <button
            onClick={() => setShow(false)}
            className="mt-4 text-[10px] text-white/25 hover:text-white/50 transition-colors tracking-wide uppercase"
          >
            dismiss
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
