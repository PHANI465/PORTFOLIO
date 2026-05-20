'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Download, ChevronRight, Linkedin, Github } from 'lucide-react'
import { Portfolio } from '@/types'
import { useTypewriter } from '@/lib/hooks/useTypewriter'

const ROLES = [
  'Data Scientist',
  'ML Engineer',
  'AI/LLM Developer',
  'Research Engineer',
  'Full-Stack Builder',
]

// Deterministic star field
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  left: `${(i * 53 + 17) % 100}%`,
  top: `${(i * 37 + 7) % 100}%`,
  size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
  opacity: 0.2 + (i % 7) * 0.1,
  duration: 3 + (i % 5),
  delay: (i % 8) * 0.4,
}))

interface HeroProps { portfolio: Portfolio }

export default function SpaceHero({ portfolio }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const { displayText } = useTypewriter({ words: ROLES, typeSpeed: 80, deleteSpeed: 45, pauseTime: 2200 })

  const socials    = (portfolio.socials ?? []) as { platform: string; url: string }[]
  const linkedinUrl = socials.find(s => s.platform === 'LinkedIn')?.url ?? '#'
  const githubUrl   = socials.find(s => s.platform === 'GitHub')?.url   ?? '#'

  return (
    <section ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 px-4"
      style={{ background: 'linear-gradient(160deg, #030712 0%, #0f0728 40%, #050d1f 70%, #020a18 100%)' }}>

      {/* Stars */}
      {STARS.map(s => (
        <motion.div key={s.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, opacity: s.opacity }}
          animate={{ opacity: [s.opacity * 0.4, s.opacity, s.opacity * 0.4] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Nebula — purple */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], rotate: [0, 3, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.08) 40%, transparent 65%)' }}
      />
      {/* Nebula — teal */}
      <motion.div
        animate={{ scale: [1, 0.94, 1], rotate: [0, -2, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.12) 0%, transparent 65%)' }}
      />

      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
        <div className="absolute w-[500px] h-[500px] rounded-full border border-indigo-400"
          style={{ transform: 'rotateX(70deg)' }} />
        <div className="absolute w-[700px] h-[700px] rounded-full border border-indigo-400"
          style={{ transform: 'rotateX(70deg)' }} />
      </div>

      {/* Scan line sweep */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner HUD brackets */}
      {[
        'top-20 left-6 border-t border-l',
        'top-20 right-6 border-t border-r',
        'bottom-8 left-6 border-b border-l',
        'bottom-8 right-6 border-b border-r',
      ].map((cls, i) => (
        <div key={i} className={`absolute w-8 h-8 border-indigo-400/20 pointer-events-none hidden lg:block ${cls}`} />
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Status badge */}
        {portfolio.openToWork && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-indigo-400/25 text-indigo-300 text-xs tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', background: 'rgba(99,102,241,0.08)', letterSpacing: '0.1em' }}>
            <motion.span className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            MISSION STATUS: SEEKING CREW
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-wide"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 30%, #818cf8 60%, #c4b5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.4))',
          }}>
          PHANEENDRA GAVARA
        </motion.h1>

        {/* Social icons */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-3 mb-6">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="flex items-center justify-center w-9 h-9 border border-indigo-500/30 text-indigo-400/70 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 transition-all rounded-sm">
            <Linkedin size={15} />
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            className="flex items-center justify-center w-9 h-9 border border-indigo-500/30 text-indigo-400/70 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all rounded-sm">
            <Github size={15} />
          </a>
        </motion.div>

        {/* Typewriter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-3 h-8">
          <span className="text-indigo-400/60 text-sm tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>ROLE //</span>
          <span className="text-indigo-200 font-semibold text-sm md:text-base tracking-wider"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}>{displayText}</span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
            className="text-indigo-400 font-bold">_</motion.span>
        </motion.div>

        {/* Divider */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.75, duration: 0.6 }}
          className="w-32 h-px mx-auto mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #c4b5fd, transparent)' }}
        />

        {/* Bio */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="text-indigo-200/45 max-w-2xl mx-auto mb-6 text-sm md:text-base leading-relaxed"
          style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.03em' }}>
          {portfolio.tagline}
        </motion.p>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="flex items-center justify-center gap-8 mb-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-200"
              style={{ fontFamily: 'Rajdhani, sans-serif', textShadow: '0 0 15px rgba(99,102,241,0.5)' }}>
              3.9<span className="text-purple-400 text-sm">/4.0</span>
            </div>
            <div className="text-[10px] text-indigo-400/50 tracking-widest mt-0.5"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}>GPA</div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/projects"
            className="group flex items-center gap-2 px-8 py-3 text-sm font-semibold border border-indigo-500/60 text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400 transition-all rounded-sm tracking-wider"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            VIEW PROJECTS <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href={portfolio.resumeUrl} download
            className="flex items-center gap-2 px-8 py-3 text-sm font-semibold border border-purple-500/40 text-purple-300 hover:bg-purple-500/15 hover:border-purple-400 transition-all rounded-sm tracking-wider"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <Download size={16} /> RESUME
          </a>
        </motion.div>

        {/* Scroll cue */}
        <motion.div className="mt-16 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-px h-10 bg-gradient-to-b from-indigo-400 to-transparent" />
          <div className="text-[9px] text-indigo-400/40 tracking-[0.2em]"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}>SCROLL</div>
        </motion.div>
      </motion.div>
    </section>
  )
}
