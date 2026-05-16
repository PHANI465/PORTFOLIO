'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Download, ArrowRight, Sparkles, FileText } from 'lucide-react'
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

function AnimatedStat({ value, label, suffix = '' }: { value: number | string, label: string, suffix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isNum = typeof value === 'number'

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started || !isNum) return
    let n = 0
    const step = (value as number) / 40
    const t = setInterval(() => {
      n += step
      if (n >= (value as number)) { setCount(value as number); clearInterval(t) }
      else setCount(Math.floor(n * 10) / 10)
    }, 30)
    return () => clearInterval(t)
  }, [started, value, isNum])

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-white">
        {isNum ? (Number.isInteger(value) ? count : count.toFixed(1)) : value}
        <span className="text-purple-400 text-lg">{suffix}</span>
      </div>
      <div className="text-xs text-white/40 mt-0.5">{label}</div>
    </div>
  )
}

export default function GlassHero({ portfolio }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -60])
  const fadeOut = useTransform(scrollY, [0, 400], [1, 0])
  // Scroll-linked blob parallax
  const blob1Y = useTransform(scrollY, [0, 600], [0, 80])
  const blob2Y = useTransform(scrollY, [0, 600], [0, -80])
  const blobScale = useTransform(scrollY, [0, 600], [1, 1.15])
  const { displayText } = useTypewriter({ words: ROLES, typeSpeed: 80, deleteSpeed: 45, pauseTime: 2000 })

  const [first, ...rest] = portfolio.name.split(' ')
  const last = rest.join(' ')

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 px-4">

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ y: blob1Y, scale: blobScale, background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{ y: blob2Y, background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
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

        {/* Badge */}
        {portfolio.openToWork && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/10 text-white/70 text-sm"
            style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles size={14} className="text-purple-400" />
            </motion.span>
            {portfolio.availability}
          </motion.div>
        )}

        {/* Name with shimmer */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
          {first}
          <br />
          <span
            className="shimmer-text font-bold"
            style={{
              backgroundImage: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 25%, #14b8a6 50%, #3b82f6 75%, #8b5cf6 100%)',
            }}
          >
            {last}
          </span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6 h-8">
          <span className="text-purple-300 text-sm">I&apos;m a</span>
          <span className="text-white font-semibold text-sm md:text-base">{displayText}</span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
            className="text-purple-400 font-bold">|</motion.span>
        </motion.div>

        {/* Bio */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-white/60 max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed text-pretty">
          {portfolio.tagline}
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="flex items-center justify-center gap-8 md:gap-16 mb-10 py-5 rounded-2xl border border-white/5"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}>
          <AnimatedStat value={3.9} label="GPA @ ASU" suffix="/4.0" />
          <div className="w-px h-10 bg-white/10" />
          <AnimatedStat value={6} label="Projects" suffix="+" />
          <div className="w-px h-10 bg-white/10" />
          <AnimatedStat value="3rd" label="Hackathon Place" />
        </motion.div>

        {/* CTAs — magnetic */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center">
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

          <MagneticButton
            href="/one-page"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl text-white/65 font-medium text-sm border border-white/10 hover:bg-white/10 hover:text-white transition-all"
          >
            <FileText size={16} /> One Page
          </MagneticButton>
        </motion.div>

        {/* ⌘K hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="mt-6 text-[11px] text-white/35 flex items-center justify-center gap-1.5"
        >
          Press
          <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 text-white/60">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 text-white/60">K</kbd>
          to search anything
        </motion.div>

        {/* Scroll cue */}
        <motion.div className="mt-12 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
            <motion.div className="w-1 h-2 rounded-full bg-white/40"
              animate={{ y: [0, 10, 0], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
