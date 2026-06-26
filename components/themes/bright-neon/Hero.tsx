'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Linkedin, Github } from 'lucide-react'
import ResumeDropdown from '@/components/shared/ResumeDropdown'
import { Portfolio } from '@/types'
import { useTypewriter } from '@/lib/hooks/useTypewriter'

const ROLES = [
  'Data Scientist',
  'ML Engineer',
  'AI/LLM Developer',
  'Research Engineer',
  'Data Engineer',
]

interface HeroProps { portfolio: Portfolio }

export default function BrightNeonHero({ portfolio }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const { displayText } = useTypewriter({ words: ROLES, typeSpeed: 80, deleteSpeed: 45, pauseTime: 2000 })

  const socials    = (portfolio.socials ?? []) as { platform: string; url: string }[]
  const linkedinUrl = socials.find(s => s.platform === 'LinkedIn')?.url ?? '#'
  const githubUrl   = socials.find(s => s.platform === 'GitHub')?.url   ?? '#'

  const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16 px-6 bg-white"
    >
      {/* Blob 1 — vivid purple */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -right-20 w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 65%)' }}
      />
      {/* Blob 2 — hot pink */}
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute -bottom-20 -left-20 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 65%)' }}
      />
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Top accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #7c3aed, #ec4899, #7c3aed)' }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">

          {/* Content */}
          <motion.div
            style={{ y, opacity }}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1"
          >
            {/* Available badge */}
            {portfolio.openToWork && (
              <motion.div variants={item}
                className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                </span>
                <span className="text-xs text-purple-700 font-medium">Open to full-time roles</span>
              </motion.div>
            )}

            {/* Name */}
            <motion.h1 variants={item}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-3 leading-none tracking-tight">
              Phaneendra{' '}
              <span style={{
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Gavara</span>
            </motion.h1>

            {/* Social icons */}
            <motion.div variants={item} className="flex items-center gap-2.5 mb-5">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="flex items-center justify-center w-8 h-8 rounded-full border border-purple-200 text-purple-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-blue-50 transition-all duration-200">
                <Linkedin size={14} />
              </a>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200">
                <Github size={14} />
              </a>
            </motion.div>

            {/* Typewriter */}
            <motion.div variants={item} className="flex items-center gap-2 mb-5 h-9">
              <span className="text-slate-400 text-lg font-light">I&apos;m a</span>
              <span className="text-xl font-bold" style={{
                background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{displayText}</span>
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                className="text-purple-500 font-bold text-xl">|</motion.span>
            </motion.div>

            {/* Tagline */}
            <motion.p variants={item} className="text-slate-500 max-w-xl leading-relaxed mb-8 text-sm md:text-base">
              {portfolio.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
              <Link href="/projects"
                className="group flex items-center gap-2 px-6 py-2.5 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', boxShadow: '0 6px 24px rgba(124,58,237,0.35)' }}>
                <Sparkles size={15} /> View Projects <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <ResumeDropdown
                label="Download CV"
                triggerCls="flex items-center gap-2 px-6 py-2.5 text-slate-700 text-sm font-medium border-2 border-purple-200 hover:border-purple-400 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all"
                menuCls="rounded-xl border border-purple-200 bg-white shadow-lg py-1"
                itemCls="block px-4 py-2.5 text-sm text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              />
            </motion.div>

            {/* GPA chip */}
            <motion.div variants={item}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-100 bg-purple-50 text-sm">
              <span className="font-bold text-slate-800">3.90<span className="text-purple-500 text-xs">/4.0</span></span>
              <span className="w-px h-3 bg-purple-200" />
              <span className="text-slate-400 text-xs tracking-wide">GPA @ ASU</span>
            </motion.div>
          </motion.div>

          {/* Right — floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0"
          >
            {[
              { val: '3.90/4.0', label: 'GPA @ ASU', color: '#7c3aed' },
              { val: '6+ Projects', label: 'Production builds', color: '#ec4899' },
              { val: '4 Courses', label: 'Teaching Assisted', color: '#7c3aed' },
            ].map(({ val, label, color }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.12 }}
                whileHover={{ y: -2, boxShadow: `0 8px 24px ${color}22` }}
                className="p-5 rounded-2xl border-2 bg-white transition-all cursor-default"
                style={{ borderColor: `${color}22` }}>
                <div className="text-xl font-bold mb-0.5" style={{ color }}>{val}</div>
                <div className="text-xs text-slate-400">{label}</div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Scroll cue */}
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-5 h-8 rounded-full border-2 border-purple-200 flex items-start justify-center pt-1.5">
          <motion.div className="w-1 h-1.5 rounded-full bg-purple-400"
            animate={{ y: [0, 8, 0], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  )
}
