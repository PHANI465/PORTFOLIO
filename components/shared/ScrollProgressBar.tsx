'use client'

import { useScroll, useSpring, motion } from 'framer-motion'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const { theme } = useTheme()

  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  const { accent: from, accent2: to } = getAccents(theme)

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
