'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import { Project } from '@/types'
import TiltCard from '@/components/effects/TiltCard'
import ProjectBanner from '@/components/shared/ProjectBanner'

export default function MinimalProjectCard({ project, index = 0, hero = false }: { project: Project; index?: number; hero?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }}
      className="h-full"
    >
      <TiltCard
        maxTilt={5}
        glareColor="rgba(99,102,241,0.05)"
        className="group border border-slate-100 rounded-xl bg-white overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all h-full flex flex-col"
      >
        <ProjectBanner project={project} tall={hero} />
        <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {project.category}
          </span>
          <div className="flex gap-1.5">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                aria-label={`View ${project.title} on GitHub`}
                className="p-1.5 text-slate-300 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-all">
                <Github size={14} />
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                aria-label={`View live demo of ${project.title}`}
                className="p-1.5 text-slate-300 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-all">
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
        <h3 className="font-semibold text-slate-900 mb-1.5 group-hover:text-indigo-700 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 4).map(t => (
            <span key={t} className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">{t}</span>
          ))}
        </div>
        <Link href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium group/link">
          View details
          <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
        </div>
      </TiltCard>
    </motion.div>
  )
}
