'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/lib/context/ThemeContext'
import CyberpunkProjectCard from '@/components/themes/cyberpunk-ai/ProjectCard'
import TerminalProjectCard from '@/components/themes/terminal-hacker/ProjectCard'
import GlassProjectCard from '@/components/themes/glassmorphism/ProjectCard'
import MinimalProjectCard from '@/components/themes/minimal-professional/ProjectCard'
import projectsData from '@/content/projects.json'
import { Project } from '@/types'
import Link from 'next/link'
import { ArrowRight, Layers } from 'lucide-react'

const projects = projectsData as Project[]
const allCategories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]
const categoryCount = (cat: string) =>
  cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 16 } },
  exit: { opacity: 0, scale: 0.93, transition: { duration: 0.18 } },
}

export default function ProjectsSection() {
  const { theme } = useTheme()
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  const Card = {
    'cyberpunk-ai': CyberpunkProjectCard,
    'terminal-hacker': TerminalProjectCard,
    'glassmorphism': GlassProjectCard,
    'minimal-professional': MinimalProjectCard,
    'dark-professional': GlassProjectCard,
    'bright-neon': MinimalProjectCard,
    'futuristic-space': CyberpunkProjectCard,
    'anime-gaming': GlassProjectCard,
    'retro-pixel': TerminalProjectCard,
  }[theme] ?? CyberpunkProjectCard

  const isCyber    = theme === 'cyberpunk-ai'
  const isTerminal = theme === 'terminal-hacker'
  const isLight    = theme === 'minimal-professional' || theme === 'bright-neon'

  const accent  = isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#4f46e5' : '#a78bfa'
  const accent2 = isCyber ? '#ff0090' : isTerminal ? '#ffb000' : isLight ? '#6366f1' : '#7c3aed'

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
            style={{ color: accent, fontFamily: isCyber || isTerminal ? 'monospace' : undefined }}
          >
            {isTerminal ? '$ ls -la ./projects/' : isCyber ? '>> PORTFOLIO.DIR' : 'Portfolio'}
          </motion.p>

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-end gap-4 flex-1">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 80 }}
                className="text-4xl font-bold tracking-tight"
                style={{
                  color: isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#0f172a' : '#ffffff',
                  fontFamily: isCyber ? 'Orbitron, monospace' : isTerminal ? 'Share Tech Mono, monospace' : undefined,
                  textShadow: isCyber ? '0 0 24px rgba(0,255,245,0.4)' : undefined,
                }}
              >
                {isCyber ? 'PROJECTS' : 'Projects'}
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
                    : isCyber
                    ? `border ${filter === cat ? 'border-[#00fff5] text-[#00fff5] bg-[#00fff5]/10' : 'border-[#00fff5]/20 text-[#00fff5]/50'}`
                    : isLight
                    ? `rounded-lg border ${filter === cat ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500'}`
                    : `rounded-lg border ${filter === cat ? 'border-purple-400 bg-purple-400/10 text-purple-300' : 'border-white/10 text-white/40'}`
                }`}
                style={isTerminal || isCyber ? { fontFamily: 'monospace' } : {}}
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

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {filtered.slice(0, 3).map((project) => (
              <motion.div key={project.id} variants={cardVariants} layout>
                <Card project={project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

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
              className={`px-6 py-3 text-sm font-medium transition-all ${
                isTerminal
                  ? 'border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/10'
                  : isCyber
                  ? 'border border-[#00fff5]/40 text-[#00fff5] hover:bg-[#00fff5]/10'
                  : isLight
                  ? 'border border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-xl'
                  : 'border border-purple-400/40 text-purple-400 hover:bg-purple-400/10 rounded-xl'
              }`}
              style={{ boxShadow: `0 0 20px ${accent}15` }}
            >
              <span className="flex items-center gap-2">
                <Layers size={14} />
                {isTerminal ? '$ ls -la (all)' : `View all ${projects.length} projects`}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
