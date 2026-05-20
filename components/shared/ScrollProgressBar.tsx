'use client'

import { useScroll, useSpring, motion } from 'framer-motion'
import { useTheme } from '@/lib/context/ThemeContext'

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const { theme } = useTheme()

  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  const color =
    theme === 'cyberpunk-ai'    ? '#00fff5'
    : theme === 'terminal-hacker' ? '#00ff41'
    : theme === 'minimal-professional' ? '#6366f1'
    : theme === 'dark-professional'    ? '#3b82f6'
    : theme === 'bright-neon'          ? '#7c3aed'
    : theme === 'futuristic-space'     ? '#a78bfa'
    : theme === 'anime-gaming'         ? '#fbbf24'
    : theme === 'retro-pixel'          ? '#00ff41'
    : '#8b5cf6'

  return (
    <motion.div
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: color,
        transformOrigin: '0%',
        zIndex: 9999,
        boxShadow: `0 0 8px ${color}`,
      }}
    />
  )
}
