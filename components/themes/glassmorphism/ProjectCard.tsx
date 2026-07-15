'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react'
import { Project } from '@/types'
import TiltCard from '@/components/effects/TiltCard'

interface ProjectCardProps { project: Project; index?: number }

// Brand colors for common tech chips, used for subtle accent borders.
const TECH_COLORS: Record<string, string> = {
  python: '#3776ab', pytorch: '#ee4c2c', tensorflow: '#ff6f00',
  langchain: '#1c3c3c', openai: '#10a37f', huggingface: '#ffcc00',
  pinecone: '#5ad6e6', weaviate: '#43c0a3',
  'next.js': '#ffffff', nextjs: '#ffffff', react: '#61dafb',
  typescript: '#3178c6', javascript: '#f7df1e',
  node: '#3c873a', 'node.js': '#3c873a',
  postgres: '#336791', postgresql: '#336791', mongodb: '#47a248', redis: '#dc382d',
  docker: '#2496ed', kubernetes: '#326ce5', aws: '#ff9900', gcp: '#4285f4', azure: '#0078d4',
  fastapi: '#009688', flask: '#000000', django: '#092e20',
  tailwind: '#06b6d4', 'tailwind css': '#06b6d4',
  pandas: '#150458', numpy: '#013243', scikit: '#f7931e', 'scikit-learn': '#f7931e',
  rag: '#a78bfa', llm: '#a78bfa', llama: '#a78bfa',
}
const techColor = (t: string) => TECH_COLORS[t.toLowerCase()] ?? '#a78bfa'

export default function GlassProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="h-full"
    >
      <TiltCard
        maxTilt={7}
        glareColor="rgba(139,92,246,0.10)"
        className="group relative rounded-2xl border border-white/10 overflow-hidden h-full"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(22px) saturate(140%)',
          WebkitBackdropFilter: 'blur(22px) saturate(140%)',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Animated gradient top border */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-80"
          style={{
            background:
              'linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, #14b8a6, transparent)',
            backgroundSize: '200% 100%',
            animation: 'gradientShift 6s linear infinite',
          }}
        />

        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-purple-300 bg-purple-400/10 border border-purple-400/25 px-2 py-0.5 rounded-full">
              {project.category}
            </span>
            <div className="flex gap-1.5">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  aria-label="GitHub repository"
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <Github size={14} />
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  aria-label="Live demo"
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2 group-hover:text-purple-200 transition-colors text-balance">
            {project.title}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>

          {/* Brand-colored tech chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.slice(0, 5).map(t => {
              const c = techColor(t)
              return (
                <span
                  key={t}
                  className="text-[11px] flex items-center gap-1.5 px-2 py-0.5 rounded-md border"
                  style={{ background: `${c}14`, borderColor: `${c}38`, color: 'rgba(255,255,255,0.82)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                  {t}
                </span>
              )
            })}
            {project.tech.length > 5 && (
              <span className="text-[11px] px-2 py-0.5 rounded-md border border-white/10 text-white/45">
                +{project.tech.length - 5}
              </span>
            )}
          </div>

          {/* Split action row */}
          <div className="mt-auto flex items-center gap-2">
            <Link
              href={`/projects/${project.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white px-3 py-2 rounded-lg border border-white/10 hover:border-purple-400/40 hover:bg-purple-400/10 transition-all"
            >
              Details
              <ArrowUpRight size={12} />
            </Link>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white px-3 py-2 rounded-lg transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', boxShadow: '0 0 16px rgba(139,92,246,0.35)' }}
              >
                Live <ExternalLink size={12} />
              </a>
            )}
            {!project.demo && project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
              >
                Code <Github size={12} />
              </a>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}
