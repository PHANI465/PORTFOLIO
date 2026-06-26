'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, Mail, Linkedin, Github } from 'lucide-react'
import ResumeDropdown from '@/components/shared/ResumeDropdown'
import { Portfolio } from '@/types'
import { useTypewriter } from '@/lib/hooks/useTypewriter'
import dynamic from 'next/dynamic'

const NeuralNetwork = dynamic(() => import('@/components/effects/NeuralNetwork'), { ssr: false })

const ROLES = [
  'Data Scientist',
  'ML Engineer',
  'AI/LLM Developer',
  'Research Engineer',
  'Data Engineer',
]

interface HeroProps { portfolio: Portfolio }

export default function DarkProHero({ portfolio }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const { displayText } = useTypewriter({ words: ROLES, typeSpeed: 80, deleteSpeed: 45, pauseTime: 2200 })

  const socials    = (portfolio.socials ?? []) as { platform: string; url: string }[]
  const linkedinUrl = socials.find(s => s.platform === 'LinkedIn')?.url ?? '#'
  const githubUrl   = socials.find(s => s.platform === 'GitHub')?.url   ?? '#'

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
  }
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16 px-6"
      style={{ background: '#0b0f1a' }}
    >
      {/* Signature 3D node graph */}
      <NeuralNetwork accent="#3b82f6" accent2="#06b6d4" />

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }}
      />

      {/* Noise grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Blue glow — top left */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)' }}
      />
      {/* Faint right glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)' }}
      />

      {/* Vertical accent bar — left edge */}
      <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #3b82f6, transparent)' }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-20">

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
                className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded border border-blue-500/20 bg-blue-500/5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                </span>
                <span className="text-xs text-blue-300/80 tracking-wide">Available for full-time roles</span>
              </motion.div>
            )}

            {/* Name */}
            <motion.h1 variants={item}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 leading-none tracking-tight">
              Phaneendra{' '}
              <span className="text-blue-400">Gavara</span>
            </motion.h1>

            {/* Social icons */}
            <motion.div variants={item} className="flex items-center gap-2.5 mb-5">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="flex items-center justify-center w-8 h-8 rounded border border-white/10 text-white/40 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 transition-all duration-200">
                <Linkedin size={14} />
              </a>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="flex items-center justify-center w-8 h-8 rounded border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/8 transition-all duration-200">
                <Github size={14} />
              </a>
            </motion.div>

            {/* Typewriter */}
            <motion.div variants={item} className="flex items-center gap-2 mb-5 h-8">
              <span className="text-white/40 text-sm">I&apos;m a</span>
              <span className="text-blue-300 font-semibold text-sm md:text-base">{displayText}</span>
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                className="text-blue-400 font-bold">|</motion.span>
            </motion.div>

            {/* Location + email */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 text-sm text-white/35">
              <span className="flex items-center gap-1.5"><MapPin size={13} /> Tempe, Arizona</span>
              <span className="w-1 h-1 rounded-full bg-white/15 hidden sm:block" />
              <a href="mailto:phaneendra.gavara@gmail.com"
                className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                <Mail size={13} /> phaneendra.gavara@gmail.com
              </a>
            </motion.div>

            {/* Tagline */}
            <motion.p variants={item} className="text-white/50 max-w-xl leading-relaxed mb-8 text-sm md:text-base">
              {portfolio.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
              <Link href="/projects"
                className="group flex items-center gap-2 px-6 py-2.5 text-white text-sm font-medium rounded transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 4px 20px rgba(59,130,246,0.25)' }}>
                View Projects <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <ResumeDropdown
                label="Download CV"
                triggerCls="flex items-center gap-2 px-6 py-2.5 text-white/65 text-sm font-medium border border-white/10 hover:border-blue-500/40 hover:text-blue-300 hover:bg-blue-500/5 rounded transition-all"
                menuCls="border border-white/10 bg-[#0a0f1e] rounded py-1 shadow-xl"
                itemCls="block px-4 py-2.5 text-sm text-white/60 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
              />
            </motion.div>

            {/* GPA inline */}
            <motion.div variants={item}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-white/8 text-sm"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="font-bold text-white">3.90<span className="text-blue-400 text-xs">/4.0</span></span>
              <span className="w-px h-3 bg-white/15" />
              <span className="text-white/35 text-xs tracking-wide">GPA @ ASU</span>
            </motion.div>
          </motion.div>

          {/* Right panel — stats (desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="hidden lg:flex flex-col gap-4 w-60 flex-shrink-0"
          >
            <div className="w-8 h-0.5 mb-2" style={{ background: 'linear-gradient(90deg, #3b82f6, transparent)' }} />
            {[
              { val: '3.90/4.0', label: 'GPA @ ASU' },
              { val: '6+ Projects', label: 'Production-ready builds' },
              { val: '4 Courses', label: 'Teaching Assisted' },
            ].map(({ val, label }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.1 }}
                className="p-4 rounded border border-white/6 hover:border-blue-500/20 transition-colors"
                style={{ background: 'rgba(255,255,255,0.025)' }}>
                <div className="text-lg font-bold text-white mb-0.5">{val}</div>
                <div className="text-xs text-white/35">{label}</div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Scroll cue */}
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5">
          <motion.div className="w-1 h-1.5 rounded-full bg-blue-400"
            animate={{ y: [0, 8, 0], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  )
}
