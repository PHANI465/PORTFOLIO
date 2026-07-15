'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTheme } from '@/lib/context/ThemeContext'
import resumeData from '@/content/resume.json'
import { Resume } from '@/types'
import { getAccents } from '@/lib/themeTokens'
import { Trophy, GraduationCap, Briefcase, Heart, ChevronDown, Star, Award } from 'lucide-react'
import ResumeDropdown from './ResumeDropdown'

const resume = resumeData as Resume

const typeIcon = (type: string) => {
  if (type === 'education') return GraduationCap
  if (type === 'volunteer') return Heart
  return Briefcase
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

// entries slide in beside the timeline line, not from below
const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1, x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

// line draws downward, duration-cinematic, transform-origin top
const lineVariants = {
  hidden: { scaleY: 0, originY: 0 },
  show: { scaleY: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function CareerTimeline() {
  const { theme } = useTheme()
  const isTerminal = theme === 'terminal-hacker'
  const { accent, accent2, light: isLight } = getAccents(theme)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const cardBase = isTerminal
    ? 'border border-[#00ff41]/15 hover:border-[#00ff41]/40 bg-black/50'
    : isLight
    ? 'border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg rounded-2xl'
    : 'border border-white/10 glass-card hover:border-white/20 rounded-2xl'

  const headingCls = isTerminal ? 'text-[#00ff41] font-bold'
    : isLight    ? 'text-slate-900 font-semibold'
    : 'text-white font-semibold'

  const subCls = isTerminal ? 'text-[#ffb000] text-xs'
    : isLight    ? 'text-indigo-600 text-sm'
    : 'text-purple-400 text-sm'

  return (
    <div className="max-w-4xl mx-auto mt-24">
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, x: 32 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <p
          className="text-xs tracking-widest mb-2 font-medium"
          style={{ color: accent, fontFamily: isTerminal ? 'monospace' : undefined }}
        >
          {isTerminal ? '$ cat resume.json' : 'Career'}
        </p>
        <div className="flex items-end justify-between gap-4">
          <h2
            className="font-display text-4xl font-bold tracking-tight"
            style={{
              color: isTerminal ? '#00ff41' : isLight ? '#0f172a' : '#ffffff',
              fontFamily: isTerminal ? 'Share Tech Mono, monospace' : undefined,
            }}
          >
            Experience
          </h2>
          <ResumeDropdown
            label={isTerminal ? 'resume.pdf' : 'Download CV'}
            triggerCls={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
              isTerminal ? 'border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/5' :
              isLight ? 'border border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-xl' :
              'border border-purple-400/40 text-purple-400 hover:bg-purple-400/10 rounded-xl'
            }`}
            menuCls={
              isTerminal ? 'border border-[#00ff41]/20 bg-[#0d0d0d] py-1' :
              isLight ? 'rounded-xl border border-slate-200 bg-white shadow-lg py-1' :
              'rounded-xl border border-purple-400/30 bg-[#0f0a1a] py-1 shadow-2xl'
            }
            itemCls={
              isTerminal ? 'block px-4 py-2.5 text-sm text-[#00ff41]/70 hover:text-[#00ff41] hover:bg-[#00ff41]/10 transition-colors whitespace-nowrap' :
              isLight ? 'block px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors whitespace-nowrap' :
              'block px-4 py-2.5 text-sm text-purple-300/80 hover:text-purple-300 hover:bg-purple-400/10 transition-colors whitespace-nowrap'
            }
          />
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mt-4 h-px origin-left"
          style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
        />
      </motion.div>

      {/* Work Experience */}
      <TimelineSection title="Work Experience" icon="💼" accent={accent} accent2={accent2} isTerminal={isTerminal} isLight={isLight}>
        {resume.experience.map((item) => {
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
                      <h3 className={`${headingCls} font-display text-base leading-snug`}
                        style={isTerminal ? { fontFamily: 'monospace' } : {}}>
                        {item.role}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs whitespace-nowrap ${isLight ? 'text-slate-400' : 'opacity-40'}`}>
                          {item.startDate} – {item.current ? 'Present' : item.endDate}
                        </span>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={14} className={isLight ? 'text-slate-400' : 'opacity-30'} />
                        </motion.div>
                      </div>
                    </div>
                    <p className={`${subCls} mb-0`}
                      style={isTerminal ? { fontFamily: 'monospace' } : {}}>
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

      {/* Education */}
      <TimelineSection title="Education" icon="🎓" accent={accent} accent2={accent2} isTerminal={isTerminal} isLight={isLight}>
        {resume.education.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <motion.div className={`${cardBase} p-5`} whileHover={{ y: -2, boxShadow: `0 8px 30px ${accent}15` }}>
              <div className="flex items-start gap-3">
                <motion.div
                  className={`p-2.5 rounded-lg mt-0.5 flex-shrink-0 ${
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
                    <h3 className={`${headingCls} font-display text-base`}
                      style={isTerminal ? { fontFamily: 'monospace' } : {}}>
                      {item.role}
                    </h3>
                    <span className={`text-xs whitespace-nowrap ${isLight ? 'text-slate-400' : 'opacity-40'}`}>
                      {item.startDate} – {item.endDate}
                    </span>
                  </div>
                  <p className={`${subCls} mb-2`}>{item.organization} · {item.location}</p>
                  {item.gpa && (
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs mb-2"
                      style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
                    >
                      <Star size={10} />
                      GPA: {item.gpa}
                    </div>
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

      {/* Achievements */}
      <TimelineSection title="Achievements" icon="🏆" accent={accent} accent2={accent2} isTerminal={isTerminal} isLight={isLight}>
        {resume.achievements.map((item, i) => (
          <motion.div key={item.id} variants={itemVariants}>
            <motion.div className={`${cardBase} p-5`} whileHover={{ y: -2, boxShadow: `0 8px 30px ${accent}20` }}>
              <div className="flex items-start gap-3">
                <motion.div
                  className={`p-2.5 rounded-lg mt-0.5 flex-shrink-0 ${
                    isTerminal ? 'bg-[#ffb000]/10 text-[#ffb000]' :
                    isLight ? 'bg-yellow-50 text-yellow-600' :
                    'bg-yellow-400/10 text-yellow-400'
                  }`}
                  whileHover={{ rotate: [0, 8, -8, 0], transition: { duration: 0.5 } }}
                >
                  <Trophy size={15} />
                </motion.div>
                <div>
                  <h3 className={`${headingCls} text-sm mb-0.5`}
                    style={isTerminal ? { fontFamily: 'monospace' } : {}}>
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

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <TimelineSection title="Certifications" icon="🏅" accent={accent} accent2={accent2} isTerminal={isTerminal} isLight={isLight}>
          {resume.certifications.map((cert, i) => (
            <motion.div key={i} variants={itemVariants}>
              <motion.div className={`${cardBase} p-5`} whileHover={{ y: -2, boxShadow: `0 8px 30px ${accent}20` }}>
                <div className="flex items-start gap-3">
                  <motion.div
                    className={`p-2.5 rounded-lg mt-0.5 flex-shrink-0 ${
                      isTerminal ? 'bg-[#00ff41]/10 text-[#00ff41]' :
                      isLight ? 'bg-emerald-50 text-emerald-600' :
                      'bg-emerald-400/10 text-emerald-400'
                    }`}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                  >
                    <Award size={15} />
                  </motion.div>
                  <div>
                    <h3
                      className={`${headingCls} text-sm mb-0.5`}
                      style={isTerminal ? { fontFamily: 'monospace' } : {}}
                    >
                      {cert.url ? (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                          style={{ color: 'inherit' }}
                        >
                          {cert.name}
                        </a>
                      ) : cert.name}
                    </h3>
                    <p className={subCls}>{cert.issuer} · {cert.date}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </TimelineSection>
      )}
    </div>
  )
}

function TimelineSection({ title, icon, children, isTerminal, isLight, accent, accent2 }: {
  title: string
  icon: string
  children: React.ReactNode
  isTerminal: boolean
  isLight?: boolean
  accent: string
  accent2: string
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="mb-14"
    >
      <motion.div className="flex items-center gap-3 mb-6" variants={itemVariants}>
        <span className="text-xl">{icon}</span>
        <h3
          className="font-display text-xl font-bold"
          style={{ color: accent2, fontFamily: isTerminal ? 'monospace' : undefined }}
        >
          {isTerminal ? `## ${title}` : title}
        </h3>
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

      <div className="relative pl-4">
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
