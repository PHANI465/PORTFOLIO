'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'

const ACCENTS: Record<string, string> = {
  'cyberpunk-ai': '#00fff5',
  'terminal-hacker': '#00ff41',
  'minimal-professional': '#6366f1',
  'dark-professional': '#3b82f6',
  'bright-neon': '#7c3aed',
  'futuristic-space': '#a78bfa',
  'anime-gaming': '#ff6eb4',
  'retro-pixel': '#ffcc00',
  'glassmorphism': '#8b5cf6',
}

export default function BackToTop() {
  const { theme } = useTheme()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 25 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const accent = ACCENTS[theme] ?? ACCENTS['glassmorphism']
  const isSquare = theme === 'retro-pixel' || theme === 'terminal-hacker'

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 left-6 z-[9990] flex items-center justify-center w-11 h-11"
          style={{
            borderRadius: isSquare ? 0 : '9999px',
            background: 'rgba(10,10,18,0.55)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${accent}40`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.35), 0 0 16px ${accent}25`,
          }}
        >
          {/* Scroll progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="19" fill="none" stroke={`${accent}20`} strokeWidth="2" />
            <motion.circle
              cx="22" cy="22" r="19" fill="none"
              stroke={accent} strokeWidth="2" strokeLinecap="round"
              style={{ pathLength: progress }}
            />
          </svg>
          <ArrowUp size={16} style={{ color: accent }} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
