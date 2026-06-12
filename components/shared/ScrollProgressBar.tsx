'use client'

import { useScroll, useSpring, motion } from 'framer-motion'
import { useTheme } from '@/lib/context/ThemeContext'

// [start, end] gradient stops per theme
const COLORS: Record<string, [string, string]> = {
  'cyberpunk-ai':         ['#00fff5', '#ff0090'],
  'terminal-hacker':      ['#00ff41', '#ffb000'],
  'minimal-professional': ['#6366f1', '#a855f7'],
  'dark-professional':    ['#3b82f6', '#06b6d4'],
  'bright-neon':          ['#7c3aed', '#ec4899'],
  'futuristic-space':     ['#a78bfa', '#6366f1'],
  'anime-gaming':         ['#fbbf24', '#ff6eb4'],
  'retro-pixel':          ['#00ff41', '#ffcc00'],
  'glassmorphism':        ['#8b5cf6', '#14b8a6'],
}

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const { theme } = useTheme()

  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  const [from, to] = COLORS[theme] ?? COLORS['glassmorphism']

  return (
    <motion.div
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2.5,
        background: `linear-gradient(to right, ${from}, ${to})`,
        transformOrigin: '0%',
        zIndex: 9999,
        boxShadow: `0 0 10px ${from}90, 0 0 4px ${to}60`,
      }}
    />
  )
}
