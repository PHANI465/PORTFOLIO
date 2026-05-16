'use client'

import { motion } from 'framer-motion'
import { Download, Github, Linkedin, Mail, ExternalLink, ChevronDown } from 'lucide-react'
import portfolioData from '@/content/portfolio.json'
import projectsData from '@/content/projects.json'
import resumeData from '@/content/resume.json'
import { Portfolio, Project, Resume } from '@/types'
import { useTheme } from '@/lib/context/ThemeContext'
import Link from 'next/link'

const portfolio = portfolioData as Portfolio
const projects = (projectsData as Project[]).filter(p => p.featured)
const resume = resumeData as Resume

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export default function OnePagePortfolio() {
  const { theme } = useTheme()
  const isLight = theme === 'minimal-professional' || theme === 'bright-neon'
  const isCyber = theme === 'cyberpunk-ai'
  const isTerminal = theme === 'terminal-hacker'

  const accent = isCyber ? '#00fff5' : isTerminal ? '#00ff41' :
    theme === 'bright-neon' ? '#7c3aed' :
    theme === 'dark-professional' ? '#3b82f6' : '#8b5cf6'

  const textPrimary = isLight ? '#0f172a' : '#ffffff'
  const textMuted = isLight ? '#64748b' : 'rgba(255,255,255,0.5)'
  const cardBg = isLight
    ? '#ffffff'
    : isCyber ? 'rgba(0,255,245,0.03)' : isTerminal ? 'rgba(0,255,65,0.03)' : 'rgba(255,255,255,0.04)'
  const cardBorder = isLight ? '#e2e8f0'
    : isCyber ? 'rgba(0,255,245,0.15)' : isTerminal ? 'rgba(0,255,65,0.15)' : 'rgba(255,255,255,0.1)'

  const monoFont = isCyber ? 'Orbitron, monospace' : isTerminal ? 'Share Tech Mono, monospace' : 'Inter, sans-serif'

  return (
    <div className="min-h-screen pt-20 pb-16 px-4" style={{ fontFamily: monoFont }}>
      <div className="max-w-4xl mx-auto">

        {/* ── HERO ── */}
        <section className="py-16 text-center border-b" style={{ borderColor: cardBorder }}>
          <motion.div {...fadeUp}>
            {portfolio.openToWork && (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full mb-6 border"
                style={{ color: accent, borderColor: `${accent}40`, background: `${accent}08` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00ff41' }} />
                Available for hire
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{ color: textPrimary }}>
              {portfolio.name}
            </h1>
            <p className="text-lg mb-2" style={{ color: accent }}>{portfolio.title}</p>
            <p className="max-w-xl mx-auto text-sm leading-relaxed mb-8" style={{ color: textMuted }}>
              {portfolio.tagline}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={portfolio.resumeUrl} download
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all hover:scale-105"
                style={{ background: accent, color: isLight ? '#fff' : '#000' }}>
                <Download size={14} /> Download CV
              </a>
              <a href={`mailto:${portfolio.email}`}
                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg border transition-all hover:scale-105"
                style={{ color: textPrimary, borderColor: cardBorder, background: cardBg }}>
                <Mail size={14} /> Email me
              </a>
              <a href="https://linkedin.com/in/phaneendra-gavara" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg border transition-all hover:scale-105"
                style={{ color: textPrimary, borderColor: cardBorder, background: cardBg }}>
                <Linkedin size={14} /> LinkedIn
              </a>
              <a href="https://github.com/PHANI465" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg border transition-all hover:scale-105"
                style={{ color: textPrimary, borderColor: cardBorder, background: cardBg }}>
                <Github size={14} /> GitHub
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── SKILLS ── */}
        <section className="py-12 border-b" style={{ borderColor: cardBorder }}>
          <motion.div {...fadeUp}>
            <SectionLabel accent={accent} isLight={isLight}>Skills</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resume.skills.map(cat => (
                <div key={cat.category} className="p-4 rounded-xl border"
                  style={{ background: cardBg, borderColor: cardBorder }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: accent }}>{cat.category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded border"
                        style={{ color: textMuted, borderColor: cardBorder, background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.04)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── FEATURED PROJECTS ── */}
        <section className="py-12 border-b" style={{ borderColor: cardBorder }}>
          <motion.div {...fadeUp}>
            <SectionLabel accent={accent} isLight={isLight}>Featured Projects</SectionLabel>
            <div className="space-y-4">
              {projects.map((p, i) => (
                <motion.div key={p.id} {...fadeUp} transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-xl border" style={{ background: cardBg, borderColor: cardBorder }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold" style={{ color: textPrimary }}>{p.title}</h3>
                      <p className="text-xs" style={{ color: accent }}>{p.category}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer"
                        style={{ color: textMuted }}><Github size={15} /></a>}
                      {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer"
                        style={{ color: textMuted }}><ExternalLink size={15} /></a>}
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: textMuted }}>{p.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 5).map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded border"
                        style={{ color: textMuted, borderColor: cardBorder }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section className="py-12 border-b" style={{ borderColor: cardBorder }}>
          <motion.div {...fadeUp}>
            <SectionLabel accent={accent} isLight={isLight}>Experience & Education</SectionLabel>
            <div className="space-y-3">
              {[...resume.experience, ...resume.education].map((item, i) => (
                <motion.div key={item.id} {...fadeUp} transition={{ delay: i * 0.06 }}
                  className="flex gap-4 p-4 rounded-xl border"
                  style={{ background: cardBg, borderColor: cardBorder }}>
                  <div className="w-1 rounded-full shrink-0 mt-1"
                    style={{ background: accent, minHeight: '40px' }} />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <h3 className="font-semibold text-sm" style={{ color: textPrimary }}>{item.role}</h3>
                      <span className="text-xs" style={{ color: textMuted }}>
                        {item.startDate} – {item.current ? 'Present' : item.endDate}
                      </span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: accent }}>
                      {item.organization} · {item.location}
                    </p>
                    {item.gpa && <p className="text-xs text-yellow-500 mb-1">GPA: {item.gpa}</p>}
                    <p className="text-xs" style={{ color: textMuted }}>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── ACHIEVEMENTS ── */}
        <section className="py-12 border-b" style={{ borderColor: cardBorder }}>
          <motion.div {...fadeUp}>
            <SectionLabel accent={accent} isLight={isLight}>Achievements</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resume.achievements.map((a, i) => (
                <motion.div key={a.id} {...fadeUp} transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl border" style={{ background: cardBg, borderColor: cardBorder }}>
                  <p className="font-semibold text-sm mb-1" style={{ color: textPrimary }}>🏆 {a.title}</p>
                  <p className="text-xs mb-1" style={{ color: accent }}>{a.organization} · {a.date}</p>
                  <p className="text-xs" style={{ color: textMuted }}>{a.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── CONTACT ── */}
        <section className="py-12 text-center">
          <motion.div {...fadeUp}>
            <SectionLabel accent={accent} isLight={isLight}>Get in Touch</SectionLabel>
            <p className="text-sm mb-6" style={{ color: textMuted }}>
              Open to full-time roles in Data Science, ML Engineering, and Applied AI.
            </p>
            <a href={`mailto:${portfolio.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all hover:scale-105"
              style={{ background: accent, color: isLight ? '#fff' : '#000' }}>
              <Mail size={15} /> {portfolio.email}
            </a>
          </motion.div>
        </section>

        {/* Full portfolio link */}
        <div className="text-center pb-4">
          <Link href="/" className="text-xs underline" style={{ color: textMuted }}>
            ← Switch to full portfolio
          </Link>
        </div>

      </div>
    </div>
  )
}

function SectionLabel({ children, accent, isLight }: { children: React.ReactNode; accent: string; isLight: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-6 h-0.5 rounded" style={{ background: accent }} />
      <h2 className="text-lg font-bold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{children}</h2>
      <div className="flex-1 h-px" style={{ background: `${accent}20` }} />
    </div>
  )
}
