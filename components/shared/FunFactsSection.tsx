'use client'

import { motion } from 'framer-motion'
import { Film, Star, Dumbbell, Trophy, Palette } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import portfolioData from '@/content/portfolio.json'
import { Portfolio } from '@/types'

const portfolio = portfolioData as Portfolio

const cardBase: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 30px -10px rgba(0,0,0,0.4)',
}

const lightCard: React.CSSProperties = {
  background: 'rgba(0,0,0,0.03)',
  border: '1px solid rgba(0,0,0,0.08)',
}

interface FactCardProps {
  icon: React.ReactNode
  label: string
  items: string[]
  accent: string
  delay?: number
  isLight: boolean
  wide?: boolean
}

function trackSpot(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

function FactCard({ icon, label, items, accent, delay = 0, isLight, wide }: FactCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -3 }}
      onMouseMove={trackSpot}
      className={`spotlight rounded-2xl border border-white/10 p-5 ${wide ? 'md:col-span-2' : ''}`}
      style={isLight ? lightCard : cardBase}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: accent }}>{icon}</span>
        <span
          className="text-[10px] tracking-widest uppercase font-medium"
          style={{ color: isLight ? '#64748b' : 'rgba(255,255,255,0.45)' }}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, j) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + j * 0.05, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-xs px-2.5 py-1 rounded-lg border"
            style={
              isLight
                ? { color: '#334155', borderColor: `${accent}40`, background: `${accent}10` }
                : { color: 'rgba(255,255,255,0.82)', borderColor: `${accent}35`, background: `${accent}12` }
            }
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export default function FunFactsSection() {
  const { theme } = useTheme()
  const isLight = theme === 'minimal-professional' || theme === 'bright-neon'
  const isTerminal = theme === 'terminal-hacker'

  if (isTerminal) return null

  const p = portfolio.personal
  if (!p) return null

  const facts = [
    {
      icon: <Film size={14} />,
      label: 'Favourite Movies',
      items: p.favoriteMovies,
      accent: '#a78bfa',
      wide: true,
    },
    {
      icon: <Star size={14} />,
      label: 'Favourite Actors',
      items: p.favoriteActors,
      accent: '#f59e0b',
      wide: true,
    },
    {
      icon: <Dumbbell size={14} />,
      label: 'Hobbies',
      items: p.hobbies,
      accent: '#34d399',
    },
    {
      icon: <Trophy size={14} />,
      label: 'Favourite Sport',
      items: [p.favoriteSport],
      accent: '#38bdf8',
    },
    {
      icon: <Palette size={14} />,
      label: 'Favourite Color',
      items: [p.favoriteColor],
      accent: '#1d4ed8',
    },
  ]

  return (
    <section className="relative py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2
            className="text-lg font-bold tracking-tight"
            style={{ color: isLight ? '#0f172a' : 'rgba(255,255,255,0.9)' }}
          >
            Beyond the Resume
          </h2>
          <p
            className="text-sm mt-1"
            style={{ color: isLight ? '#64748b' : 'rgba(255,255,255,0.45)' }}
          >
            A few things that make me, me.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {facts.map((f, i) => (
            <FactCard
              key={f.label}
              icon={f.icon}
              label={f.label}
              items={f.items}
              accent={f.accent}
              delay={i * 0.06}
              isLight={isLight}
              wide={f.wide}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
