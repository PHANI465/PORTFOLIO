'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Brain, Cpu, Database, ArrowRight, RotateCcw } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'
import projectsData from '@/content/projects.json'
import resumeData from '@/content/resume.json'
import { Project, Resume } from '@/types'

const projects = projectsData as Project[]
const resume = resumeData as Resume

type RoleId = 'ai-llm' | 'ml-engineering' | 'data-engineering'

const ROLES: { id: RoleId; label: string; icon: typeof Brain; pitch: string }[] = [
  {
    id: 'ai-llm',
    label: 'AI / LLM Engineering',
    icon: Brain,
    pitch: 'Agentic workflows, RAG pipelines, and LLM evaluation built for production, not demos.',
  },
  {
    id: 'ml-engineering',
    label: 'ML Engineering',
    icon: Cpu,
    pitch: 'End-to-end modeling: classic ML, deep learning, and optimization, shipped and benchmarked.',
  },
  {
    id: 'data-engineering',
    label: 'Data Engineering',
    icon: Database,
    pitch: 'Star-schema pipelines, cloud infrastructure, and the plumbing that keeps AI systems fed.',
  },
]

// Curated per project, since inferring role fit from free-text category strings
// would be too fuzzy for a recruiter-facing feature like this.
const PROJECT_ROLES: Record<string, RoleId[]> = {
  'insighthub': ['ai-llm', 'data-engineering'],
  'asu-llm-eval': ['ai-llm', 'ml-engineering'],
  'traveliq': ['ai-llm', 'ml-engineering'],
  'republic-of-bean': ['ai-llm'],
  'anomaly-detection': ['ml-engineering'],
  'ai-voice-turing': ['ml-engineering', 'ai-llm'],
  'heart-disease-detection': ['ml-engineering', 'data-engineering'],
  'shaded-route-planning': ['data-engineering'],
  'industrial-ai-copilot': ['data-engineering', 'ml-engineering'],
  'ai-portfolio': ['ai-llm'],
}

const SKILL_CATEGORY_ROLES: Record<string, RoleId[]> = {
  'Agentic AI & LLMs': ['ai-llm'],
  'AI Evaluation & Guardrails': ['ai-llm'],
  'Full-Stack Development': ['ai-llm', 'data-engineering'],
  'Data & ML': ['ml-engineering', 'data-engineering'],
  'Cloud & DevOps': ['data-engineering'],
}

export default function RoleQuiz() {
  const { theme } = useTheme()
  const [selected, setSelected] = useState<RoleId | null>(null)
  const { accent, light: isLight, mono: isTerminal } = getAccents(theme)

  if (isTerminal) return null

  const role = ROLES.find(r => r.id === selected)

  const matchedProjects = selected
    ? [...projects]
        .filter(p => PROJECT_ROLES[p.id]?.includes(selected))
        .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
        .slice(0, 3)
    : []

  const matchedSkills = selected
    ? resume.skills.filter(s => SKILL_CATEGORY_ROLES[s.category]?.includes(selected))
    : []

  const cardStyle: React.CSSProperties = isLight
    ? { background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }
    : {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
        backdropFilter: 'blur(22px) saturate(140%)',
        WebkitBackdropFilter: 'blur(22px) saturate(140%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 30px -10px rgba(0,0,0,0.4)',
      }

  return (
    <section className="relative py-10 px-4">
      <div className="max-w-4xl mx-auto rounded-2xl p-6 md:p-8" style={cardStyle}>
        {!role ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2
                className="font-display text-xl md:text-2xl font-bold mb-1.5"
                style={{ color: isLight ? '#0f172a' : '#ffffff' }}
              >
                What are you hiring for?
              </h2>
              <p className="text-sm mb-6" style={{ color: isLight ? '#64748b' : 'rgba(255,255,255,0.5)' }}>
                Pick a focus and I&apos;ll surface the projects and skills most relevant to it.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROLES.map(r => (
                  <motion.button
                    key={r.id}
                    onClick={() => setSelected(r.id)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-start gap-2.5 p-4 rounded-xl border text-left transition-colors"
                    style={{
                      borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
                      background: isLight ? '#fff' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <r.icon size={18} style={{ color: accent }} />
                    <span className="text-sm font-semibold" style={{ color: isLight ? '#0f172a' : '#fff' }}>
                      {r.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-start justify-between gap-4 mb-1.5">
                <div className="flex items-center gap-2.5">
                  <role.icon size={20} style={{ color: accent }} />
                  <h2 className="font-display text-xl md:text-2xl font-bold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                    {role.label}
                  </h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-1.5 text-xs flex-shrink-0 mt-1.5 transition-colors"
                  style={{ color: isLight ? '#64748b' : 'rgba(255,255,255,0.45)' }}
                >
                  <RotateCcw size={12} /> Try another
                </button>
              </div>
              <p className="text-sm mb-6" style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.65)' }}>
                {role.pitch}
              </p>

              {matchedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {matchedSkills.flatMap(s => s.skills).slice(0, 10).map(skill => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-lg border"
                      style={
                        isLight
                          ? { color: '#334155', borderColor: `${accent}40`, background: `${accent}0d` }
                          : { color: 'rgba(255,255,255,0.82)', borderColor: `${accent}35`, background: `${accent}12` }
                      }
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {matchedProjects.map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="block group">
                    <div
                      className="h-full p-4 rounded-xl border transition-colors"
                      style={{
                        borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
                        background: isLight ? '#fff' : 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold leading-snug" style={{ color: isLight ? '#0f172a' : '#fff' }}>
                          {p.title}
                        </span>
                        <ArrowRight
                          size={13}
                          className="flex-shrink-0 mt-0.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                          style={{ color: accent }}
                        />
                      </div>
                      <p className="text-xs mt-1.5 line-clamp-2" style={{ color: isLight ? '#64748b' : 'rgba(255,255,255,0.5)' }}>
                        {p.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
      </div>
    </section>
  )
}
