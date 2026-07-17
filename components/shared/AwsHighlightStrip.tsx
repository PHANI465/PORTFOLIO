'use client'

import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'

const AWS_ORANGE = '#FF9900'

const AWS_CERTS = [
  { name: 'AWS Certified Solutions Architect - Associate', url: 'https://www.credly.com/badges/f8d45105-4913-4ebb-9353-36635ff76f65/public_url' },
  { name: 'AWS Certified AI Practitioner', url: 'https://www.credly.com/badges/c4f2a25d-6ba4-4349-a5e2-de8bf03459f3' },
]

const containerVariants = (delay: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
})

const badgeVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

/**
 * Meant to sit inside a Hero, near the top, so it's visible without
 * scrolling: renders immediately on mount rather than on scroll-into-view.
 */
export default function AwsHighlightStrip({
  delay = 0,
  className = '',
  align = 'center',
}: {
  delay?: number
  className?: string
  align?: 'center' | 'start'
}) {
  const { theme } = useTheme()
  if (theme === 'terminal-hacker') return null

  return (
    <motion.div
      variants={containerVariants(delay)}
      initial="hidden"
      animate="show"
      className={`flex flex-wrap items-center gap-2 ${align === 'center' ? 'justify-center' : 'justify-start'} ${className}`}
    >
      {AWS_CERTS.map(cert => (
        <motion.a
          key={cert.name}
          href={cert.url}
          target="_blank"
          rel="noopener noreferrer"
          variants={badgeVariants}
          whileHover={{ y: -2, scale: 1.02 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight"
          style={{ background: AWS_ORANGE, color: '#0f1117', boxShadow: `0 4px 16px ${AWS_ORANGE}40` }}
        >
          <Award size={11} />
          {cert.name}
        </motion.a>
      ))}
    </motion.div>
  )
}
