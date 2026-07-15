'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, GraduationCap, Briefcase } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import portfolioData from '@/content/portfolio.json'
import { Portfolio } from '@/types'

const portfolio = portfolioData as Portfolio

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 30px -10px rgba(0,0,0,0.4)',
}

const chips = [
  { icon: <GraduationCap size={13} />, label: 'ASU · M.S. Data Science · GPA 3.90' },
  { icon: <MapPin size={13} />, label: 'Tempe, AZ · Open to relocate' },
  { icon: <Briefcase size={13} />, label: 'Full-time · No sponsorship required' },
]

export default function AboutSection() {
  const { theme } = useTheme()

  const isLight = theme === 'minimal-professional' || theme === 'bright-neon'
  const isTerminal = theme === 'terminal-hacker'

  if (isTerminal) return null // terminal has its own style, skip

  return (
    <section className="relative py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col md:flex-row-reverse gap-6 md:gap-10 items-start"
          style={isLight ? { background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' } : cardStyle}
        >
          {/* Avatar: offset accent frame, not a plain rectangle */}
          <div className="flex-shrink-0 relative mx-auto md:mx-0">
            <div
              aria-hidden="true"
              className="absolute -top-2 -right-2 w-full h-full rounded-2xl border-2 pointer-events-none"
              style={{ borderColor: 'var(--accent-1)', opacity: 0.5 }}
            />
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden relative"
              style={{ boxShadow: isLight ? 'var(--shadow-lg)' : 'var(--shadow-glow)' }}
            >
              <Image
                src={portfolio.avatar}
                alt={portfolio.name}
                fill
                className="object-cover object-top"
                sizes="176px"
              />
            </motion.div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h2
                className="font-display text-2xl md:text-3xl font-bold"
                style={{ color: isLight ? '#0f172a' : '#ffffff' }}
              >
                About Me
              </h2>
              {portfolio.openToWork && (
                <span className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border"
                  style={{
                    color: '#34d399',
                    borderColor: 'rgba(52,211,153,0.35)',
                    background: 'rgba(52,211,153,0.08)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Open to work
                </span>
              )}
            </div>

            <p
              className="text-sm md:text-base leading-relaxed mb-5"
              style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.72)' }}
            >
              {portfolio.about ?? portfolio.bio}
            </p>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              {chips.map(({ icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border"
                  style={
                    isLight
                      ? { color: '#475569', borderColor: 'rgba(0,0,0,0.12)', background: 'rgba(0,0,0,0.04)' }
                      : { color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }
                  }
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
