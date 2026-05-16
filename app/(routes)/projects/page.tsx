'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useTheme } from '@/lib/context/ThemeContext'
import CyberpunkProjectCard from '@/components/themes/cyberpunk-ai/ProjectCard'
import TerminalProjectCard from '@/components/themes/terminal-hacker/ProjectCard'
import GlassProjectCard from '@/components/themes/glassmorphism/ProjectCard'
import MinimalProjectCard from '@/components/themes/minimal-professional/ProjectCard'
import projectsData from '@/content/projects.json'
import { Project } from '@/types'
import { Search, Filter, Sparkles } from 'lucide-react'
import CareerTimeline from '@/components/shared/CareerTimeline'

const projects = projectsData as Project[]
const allCategories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 90, damping: 18 },
  },
  exit: {
    opacity: 0, y: -16, scale: 0.94,
    transition: { duration: 0.2 },
  },
}

export default function ProjectsPage() {
  const { theme } = useTheme()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50])

  const isCyber    = theme === 'cyberpunk-ai'
  const isTerminal = theme === 'terminal-hacker'
  const isLight    = theme === 'minimal-professional' || theme === 'bright-neon'

  const accent  = isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#4f46e5' : '#a78bfa'
  const accent2 = isCyber ? '#ff0090' : isTerminal ? '#ffb000' : isLight ? '#6366f1' : '#7c3aed'

  const filtered = projects.filter(p => {
    const matchCat = filter === 'All' || p.category === filter
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tech.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  const Card = {
    'cyberpunk-ai': CyberpunkProjectCard,
    'terminal-hacker': TerminalProjectCard,
    'glassmorphism': GlassProjectCard,
    'minimal-professional': GlassProjectCard,
    'futuristic-space': CyberpunkProjectCard,
    'anime-gaming': GlassProjectCard,
    'retro-pixel': TerminalProjectCard,
    'dark-professional': GlassProjectCard,
    'bright-neon': MinimalProjectCard,
  }[theme] ?? CyberpunkProjectCard

  return (
    <div className="min-h-screen pt-24 pb-28 px-4 relative overflow-hidden">

      {/* Ambient glows */}
      {!isLight && (
        <>
          <motion.div
            className="fixed top-20 right-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent}06 0%, transparent 70%)`, filter: 'blur(80px)' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="fixed bottom-10 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent2}06 0%, transparent 70%)`, filter: 'blur(60px)' }}
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
        </>
      )}

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div ref={heroRef} style={{ y: heroY }} className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs tracking-widest mb-2 font-medium"
              style={{ color: accent, fontFamily: isCyber || isTerminal ? 'monospace' : undefined }}
            >
              {isTerminal ? '$ ls -la ./projects/' : isCyber ? '>> PROJECTS.DIR' : '— Portfolio'}
            </motion.p>

            <div className="flex items-end justify-between">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
                className="text-5xl font-bold tracking-tight"
                style={{
                  color: isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#0f172a' : '#ffffff',
                  fontFamily: isCyber ? 'Orbitron, monospace' : isTerminal ? 'Share Tech Mono, monospace' : undefined,
                  textShadow: isCyber ? '0 0 30px rgba(0,255,245,0.4)' : undefined,
                }}
              >
                {isCyber ? 'PROJECTS' : 'Projects'}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm"
                style={{ color: `${accent}80` }}
              >
                <motion.span
                  key={filtered.length}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {filtered.length}
                </motion.span>
                <span> / {projects.length} projects</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="mt-4 h-px origin-left"
              style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
            />
          </motion.div>
        </motion.div>

        {/* ── Search + Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className={`relative flex-1 ${isLight ? '' : ''}`}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder={isTerminal ? '$ grep -r "keyword" ./projects/' : 'Search by title, tech, or description...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 text-sm outline-none transition-all ${
                isTerminal
                  ? 'bg-black/30 border border-[#00ff41]/20 text-[#00ff41] placeholder:text-[#00ff41]/30 focus:border-[#00ff41]/50'
                  : isCyber
                  ? 'bg-black/30 border border-[#00fff5]/20 text-[#00fff5] placeholder:text-[#00fff5]/30 focus:border-[#00fff5]/50'
                  : isLight
                  ? 'bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 rounded-xl'
                  : 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/20 rounded-xl'
              }`}
              style={isTerminal || isCyber ? { fontFamily: 'monospace' } : {}}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {allCategories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`px-3 py-2 text-xs font-medium transition-all relative overflow-hidden ${
                  isTerminal
                    ? `border ${filter === cat ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/10' : 'border-[#00ff41]/20 text-[#00ff41]/50 hover:border-[#00ff41]/40'}`
                    : isCyber
                    ? `border ${filter === cat ? 'border-[#00fff5] text-[#00fff5] bg-[#00fff5]/10' : 'border-[#00fff5]/20 text-[#00fff5]/50 hover:border-[#00fff5]/40'}`
                    : isLight
                    ? `rounded-lg border ${filter === cat ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`
                    : `rounded-lg border ${filter === cat ? 'border-purple-400 bg-purple-400/10 text-purple-300' : 'border-white/10 text-white/40 hover:border-white/20'}`
                }`}
                style={isTerminal || isCyber ? { fontFamily: 'monospace' } : {}}
              >
                {filter === cat && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 rounded-[inherit]"
                    style={{ background: `${accent}10` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${filter}-${search}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {filtered.map((project, i) => (
                <motion.div key={project.id} variants={cardVariants} layout>
                  <Card project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-4"
              >
                🔍
              </motion.div>
              <p style={{ color: `${accent}80` }} className="text-sm">
                No projects match your search
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <CareerTimeline />
      </div>
    </div>
  )
}
