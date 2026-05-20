'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { Download, ArrowRight, Sparkles, Linkedin, Github, Search } from 'lucide-react'
import { Portfolio } from '@/types'
import { useTypewriter } from '@/lib/hooks/useTypewriter'
import MagneticButton from '@/components/effects/MagneticButton'

interface HeroProps { portfolio: Portfolio }

const ROLES = [
  'Data Scientist',
  'ML Engineer',
  'AI/LLM Developer',
  'Full-Stack Builder',
  'Research Engineer',
]

function openSearch() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
}

export default function GlassHero({ portfolio }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const y       = useTransform(scrollY, [0, 500], [0, -60])
  const fadeOut = useTransform(scrollY, [0, 400], [1, 0])
  const blob1Y  = useTransform(scrollY, [0, 600], [0, 80])
  const blob2Y  = useTransform(scrollY, [0, 600], [0, -80])
  const blobScale = useTransform(scrollY, [0, 600], [1, 1.15])

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 40, damping: 20 })
  const my = useSpring(rawY, { stiffness: 40, damping: 20 })
  const b1x  = useTransform(mx, [-1, 1], [-30, 30])
  const b1my = useTransform(my, [-1, 1], [-15, 15])
  const b2x  = useTransform(mx, [-1, 1], [20, -20])
  const b2my = useTransform(my, [-1, 1], [10, -10])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    rawX.set(((clientX - left) / width) * 2 - 1)
    rawY.set(((clientY - top) / height) * 2 - 1)
  }

  const { displayText } = useTypewriter({ words: ROLES, typeSpeed: 80, deleteSpeed: 45, pauseTime: 2000 })

  const socials    = (portfolio.socials ?? []) as { platform: string; url: string }[]
  const linkedinUrl = socials.find(s => s.platform === 'LinkedIn')?.url ?? '#'
  const githubUrl   = socials.find(s => s.platform === 'GitHub')?.url   ?? '#'

  const nameParts = portfolio.name.split(' ')
  const firstName = nameParts[0]
  const lastName  = nameParts.slice(1).join(' ')

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 px-4"
    >
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Aurora sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="absolute"
          style={{
            top: '50%', left: '50%',
            width: '200%', height: '200%',
            transform: 'translate(-50%, -50%)',
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(139,92,246,0.04) 20%, rgba(59,130,246,0.04) 40%, rgba(20,184,166,0.03) 60%, rgba(168,85,247,0.03) 80%, transparent 100%)',
          }}
        />
      </div>

      {/* Floating decorative glass panels */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 1, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-32 right-16 w-24 h-24 rounded-2xl border border-white/8"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.04))', backdropFilter: 'blur(12px)' }}
        />
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -1.5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-40 left-12 w-16 h-16 rounded-xl border border-white/8"
          style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(59,130,246,0.04))', backdropFilter: 'blur(10px)' }}
        />
        <motion.div
          animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute top-1/2 right-8 w-12 h-36 rounded-2xl border border-white/6"
          style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.06), rgba(20,184,166,0.03))', backdropFilter: 'blur(8px)' }}
        />
      </div>

      {/* Animated blobs with mouse parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            y: blob1Y, x: b1x, translateY: b1my, scale: blobScale,
            background: 'radial-gradient(circle, #8b5cf6, transparent 70%)',
          }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            y: blob2Y, x: b2x, translateY: b2my,
            background: 'radial-gradient(circle, #3b82f6, transparent 70%)',
          }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #14b8a6, transparent 70%)', transform: 'translate(-50%,-50%)' }}
        />
      </div>

      <motion.div style={{ y, opacity: fadeOut }} className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Availability badge */}
        {portfolio.openToWork && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/10 text-white/70 text-sm"
            style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {portfolio.availability}
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold text-white mb-3 leading-tight"
        >
          {firstName}{' '}
          <span
            className="shimmer-text font-bold"
            style={{ backgroundImage: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 25%, #14b8a6 50%, #3b82f6 75%, #8b5cf6 100%)' }}
          >
            {lastName}
          </span>
        </motion.h1>

        {/* Social icon links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <a
            href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white/55 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 transition-all duration-200"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white/55 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all duration-200"
          >
            <Github size={16} />
          </a>
        </motion.div>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-5 h-8"
        >
          <span className="text-purple-300 text-sm">I&apos;m a</span>
          <span className="text-white font-semibold text-sm md:text-base">{displayText}</span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
            className="text-purple-400 font-bold">|</motion.span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-white/60 max-w-xl mx-auto mb-5 text-sm md:text-base leading-relaxed text-pretty"
        >
          {portfolio.tagline}
        </motion.p>

        {/* GPA compact chip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 text-sm"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}
        >
          <span className="font-bold text-white">3.90<span className="text-purple-400 text-xs">/4.0</span></span>
          <span className="w-px h-3 bg-white/20" />
          <span className="text-white/45 text-xs tracking-wide">GPA @ ASU</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <MagneticButton
            href="/projects"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm transition-all duration-300 hover:opacity-95 glow-primary"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
          >
            View Projects
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </MagneticButton>

          <MagneticButton
            href={portfolio.resumeUrl}
            download
            className="group flex items-center gap-2 px-6 py-3 rounded-xl text-white/85 font-medium text-sm border border-white/10 hover:bg-white/10 hover:text-white transition-all"
          >
            <Download size={16} /> Download CV
          </MagneticButton>
        </motion.div>

        {/* Search hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="mt-6 flex items-center justify-center"
        >
          <button
            onClick={openSearch}
            aria-label="Open search"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/30 hover:text-white/60 hover:border-white/25 hover:bg-white/5 transition-all text-[11px]"
          >
            <Search size={11} />
            <span>Search</span>
          </button>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
            <motion.div
              className="w-1 h-2 rounded-full bg-white/40"
              animate={{ y: [0, 10, 0], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}
