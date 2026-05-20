'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Download, Swords, Linkedin, Github } from 'lucide-react'
import { Portfolio } from '@/types'
import { useTypewriter } from '@/lib/hooks/useTypewriter'

const ROLES = [
  'Data Scientist',
  'ML Engineer',
  'AI/LLM Developer',
  'Research Engineer',
  'Full-Stack Builder',
]

// Floating sparkle positions
const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 61 + 13) % 96}%`,
  top: `${(i * 47 + 19) % 90}%`,
  size: i % 3 === 0 ? 6 : 4,
  duration: 2 + (i % 4),
  delay: (i % 6) * 0.4,
}))

interface HeroProps { portfolio: Portfolio }

export default function AnimeHero({ portfolio }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const { displayText } = useTypewriter({ words: ROLES, typeSpeed: 75, deleteSpeed: 40, pauseTime: 2000 })

  const socials    = (portfolio.socials ?? []) as { platform: string; url: string }[]
  const linkedinUrl = socials.find(s => s.platform === 'LinkedIn')?.url ?? '#'
  const githubUrl   = socials.find(s => s.platform === 'GitHub')?.url   ?? '#'

  return (
    <section ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 px-4"
      style={{ background: 'linear-gradient(160deg, #0f0722 0%, #1a0a35 40%, #0d1528 100%)' }}>

      {/* Gradient background shapes */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 60%)' }}
      />
      <motion.div
        animate={{ scale: [1, 0.9, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute -bottom-10 -right-10 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,110,180,0.18) 0%, transparent 60%)' }}
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/2 right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 60%)' }}
      />

      {/* Sparkles */}
      {SPARKLES.map(s => (
        <motion.div key={s.id}
          className="absolute pointer-events-none text-pink-400"
          style={{ left: s.left, top: s.top, fontSize: s.size }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: [0, 180, 360] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}>
          ✦
        </motion.div>
      ))}

      {/* HUD corner brackets */}
      {[
        'top-20 left-4',
        'top-20 right-4',
        'bottom-8 left-4',
        'bottom-8 right-4',
      ].map((pos, i) => (
        <div key={i} className={`absolute w-6 h-6 pointer-events-none hidden lg:block ${pos}`}
          style={{
            borderTop: i < 2 ? '2px solid rgba(255,110,180,0.3)' : undefined,
            borderBottom: i >= 2 ? '2px solid rgba(255,110,180,0.3)' : undefined,
            borderLeft: i % 2 === 0 ? '2px solid rgba(255,110,180,0.3)' : undefined,
            borderRight: i % 2 !== 0 ? '2px solid rgba(255,110,180,0.3)' : undefined,
          }}
        />
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Status badge — gaming style */}
        {portfolio.openToWork && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border text-xs font-bold tracking-wider"
            style={{
              fontFamily: 'Nunito, sans-serif',
              borderColor: 'rgba(255,110,180,0.4)',
              background: 'rgba(255,110,180,0.08)',
              color: '#ff6eb4',
            }}>
            <motion.span className="text-base" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>⚔</motion.span>
            OPEN TO WORK — LFG!
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black mb-3 leading-tight"
          style={{ fontFamily: 'Nunito, sans-serif' }}>
          <span className="text-white">Phaneendra </span>
          <span style={{
            background: 'linear-gradient(135deg, #ff6eb4, #a855f7, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(255,110,180,0.4))',
          }}>Gavara</span>
        </motion.h1>

        {/* Social icons */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-3 mb-6">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-pink-500/30 text-pink-400/70 hover:text-[#0A66C2] hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/10 transition-all">
            <Linkedin size={15} />
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-pink-500/30 text-pink-400/70 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all">
            <Github size={15} />
          </a>
        </motion.div>

        {/* Typewriter — gaming style */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6 h-8">
          <span className="text-pink-400/60 text-sm font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>CLASS:</span>
          <span className="font-extrabold text-sm md:text-base"
            style={{ fontFamily: 'Nunito, sans-serif', color: '#ff6eb4', textShadow: '0 0 12px rgba(255,110,180,0.5)' }}>
            {displayText}
          </span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }}
            className="text-pink-400 font-bold text-lg">▌</motion.span>
        </motion.div>

        {/* Bio */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="max-w-xl mx-auto mb-6 text-sm md:text-base leading-relaxed"
          style={{ fontFamily: 'Nunito, sans-serif', color: 'rgba(255,255,255,0.5)' }}>
          {portfolio.tagline}
        </motion.p>

        {/* Stats — RPG bars */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="flex flex-col items-center gap-2 mb-8 max-w-xs mx-auto">
          {[
            { label: 'GPA', val: 97.5, display: '3.9/4.0', color: '#a855f7' },
            { label: 'PROJECTS', val: 75, display: '6+ Built', color: '#ff6eb4' },
          ].map(({ label, val, display, color }) => (
            <div key={label} className="w-full flex items-center gap-3">
              <span className="text-[10px] w-16 text-left font-bold tracking-widest"
                style={{ fontFamily: 'Nunito, sans-serif', color: `${color}99` }}>{label}</span>
              <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${val}%` }}
                  transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color}, ${color}99)`, boxShadow: `0 0 8px ${color}60` }}
                />
              </div>
              <span className="text-[10px] w-14 text-right font-bold"
                style={{ fontFamily: 'Nunito, sans-serif', color }}>{display}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/projects"
            className="group flex items-center gap-2 px-7 py-3 font-black text-sm rounded-full text-white transition-all hover:scale-105"
            style={{
              fontFamily: 'Nunito, sans-serif',
              background: 'linear-gradient(135deg, #a855f7, #ff6eb4)',
              boxShadow: '0 6px 24px rgba(168,85,247,0.4)',
            }}>
            <Swords size={15} /> View Projects
          </Link>
          <a href={portfolio.resumeUrl} download
            className="flex items-center gap-2 px-7 py-3 font-bold text-sm rounded-full border-2 border-pink-500/40 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400 transition-all"
            style={{ fontFamily: 'Nunito, sans-serif' }}>
            <Download size={15} /> Download CV
          </a>
        </motion.div>

        {/* Scroll cue */}
        <motion.div className="mt-12 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 rounded-full border-2 border-pink-500/20 flex items-start justify-center pt-1.5">
            <motion.div className="w-1.5 h-2 rounded-full bg-pink-400"
              animate={{ y: [0, 10, 0], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
