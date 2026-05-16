'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react'
import { Project } from '@/types'
import TiltCard from '@/components/effects/TiltCard'

interface ProjectCardProps { project: Project; index?: number }

export default function GlassProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <TiltCard
        maxTilt={8}
        glareColor="rgba(139,92,246,0.08)"
        className="group relative rounded-2xl border border-white/10 overflow-hidden h-full"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, transparent)' }} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 rounded-full">
              {project.category}
            </span>
            <div className="flex gap-2">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all">
                  <Github size={14} />
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all">
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2 group-hover:text-purple-200 transition-colors">
            {project.title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.slice(0, 4).map(t => (
              <span key={t} className="text-xs text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">{t}</span>
            ))}
          </div>
          <Link href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors group/link">
            View details
            <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </TiltCard>
    </motion.div>
  )
}
