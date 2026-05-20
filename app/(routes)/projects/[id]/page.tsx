'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, ExternalLink, ArrowLeft, Calendar, Tag, CheckCircle2, Cpu } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import projectsData from '@/content/projects.json'
import { Project } from '@/types'

const projects = projectsData as Project[]

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { theme } = useTheme()

  const project = projects.find(p => p.id === id)

  const isCyber    = theme === 'cyberpunk-ai' || theme === 'futuristic-space'
  const isTerminal = theme === 'terminal-hacker' || theme === 'retro-pixel'
  const isLight    = theme === 'minimal-professional' || theme === 'bright-neon'

  // ── Token shortcuts ─────────────────────────────────────────
  const accent  = isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#6366f1' : '#8b5cf6'
  const accent2 = isCyber ? '#ff0090' : isTerminal ? '#ffb000' : isLight ? '#8b5cf6' : '#3b82f6'
  const mono    = isCyber || isTerminal ? { fontFamily: 'monospace' } : {}

  const cardCls = isCyber
    ? 'border border-[#00fff5]/15 bg-[#00fff5]/[0.02]'
    : isTerminal
    ? 'border border-[#00ff41]/15 bg-[#00ff41]/[0.02]'
    : isLight
    ? 'border border-slate-100 bg-white rounded-xl shadow-sm'
    : 'rounded-xl glass-card'

  const labelCls = isCyber
    ? 'text-[#ff0090] text-xs tracking-widest'
    : isTerminal
    ? 'text-[#ffb000] text-xs'
    : isLight
    ? 'text-indigo-600 text-xs font-semibold tracking-wide uppercase'
    : 'text-purple-400 text-xs uppercase tracking-wide'

  const headingCls = isCyber
    ? 'text-[#00fff5]'
    : isTerminal
    ? 'text-[#00ff41]'
    : isLight
    ? 'text-slate-900'
    : 'text-white'

  const textCls = isCyber
    ? 'text-[#00fff5]/60'
    : isTerminal
    ? 'text-[#00ff41]/60'
    : isLight
    ? 'text-slate-600'
    : 'text-white/60'

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-24 px-4">
        <p className={`text-2xl font-bold ${headingCls}`} style={mono}>Project not found</p>
        <Link href="/projects" className={`text-sm underline ${textCls}`}>← Back to projects</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 text-sm mb-8 transition-colors ${
              isCyber ? 'text-[#00fff5]/50 hover:text-[#00fff5]'
              : isTerminal ? 'text-[#00ff41]/50 hover:text-[#00ff41]'
              : isLight ? 'text-slate-400 hover:text-indigo-600'
              : 'text-white/40 hover:text-white'
            }`}
            style={mono}
          >
            <ArrowLeft size={14} />
            {isTerminal ? 'cd ../projects' : 'Back to Projects'}
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          {/* Category + status row */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`flex items-center gap-1 ${labelCls}`} style={mono}>
              <Tag size={11} /> {project.category}
            </span>
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
              project.status === 'completed'
                ? isCyber ? 'border-[#00ff41]/30 text-[#00ff41]/70' : isTerminal ? 'border-[#00ff41]/30 text-[#00ff41]/70' : isLight ? 'border-green-200 text-green-600 bg-green-50' : 'border-green-400/20 text-green-400'
                : isCyber ? 'border-[#ff0090]/30 text-[#ff0090]/70' : isLight ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-amber-400/20 text-amber-400'
            }`} style={mono}>
              {project.status === 'completed' ? '✓ Completed' : '⚡ In Progress'}
            </span>
            {project.date && (
              <span className={`flex items-center gap-1 text-xs ${textCls}`} style={mono}>
                <Calendar size={11} />
                {(() => { const [y, m] = project.date.split('-'); return new Date(+y, +m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) })()}
              </span>
            )}
          </div>

          {/* Title */}
          {isCyber ? (
            <h1 className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: 'Orbitron, monospace', color: accent, textShadow: `0 0 20px ${accent}40` }}>
              {project.title}
            </h1>
          ) : isTerminal ? (
            <h1 className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: 'Share Tech Mono, monospace', color: accent }}>
              # {project.title}
            </h1>
          ) : (
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${headingCls}`}>{project.title}</h1>
          )}

          <p className={`text-base leading-relaxed ${textCls}`} style={mono}>
            {project.longDescription || project.description}
          </p>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-5 mb-5 ${cardCls}`}
        >
          <p className={`${labelCls} mb-3 flex items-center gap-1.5`} style={mono}>
            <Cpu size={11} /> Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map(t => (
              <span key={t} className={`px-3 py-1 text-xs rounded-full border ${
                isCyber ? 'border-[#7b2fff]/40 text-[#7b2fff] bg-[#7b2fff]/5'
                : isTerminal ? 'border-[#ffb000]/30 text-[#ffb000]/80 bg-[#ffb000]/5'
                : isLight ? 'border-indigo-200 text-indigo-700 bg-indigo-50'
                : 'border-purple-400/20 text-purple-300 bg-purple-500/5'
              }`} style={mono}>
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`p-5 mb-5 ${cardCls}`}
          >
            <p className={`${labelCls} mb-4`} style={mono}>
              {isTerminal ? '# Key Features' : 'Key Highlights'}
            </p>
            <ul className="space-y-3">
              {project.highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className={`flex items-start gap-3 text-sm ${textCls}`}
                  style={mono}
                >
                  {isTerminal
                    ? <span style={{ color: accent2 }} className="flex-shrink-0 mt-0.5">▸</span>
                    : <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" style={{ color: accent }} />
                  }
                  {h}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Links */}
        {(project.github || project.demo) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-3 mb-5"
          >
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border transition-all rounded-lg ${
                  isCyber ? 'border-[#00fff5]/40 text-[#00fff5] hover:bg-[#00fff5]/10'
                  : isTerminal ? 'border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/10'
                  : isLight ? 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
                  : 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                }`} style={mono}>
                <Github size={15} /> View on GitHub
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all rounded-lg ${
                  isLight ? 'text-white' : 'text-white'
                }`}
                style={{
                  background: isLight
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : isCyber ? 'linear-gradient(135deg, #00fff5, #7b2fff)'
                    : isTerminal ? '#00ff41'
                    : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  color: isTerminal ? '#000' : undefined,
                  ...mono,
                }}>
                <ExternalLink size={15} /> Live Demo
              </a>
            )}
          </motion.div>
        )}

        {/* Back to all projects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`pt-6 border-t ${
            isCyber ? 'border-[#00fff5]/10' : isTerminal ? 'border-[#00ff41]/10' : isLight ? 'border-slate-100' : 'border-white/5'
          }`}
        >
          <Link href="/projects"
            className={`text-sm flex items-center gap-1.5 transition-colors ${
              isCyber ? 'text-[#00fff5]/50 hover:text-[#00fff5]'
              : isTerminal ? 'text-[#00ff41]/50 hover:text-[#00ff41]'
              : isLight ? 'text-slate-400 hover:text-indigo-600'
              : 'text-white/30 hover:text-white/70'
            }`} style={mono}>
            <ArrowLeft size={13} />
            {isTerminal ? '$ ls ../projects' : 'All projects'}
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
