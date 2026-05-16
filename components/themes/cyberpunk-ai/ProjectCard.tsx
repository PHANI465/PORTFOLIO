'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, ExternalLink, ChevronRight } from 'lucide-react'
import { Project } from '@/types'
import TiltCard from '@/components/effects/TiltCard'

interface ProjectCardProps { project: Project; index?: number }

export default function CyberpunkProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <TiltCard
        maxTilt={7}
        glareColor="rgba(0,255,245,0.06)"
        className="group relative border border-[#00fff5]/20 hover:border-[#00fff5]/60 transition-all duration-300 overflow-hidden h-full"
        style={{ background: 'rgba(0,255,245,0.02)' }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00fff5] opacity-60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00fff5] opacity-60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00fff5] opacity-60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00fff5] opacity-60" />

        {/* Scan line on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,255,245,0.05) 0%, transparent 70%)' }} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs text-[#ff0090] tracking-widest mb-1 block"
                style={{ fontFamily: 'Orbitron, monospace' }}>
                {project.category.toUpperCase()}
              </span>
              <h3 className="text-lg font-bold text-[#00fff5] group-hover:text-white transition-colors"
                style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 8px rgba(0,255,245,0.3)' }}>
                {project.title}
              </h3>
            </div>
            <div className="flex gap-2">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 border border-[#00fff5]/20 text-[#00fff5]/50 hover:text-[#00fff5] hover:border-[#00fff5]/60 transition-colors">
                  <Github size={14} />
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 border border-[#00fff5]/20 text-[#00fff5]/50 hover:text-[#00fff5] hover:border-[#00fff5]/60 transition-colors">
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
          <p className="text-[#00fff5]/50 text-sm leading-relaxed mb-4" style={{ fontFamily: 'monospace' }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.slice(0, 4).map(tech => (
              <span key={tech} className="px-2 py-0.5 text-xs border border-[#7b2fff]/40 text-[#7b2fff] tracking-wider"
                style={{ fontFamily: 'monospace' }}>{tech}</span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-[#00fff5]/30" style={{ fontFamily: 'monospace' }}>
                +{project.tech.length - 4}
              </span>
            )}
          </div>
          <Link href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-xs text-[#00fff5]/50 hover:text-[#00fff5] transition-colors group/link"
            style={{ fontFamily: 'Orbitron, monospace' }}>
            DETAILS <ChevronRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </TiltCard>
    </motion.div>
  )
}
