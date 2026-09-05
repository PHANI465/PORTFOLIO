'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/lib/context/ThemeContext'
import TerminalProjectCard from '@/components/themes/terminal-hacker/ProjectCard'
import GlassProjectCard from '@/components/themes/glassmorphism/ProjectCard'
import MinimalProjectCard from '@/components/themes/minimal-professional/ProjectCard'
import projectsData from '@/content/projects.json'
import { Project } from '@/types'
import { getAccents } from '@/lib/themeTokens'
import Link from 'next/link'
import { ArrowRight, Layers } from 'lucide-react'

// flagship (live demo) leads the grid; stable sort keeps the rest in JSON order
const projects = [...(projectsData as Project[])].sort(
  (a, b) => (a.id === 'insighthub' ? -1 : b.id === 'insighthub' ? 1 : 0)
)
const allCategories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]
const categoryCount = (cat: string) =>
  cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
}

export default function ProjectsSection() {
  const { theme } = useTheme()
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  const Card = {
    'terminal-hacker': TerminalProjectCard,
    'glassmorphism': GlassProjectCard,
    'minimal-professional': MinimalProjectCard,
    'bright-neon': MinimalProjectCard,
  }[theme] ?? GlassProjectCard

  const isTerminal = theme === 'terminal-hacker'
  const { accent, accent2, light: isLight } = getAccents(theme)

  return (
    <section className="py-24 px-4 relative overflow-hidden" id="projects">

      {/* Section ambient */}
      {!isLight && (
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}05 0%, transparent 70%)`, filter: 'blur(40px)' }}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs tracking-widest mb-2 font-medium"
            style={{ color: accent, fontFamily: isTerminal ? 'monospace' : undefined }}
          >
            {isTerminal ? '$ ls -la ./projects/' : 'Selected work'}
          </motion.p>

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-end gap-4 flex-1">
              <motion.h2
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-4xl font-bold tracking-tight"
                style={{
                  color: isTerminal ? '#00ff41' : isLight ? '#0f172a' : '#ffffff',
                  fontFamily: isTerminal ? 'Share Tech Mono, monospace' : undefined,
                }}
              >
                Projects
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                className="flex-1 h-px mb-3 origin-left"
                style={{ background: `linear-gradient(to right, ${accent}50, transparent)` }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/projects">
                <motion.span
                  className="flex items-center gap-1.5 text-xs font-medium mb-3"
                  style={{ color: accent }}
                  whileHover={{ x: 3 }}
                >
                  View all <ArrowRight size={12} />
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {allCategories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className={`px-3 py-1.5 text-xs font-medium transition-all relative overflow-hidden ${
                  isTerminal
                    ? `border ${filter === cat ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/10' : 'border-[#00ff41]/20 text-[#00ff41]/50'}`
                    : isLight
                    ? `rounded-lg border ${filter === cat ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500'}`
                    : `rounded-lg border ${filter === cat ? 'border-purple-400 bg-purple-400/10 text-purple-300' : 'border-white/10 text-white/40'}`
                }`}
                style={isTerminal ? { fontFamily: 'monospace' } : {}}
              >
                {filter === cat && (
                  <motion.div
                    layoutId="projectFilter"
                    className="absolute inset-0 rounded-[inherit]"
                    style={{ background: `${accent}12` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">
                  {cat}
                  <span className={`ml-1.5 tabular-nums ${filter === cat ? 'opacity-70' : 'opacity-40'}`}>
                    {categoryCount(cat)}
                  </span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Cards grid, stable grid, layout animation on filter change (no remount jank) */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {/* 5 when unfiltered: featured (2-wide) + 1 on row one, 3 on row two */}
            {filtered.slice(0, filter === 'All' ? 5 : 3).map((project, i) => (
              <motion.div
                key={project.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className={`h-full ${filter === 'All' && i === 0 ? 'md:col-span-2' : ''}`}
              >
                <Card project={project} hero={filter === 'All' && i === 0} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link href="/projects">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`group px-6 py-3 text-sm font-medium transition-all ${
                isTerminal
                  ? 'border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/10'
                  : isLight
                  ? 'border border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-xl'
                  : 'border border-purple-400/40 text-purple-400 hover:bg-purple-400/10 rounded-xl'
              }`}
              style={{ boxShadow: `0 0 20px ${accent}15` }}
            >
              <span className="flex items-center gap-2">
                <Layers size={14} />
                {isTerminal ? '$ ls -la (all)' : `View all ${projects.length} projects`}
                <span className="inline-block group-hover:translate-x-1 transition-transform duration-fast">→</span>
              </span>
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
