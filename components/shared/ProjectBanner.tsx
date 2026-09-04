'use client'

import { useTheme } from '@/lib/context/ThemeContext'
import {
  Bot, GitBranch, Database, Brain, Layers, Star, type LucideIcon,
} from 'lucide-react'
import { Project } from '@/types'

/**
 * Deterministic, image-free banner for a project card.
 *
 * The `image` field in projects.json points at PNGs that were never shipped,
 * so cards used to render with no visual header at all. This component draws a
 * consistent gradient + category-icon banner instead — no asset pipeline, no
 * missing-file fallbacks, and it stays on-brand across all four themes.
 */

interface CategoryStyle {
  from: string
  to: string
  Icon: LucideIcon
}

// Keyed by the consolidated category set in content/projects.json.
const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'Agentic AI':      { from: '#8b5cf6', to: '#d946ef', Icon: Bot },
  'LLM / MLOps':     { from: '#10b981', to: '#14b8a6', Icon: GitBranch },
  'Data & Cloud':    { from: '#0ea5e9', to: '#3b82f6', Icon: Database },
  'Machine Learning':{ from: '#f59e0b', to: '#f97316', Icon: Brain },
  'Full Stack':      { from: '#f43f5e', to: '#ec4899', Icon: Layers },
}

const FALLBACK: CategoryStyle = { from: '#8b5cf6', to: '#3b82f6', Icon: Layers }

const styleFor = (category: string) => CATEGORY_STYLES[category] ?? FALLBACK

interface ProjectBannerProps {
  project: Project
  /** Taller banner for the featured/hero card on the home grid. */
  tall?: boolean
}

export default function ProjectBanner({ project, tall = false }: ProjectBannerProps) {
  const { theme } = useTheme()
  const isTerminal = theme === 'terminal-hacker'
  const { from, to, Icon } = styleFor(project.category)
  const height = tall ? 'h-36' : 'h-28'

  // Terminal theme keeps its monospace / phosphor identity instead of a gradient.
  if (isTerminal) {
    return (
      <div
        className={`relative w-full ${height} overflow-hidden border-b border-[#00ff41]/20`}
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(0,255,65,0.05) 0px, rgba(0,255,65,0.05) 1px, transparent 1px, transparent 4px)',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <span className="text-[10px] text-[#00ff41]/50 font-mono">
            {`> ${project.category.toLowerCase().replace(/[^a-z]+/g, '_')}`}
          </span>
          <Icon size={tall ? 60 : 48} className="text-[#00ff41]/30" strokeWidth={1.25} />
        </div>
        {project.featured && (
          <span className="absolute top-2 left-3 text-[10px] text-[#ffb000] font-mono">[featured]</span>
        )}
      </div>
    )
  }

  return (
    <div
      className={`relative w-full ${height} overflow-hidden`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      {/* Soft diagonal sheen */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.18), transparent 55%)' }}
      />
      {/* Category icon watermark */}
      <Icon
        size={tall ? 128 : 104}
        strokeWidth={1}
        className="absolute -right-4 -bottom-6 text-white/25"
      />
      {project.featured && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/95 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/25">
          <Star size={10} className="fill-white/90" /> Featured
        </span>
      )}
    </div>
  )
}
