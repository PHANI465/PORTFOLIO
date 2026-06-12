'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTheme } from '@/lib/context/ThemeContext'
import resumeData from '@/content/resume.json'
import { Resume } from '@/types'

const resume = resumeData as Resume

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 16 },
  },
}

const tagVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 16 } },
}

// Category icons
const categoryIcons: Record<string, string> = {
  'Languages': '⌨️',
  'Agentic AI & LLMs': '🧠',
  'AI Evaluation & Guardrails': '🛡️',
  'Full-Stack Development': '🛠️',
  'Data & ML': '📊',
  'Cloud & DevOps': '☁️',
  'ML / AI': '🤖',
  'LLM / RAG': '🧠',
  'Data Engineering': '🏗️',
  'Cloud / DevOps': '☁️',
  'Visualization': '📊',
  'Frameworks': '🛠️',
  'Databases': '🗄️',
}

export default function SkillsSection() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const isCyber    = theme === 'cyberpunk-ai'
  const isTerminal = theme === 'terminal-hacker'
  const isLight    = theme === 'minimal-professional' || theme === 'bright-neon'

  const accent  = isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#4f46e5' : '#a78bfa'
  const accent2 = isCyber ? '#ff0090' : isTerminal ? '#ffb000' : isLight ? '#6366f1' : '#7c3aed'

  return (
    <section ref={sectionRef} className="py-24 px-4 relative overflow-hidden" id="skills">
      {/* Background glow */}
      {!isLight && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${accent}05 0%, transparent 60%)`,
          }}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs tracking-widest mb-2 font-medium"
            style={{ color: accent, fontFamily: isCyber || isTerminal ? 'monospace' : undefined }}
          >
            {isTerminal ? '$ cat skills.json | jq' : isCyber ? '>> TECH_STACK.SYS' : 'Expertise'}
          </motion.p>

          <div className="flex items-end gap-4">
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
              {isCyber ? 'TECH STACK' : 'Skills'}
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
        </motion.div>

        {/* Skills grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {resume.skills.map((category) => {
            const icon = categoryIcons[category.category] ?? '⚡'
            return (
              <motion.div
                key={category.category}
                variants={cardVariants}
                whileHover={{ y: -4, boxShadow: `0 16px 40px ${accent}12` }}
                className={`p-5 transition-all group relative overflow-hidden ${
                  isTerminal
                    ? 'border border-[#00ff41]/15 hover:border-[#00ff41]/40 bg-black/30'
                    : isCyber
                    ? 'border border-[#00fff5]/15 hover:border-[#00fff5]/50 bg-black/30'
                    : isLight
                    ? 'rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg'
                    : 'rounded-2xl border border-white/10 glass-card hover:border-white/20'
                }`}
              >
                {/* Hover shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% -20%, ${accent}08 0%, transparent 60%)` }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <motion.span
                      className="text-lg"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                      transition={{ duration: 0.4 }}
                    >
                      {icon}
                    </motion.span>
                    <h3
                      className="text-sm font-bold"
                      style={{
                        color: isCyber ? '#ff0090' : isTerminal ? '#ffb000' : isLight ? '#4f46e5' : '#a78bfa',
                        fontFamily: isTerminal || isCyber ? 'monospace' : undefined,
                      }}
                    >
                      {isTerminal ? `[ ${category.category} ]` : category.category}
                    </h3>
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-wrap gap-1.5"
                  >
                    {category.skills.map(skill => (
                      <motion.span
                        key={skill}
                        variants={tagVariants}
                        onHoverStart={() => setHoveredSkill(skill)}
                        onHoverEnd={() => setHoveredSkill(null)}
                        whileHover={{ scale: 1.08, y: -1 }}
                        className={`text-xs px-2.5 py-1 cursor-default transition-all ${
                          isTerminal
                            ? 'text-[#00ff41]/60 border border-[#00ff41]/15 hover:border-[#00ff41]/50 hover:text-[#00ff41]'
                            : isCyber
                            ? 'text-[#00fff5]/60 border border-[#00fff5]/20 hover:border-[#00fff5]/60 hover:text-[#00fff5]'
                            : isLight
                            ? 'text-slate-600 bg-slate-50 border border-slate-100 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'
                            : 'text-white/50 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white/80'
                        }`}
                        style={{
                          fontFamily: isTerminal || isCyber ? 'monospace' : undefined,
                          boxShadow: hoveredSkill === skill ? `0 0 12px ${accent}25` : undefined,
                        }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Floating skill count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center"
        >
          <span className="text-xs" style={{ color: `${accent}50` }}>
            {resume.skills.reduce((acc, cat) => acc + cat.skills.length, 0)} technologies across {resume.skills.length} categories
          </span>
        </motion.div>

      </div>
    </section>
  )
}
