'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, ArrowUpRight, Briefcase, Layers, Sparkles } from 'lucide-react'
import { getSkillUsage } from '@/lib/skillUsage'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'

interface Props {
  skill: string | null
  onClose: () => void
}

/**
 * "How do I actually know this?" panel.
 * Opens when a visitor clicks a skill and shows the projects that used it,
 * the specific highlights mentioning it, and the roles where it applied, so a
 * claimed skill is always backed by evidence rather than being a bare tag.
 */
export default function SkillDetailModal({ skill, onClose }: Props) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const { accent, accent2, light: isLight, mono: isTerminal } = getAccents(theme)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!skill) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [skill, onClose])

  if (!mounted) return null

  const usage = skill ? getSkillUsage(skill) : null

  const panelBg = isTerminal
    ? '#04140a'
    : isLight
    ? '#ffffff'
    : 'linear-gradient(180deg, #232a45 0%, #171d33 100%)'
  const panelBorder = isTerminal
    ? '1px solid rgba(0,255,65,0.45)'
    : isLight
    ? '1px solid #e2e8f0'
    : '1px solid rgba(255,255,255,0.22)'
  const titleColor = isTerminal ? '#00ff41' : isLight ? '#0f172a' : '#ffffff'
  const bodyColor = isTerminal ? 'rgba(0,255,65,0.75)' : isLight ? '#475569' : 'rgba(255,255,255,0.82)'
  const mutedColor = isTerminal ? 'rgba(0,255,65,0.5)' : isLight ? '#64748b' : 'rgba(255,255,255,0.6)'
  const cardBg = isTerminal ? 'rgba(0,255,65,0.05)' : isLight ? '#f8fafc' : 'rgba(255,255,255,0.07)'
  const cardBorder = isLight ? '1px solid #eef2f7' : '1px solid rgba(255,255,255,0.10)'
  const mono = isTerminal ? { fontFamily: 'monospace' } : undefined

  const plural = usage && usage.projectCount > 1 ? 's' : ''

  return createPortal(
    <AnimatePresence>
      {skill && usage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 2147483100, background: 'rgba(2,6,23,0.72)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`How I use ${skill}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl"
            style={{ background: panelBg, border: panelBorder, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', ...mono }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 px-5 pt-5 pb-4"
              style={{
                background: panelBg,
                borderBottom: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: accent }}>
                    Skill in practice
                  </p>
                  <h3 className="text-xl font-bold leading-tight" style={{ color: titleColor }}>
                    {skill}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {usage.categories.map(c => (
                      <span
                        key={c}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ color: accent, background: `${accent}1e`, border: `1px solid ${accent}44` }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
                  style={{ color: mutedColor, background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.10)' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="px-5 py-4 space-y-5">
              {/* Projects */}
              <div>
                <p
                  className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2.5"
                  style={{ color: mutedColor }}
                >
                  <Layers size={12} />
                  {usage.projectCount > 0
                    ? `Used in ${usage.projectCount} project${plural}`
                    : 'Projects'}
                </p>

                {usage.uses.length === 0 && (
                  <p className="text-sm" style={{ color: mutedColor }}>
                    Part of the wider toolkit, not a headline technology on any listed project yet.
                  </p>
                )}

                <div className="space-y-2.5">
                  {usage.uses.map(({ project, evidence }) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      onClick={onClose}
                      className="block rounded-xl p-3 transition-transform hover:-translate-y-0.5"
                      style={{ background: cardBg, border: cardBorder, textDecoration: 'none' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[13px] font-semibold leading-snug" style={{ color: titleColor }}>
                          {project.title}
                        </span>
                        <ArrowUpRight size={13} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px]" style={{ color: accent }}>{project.category}</span>
                        <span className="text-[10px]" style={{ color: mutedColor }}>· {project.date}</span>
                      </div>
                      {evidence.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {evidence.map((e, i) => (
                            <li key={i} className="flex gap-1.5 text-[11.5px] leading-snug" style={{ color: bodyColor }}>
                              <span style={{ color: accent2 }}>▸</span>
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Roles */}
              {usage.roles.length > 0 && (
                <div>
                  <p
                    className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2"
                    style={{ color: mutedColor }}
                  >
                    <Briefcase size={12} /> Applied professionally
                  </p>
                  <div className="space-y-1.5">
                    {usage.roles.map(r => (
                      <div key={r.id} className="text-[12px]" style={{ color: bodyColor }}>
                        <span className="font-semibold" style={{ color: titleColor }}>{r.role}</span>
                        <span style={{ color: mutedColor }}> · {r.organization}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href="/projects"
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-[12px] font-semibold transition-opacity hover:opacity-90"
                style={{
                  color: isTerminal ? '#04140a' : '#ffffff',
                  background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                  textDecoration: 'none',
                }}
              >
                <Sparkles size={13} /> Browse all projects
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
