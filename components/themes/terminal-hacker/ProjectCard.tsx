'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Project } from '@/types'

interface ProjectCardProps { project: Project; index?: number }

export default function TerminalProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group border border-[#00ff41]/15 hover:border-[#00ff41]/50 transition-all duration-300 p-4 relative overflow-hidden"
      style={{ background: 'rgba(0,255,65,0.02)', fontFamily: 'Share Tech Mono, monospace' }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(0,255,65,0.04) 0%, transparent 70%)' }} />

      {/* File path header */}
      <div className="flex items-center gap-2 mb-3 text-xs text-[#00ff41]/30">
        <span>~/projects/</span>
        <span className="text-[#00ff41]/60">{project.id}.md</span>
        <span className="ml-auto border border-[#00ff41]/20 px-1 py-0.5 text-[10px] text-[#ffb000]/70">
          {project.status}
        </span>
      </div>

      <h3 className="text-[#00ff41] font-bold mb-1 group-hover:text-white transition-colors text-sm">
        # {project.title}
      </h3>
      <div className="text-xs text-[#00ff41]/40 mb-3">&gt; {project.category}</div>
      <p className="text-xs text-[#00ff41]/55 leading-relaxed mb-3">{project.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {project.tech.slice(0, 5).map(t => (
          <span key={t} className="text-[10px] text-[#ffb000]/70 bg-[#ffb000]/5 border border-[#ffb000]/15 px-1.5 py-0.5">{t}</span>
        ))}
      </div>

      <Link href={`/projects/${project.id}`}
        className="text-xs text-[#00ff41]/40 hover:text-[#00ff41] transition-colors">
        $ cat {project.id}.md → read more
      </Link>
    </motion.div>
  )
}
