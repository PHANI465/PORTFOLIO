'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTheme } from '@/lib/context/ThemeContext'
import resumeData from '@/content/resume.json'
import { Resume } from '@/types'
import { Download, Trophy, GraduationCap, Briefcase, Heart, ChevronDown, Star, Zap } from 'lucide-react'

const resume = resumeData as Resume

const typeIcon = (type: string) => {
  if (type === 'education') return GraduationCap
  if (type === 'volunteer') return Heart
  return Briefcase
}

// ── Fade-up with stagger parent ───────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 16 },
  },
}

const lineVariants = {
  hidden: { scaleY: 0, originY: 0 },
  show: { scaleY: 1, transition: { duration: 0.8, ease: 'easeOut' } },
}

export default function ExperiencePage() {
  const { theme } = useTheme()
  const isCyber    = theme === 'cyberpunk-ai'
  const isTerminal = theme === 'terminal-hacker'
  const isLight    = theme === 'minimal-professional' || theme === 'bright-neon'
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60])

  const accent  = isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#4f46e5' : '#a78bfa'
  const accent2 = isCyber ? '#ff0090' : isTerminal ? '#ffb000' : isLight ? '#6366f1' : '#7c3aed'

  const cardBase = isCyber
    ? 'border border-[#00fff5]/15 hover:border-[#00fff5]/50 bg-black/40'
    : isTerminal
    ? 'border border-[#00ff41]/15 hover:border-[#00ff41]/40 bg-black/50'
    : isLight
    ? 'border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg rounded-2xl'
    : 'border border-white/10 glass-card hover:border-white/20 rounded-2xl'

  const headingCls = isCyber ? 'text-[#00fff5] font-bold'
    : isTerminal ? 'text-[#00ff41] font-bold'
    : isLight    ? 'text-slate-900 font-semibold'
    : 'text-white font-semibold'

  const subCls = isCyber ? 'text-[#ff0090] text-xs'
    : isTerminal ? 'text-[#ffb000] text-xs'
    : isLight    ? 'text-indigo-600 text-sm'
    : 'text-purple-400 text-sm'

  return (
    <div className="min-h-screen pt-24 pb-28 px-4 relative overflow-hidden">

      {/* Ambient background glow */}
      {!isLight && (
        <>
          <motion.div
            className="fixed top-32 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent}08 0%, transparent 70%)`, filter: 'blur(60px)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="fixed bottom-32 right-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent2}08 0%, transparent 70%)`, filter: 'blur(60px)' }}
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </>
      )}

      <div className="max-w-4xl mx-auto relative z-10">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <motion.div ref={heroRef} style={{ y: heroY }} className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs tracking-widest mb-2 font-medium"
              style={{ color: accent, fontFamily: isCyber || isTerminal ? 'monospace' : undefined }}
            >
              {isTerminal ? '$ cat resume.json' : isCyber ? '>> CAREER.EXE' : '— Career'}
            </motion.p>

            <div className="flex items-end justify-between gap-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
                className={`text-5xl font-bold tracking-tight ${
                  isCyber ? 'text-[#00fff5]' : isTerminal ? 'text-[#00ff41]'
                  : isLight ? 'text-slate-900' : 'text-white'
                }`}
                style={{
                  fontFamily: isCyber ? 'Orbitron, monospace' : isTerminal ? 'Share Tech Mono, monospace' : undefined,
                  textShadow: isCyber ? '0 0 30px rgba(0,255,245,0.4)' : undefined,
                }}
              >
                {isCyber ? 'EXPERIENCE' : 'Experience'}
              </motion.h1>

              <motion.a
                href="/resume/Phaneendra_G_Resume.pdf"
                download
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                  isCyber ? 'border border-[#00fff5]/40 text-[#00fff5] hover:bg-[#00fff5]/10' :
                  isTerminal ? 'border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/5' :
                  isLight ? 'border border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-xl' :
                  'border border-purple-400/40 text-purple-400 hover:bg-purple-400/10 rounded-xl'
                }`}
              >
                <Download size={14} />
                {isTerminal ? 'resume.pdf' : 'Download CV'}
              </motion.a>
            </div>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="mt-4 h-px origin-left"
              style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
            />
          </motion.div>
        </motion.div>

        {/* ── Work Experience ─────────────────────────────────────── */}
        <TimelineSection title="Work Experience" icon="💼" accent={accent} accent2={accent2} isTerminal={isTerminal} isCyber={isCyber} isLight={isLight}>
          {resume.experience.map((item, i) => {
            const Icon = typeIcon(item.type)
            const isOpen = expandedId === item.id
            return (
              <motion.div key={item.id} variants={itemVariants} layout>
                <motion.div
                  layout
                  className={`${cardBase} p-5 cursor-pointer transition-all duration-300`}
                  whileHover={{ y: -2, boxShadow: `0 8px 30px ${accent}15` }}
                  onClick={() => setExpandedId(isOpen ? null : item.id)}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      className={`p-2.5 rounded-lg mt-0.5 flex-shrink-0 ${
                        isCyber ? 'bg-[#00fff5]/10 text-[#00fff5]' :
                        isTerminal ? 'bg-[#00ff41]/10 text-[#00ff41]' :
                        isLight ? 'bg-indigo-50 text-indigo-600' :
                        'bg-purple-400/10 text-purple-400'
                      }`}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                    >
                      <Icon size={15} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`${headingCls} text-sm leading-snug`}
                          style={isTerminal || isCyber ? { fontFamily: 'monospace' } : {}}>
                          {item.role}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs whitespace-nowrap ${isLight ? 'text-slate-400' : 'opacity-40'}`}>
                            {item.startDate} – {item.current ? 'Present' : item.endDate}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={14} className={isLight ? 'text-slate-400' : 'opacity-30'} />
                          </motion.div>
                        </div>
                      </div>
                      <p className={`${subCls} mb-0`}
                        style={isTerminal || isCyber ? { fontFamily: 'monospace' } : {}}>
                        {item.organization} · {item.location}
                      </p>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="mt-3 space-y-1.5 overflow-hidden"
                          >
                            {item.highlights.map((h, j) => (
                              <motion.li
                                key={j}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: j * 0.06 }}
                                className={`text-xs flex gap-2 ${isLight ? 'text-slate-600' : 'opacity-60'}`}
                              >
                                <span style={{ color: accent }} className="mt-0.5 flex-shrink-0">
                                  {isTerminal ? '>' : '▸'}
                                </span>
                                <span>{h}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </TimelineSection>

        {/* ── Education ───────────────────────────────────────────── */}
        <TimelineSection title="Education" icon="🎓" accent={accent} accent2={accent2} isTerminal={isTerminal} isCyber={isCyber} isLight={isLight}>
          {resume.education.map((item, i) => (
            <motion.div key={item.id} variants={itemVariants}>
              <motion.div
                className={`${cardBase} p-5`}
                whileHover={{ y: -2, boxShadow: `0 8px 30px ${accent}15` }}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    className={`p-2.5 rounded-lg mt-0.5 flex-shrink-0 ${
                      isCyber ? 'bg-[#7b2fff]/10 text-[#7b2fff]' :
                      isTerminal ? 'bg-[#00ff41]/10 text-[#00ff41]' :
                      isLight ? 'bg-blue-50 text-blue-600' :
                      'bg-blue-400/10 text-blue-400'
                    }`}
                    whileHover={{ scale: 1.15, rotate: -5 }}
                  >
                    <GraduationCap size={15} />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                      <h3 className={`${headingCls} text-sm`}
                        style={isTerminal || isCyber ? { fontFamily: 'monospace' } : {}}>
                        {item.role}
                      </h3>
                      <span className={`text-xs whitespace-nowrap ${isLight ? 'text-slate-400' : 'opacity-40'}`}>
                        {item.startDate} – {item.endDate}
                      </span>
                    </div>
                    <p className={`${subCls} mb-2`}>{item.organization} · {item.location}</p>
                    {item.gpa && (
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 'auto' }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs mb-2"
                        style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
                      >
                        <Star size={10} />
                        GPA: {item.gpa}
                      </motion.div>
                    )}
                    <ul className="space-y-1">
                      {item.highlights.map((h, j) => (
                        <li key={j} className={`text-xs flex gap-2 ${isLight ? 'text-slate-600' : 'opacity-50'}`}>
                          <span style={{ color: accent }} className="mt-0.5 opacity-60">
                            {isTerminal ? '>' : '▸'}
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </TimelineSection>

        {/* ── Achievements ────────────────────────────────────────── */}
        <TimelineSection title="Achievements" icon="🏆" accent={accent} accent2={accent2} isTerminal={isTerminal} isCyber={isCyber} isLight={isLight}>
          {resume.achievements.map((item, i) => (
            <motion.div key={item.id} variants={itemVariants}>
              <motion.div
                className={`${cardBase} p-5`}
                whileHover={{ y: -2, boxShadow: `0 8px 30px ${accent}20` }}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    className={`p-2.5 rounded-lg mt-0.5 flex-shrink-0 ${
                      isCyber ? 'bg-[#ffd700]/10 text-[#ffd700]' :
                      isTerminal ? 'bg-[#ffb000]/10 text-[#ffb000]' :
                      isLight ? 'bg-yellow-50 text-yellow-600' :
                      'bg-yellow-400/10 text-yellow-400'
                    }`}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  >
                    <Trophy size={15} />
                  </motion.div>
                  <div>
                    <h3 className={`${headingCls} text-sm mb-0.5`}
                      style={isTerminal || isCyber ? { fontFamily: 'monospace' } : {}}>
                      {item.title}
                    </h3>
                    <p className={`${subCls} mb-1`}>{item.organization} · {item.date}</p>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'opacity-50'}`}>{item.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </TimelineSection>

      </div>
    </div>
  )
}

// ── Timeline Section ──────────────────────────────────────────────────────────
function TimelineSection({ title, icon, children, isCyber, isTerminal, isLight, accent, accent2 }: {
  title: string
  icon: string
  children: React.ReactNode
  isCyber: boolean
  isTerminal: boolean
  isLight?: boolean
  accent: string
  accent2: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="mb-14"
    >
      {/* Section header */}
      <motion.div className="flex items-center gap-3 mb-6" variants={itemVariants}>
        <motion.span
          className="text-xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: Math.random() * 2 }}
        >
          {icon}
        </motion.span>
        <h2
          className="text-xl font-bold"
          style={{ color: accent2, fontFamily: isCyber || isTerminal ? 'monospace' : undefined }}
        >
          {isTerminal ? `## ${title}` : isCyber ? `>> ${title}` : title}
        </h2>
        {/* Animated line */}
        <motion.div
          className="flex-1 h-px"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          style={{
            background: `linear-gradient(to right, ${accent2}40, transparent)`,
            transformOrigin: 'left',
          }}
        />
      </motion.div>

      {/* Cards */}
      <div className="relative pl-4">
        {/* Timeline line */}
        <motion.div
          variants={lineVariants}
          className="absolute left-0 top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, ${accent}60, ${accent}10)` }}
        />
        <div className="space-y-3">{children}</div>
      </div>
    </motion.div>
  )
}
