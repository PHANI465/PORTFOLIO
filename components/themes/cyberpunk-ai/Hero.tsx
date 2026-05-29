'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Terminal, ChevronRight, Linkedin, Github } from 'lucide-react'
import ResumeDropdown from '@/components/shared/ResumeDropdown'
import { Portfolio } from '@/types'
import { useTypewriter } from '@/lib/hooks/useTypewriter'

interface HeroProps { portfolio: Portfolio }

const ROLES = [
  'Data Scientist',
  'ML Engineer',
  'AI Developer',
  'Full-Stack Dev',
  'Research Engineer',
]

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: ((i * 37 + 11) % 97) + '%',
  top: ((i * 53 + 7) % 93) + '%',
  opacity: 0.2 + (i % 5) * 0.1,
  duration: 3 + (i % 4),
  delay: (i % 6) * 0.5,
  size: i % 3 === 0 ? 2 : 1,
}))

export default function CyberpunkHero({ portfolio }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -80])
  const fadeOut = useTransform(scrollY, [0, 400], [1, 0])
  const { displayText } = useTypewriter({ words: ROLES, typeSpeed: 75, deleteSpeed: 40, pauseTime: 2200 })

  const socials = (portfolio.socials ?? []) as { platform: string; url: string }[]
  const linkedinUrl = socials.find(s => s.platform === 'LinkedIn')?.url ?? '#'
  const githubUrl = socials.find(s => s.platform === 'GitHub')?.url ?? '#'

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.12]" style={{
        backgroundImage: 'linear-gradient(rgba(0,255,245,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,245,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Scan line */}
      <motion.div className="absolute left-0 right-0 h-[2px] pointer-events-none opacity-15"
        style={{ background: 'linear-gradient(90deg, transparent, #00fff5, transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Particles */}
      {PARTICLES.map(p => (
        <motion.div key={p.id} className="absolute rounded-full bg-[#00fff5]"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ y: [0, -30, 0], opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
      {[0,1,2,3,4].map(i => (
        <motion.div key={'pink-' + i} className="absolute rounded-full bg-[#ff0090]"
          style={{ left: (15 + i * 18) + '%', top: (20 + (i % 3) * 25) + '%', width: 1, height: 1 }}
          animate={{ y: [0,-20,0], x: [0,10,0], opacity: [0.1,0.4,0.1] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div className="w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,245,0.06) 0%, transparent 65%)' }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Binary corner decorations */}
      <div className="absolute top-24 left-6 text-[#00fff5]/10 text-xs font-mono leading-tight select-none hidden lg:block">
        {['01001110','10110101','01101001'].map((b,i) => <div key={i}>{b}</div>)}
      </div>
      <div className="absolute bottom-24 right-6 text-[#ff0090]/10 text-xs font-mono leading-tight select-none hidden lg:block">
        {['10110010','01001101','11001010'].map((b,i) => <div key={i}>{b}</div>)}
      </div>

      <motion.div style={{ y, opacity: fadeOut }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">

        {/* Status badge */}
        {portfolio.openToWork && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-[#00fff5]/40 text-[#00fff5] text-xs tracking-widest"
            style={{ fontFamily: 'Orbitron, monospace', background: 'rgba(0,255,245,0.05)' }}>
            <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
            SYSTEM STATUS: AVAILABLE FOR HIRE
          </motion.div>
        )}

        {/* Name */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight"
          style={{
            fontFamily: 'Orbitron, monospace',
            background: 'linear-gradient(135deg, #00fff5 0%, #ff0090 50%, #7b2fff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(0,255,245,0.3))',
          }}>
          PHANEENDRA GAVARA
        </motion.h1>

        {/* Social icons */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="flex items-center justify-center gap-3 mb-6">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="flex items-center justify-center w-9 h-9 border border-[#0A66C2]/40 text-[#0A66C2]/70 hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all duration-200">
            <Linkedin size={15} />
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            className="flex items-center justify-center w-9 h-9 border border-[#00fff5]/30 text-[#00fff5]/50 hover:text-[#00fff5] hover:border-[#00fff5] hover:bg-[#00fff5]/10 transition-all duration-200">
            <Github size={15} />
          </a>
        </motion.div>

        {/* Typewriter role */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-2 h-8">
          <Terminal size={14} className="text-[#00fff5] flex-shrink-0" />
          <span className="text-[#00fff5] text-sm md:text-base tracking-[0.15em]"
            style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 10px #00fff5' }}>
            {displayText}
          </span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
            className="text-[#ff0090] font-bold" style={{ fontFamily: 'monospace' }}>_</motion.span>
        </motion.div>

        {/* Gradient divider */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.6 }}
          className="w-48 h-px mx-auto mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, #00fff5, #ff0090, transparent)' }}
        />

        {/* Bio */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="text-[#00fff5]/50 max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed"
          style={{ fontFamily: 'monospace' }}>
          {'>'} {portfolio.tagline}
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="flex items-center justify-center gap-8 md:gap-12 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#00fff5]"
              style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 15px rgba(0,255,245,0.5)' }}>
              3.9<span className="text-[#ff0090] text-sm">/4.0</span>
            </div>
            <div className="text-[10px] text-[#00fff5]/40 tracking-widest mt-0.5"
              style={{ fontFamily: 'Orbitron, monospace' }}>GPA</div>
          </div>
        </motion.div>

        {/* HUD sys-stats bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}
          className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-6 md:gap-10 px-6 py-3 border border-[#00fff5]/15"
            style={{ background: 'rgba(0,255,245,0.03)', fontFamily: 'Orbitron, monospace' }}>
            {[
              { label: 'STATUS', val: 'ONLINE', color: '#00ff41' },
              { label: 'CLEARANCE', val: 'OPEN', color: '#00fff5' },
              { label: 'LOCATION', val: 'TEMPE.AZ', color: '#ff0090' },
            ].map(({ label, val, color }, i) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] tracking-widest" style={{ color: color + '55' }}>{label}</span>
                <motion.span
                  className="text-[11px] font-bold tracking-wider"
                  style={{ color, textShadow: '0 0 8px ' + color + '80' }}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
                  {val}
                </motion.span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/projects"
            className="group flex items-center gap-2 px-8 py-3 text-sm tracking-widest font-bold border border-[#00fff5] text-[#00fff5] hover:bg-[#00fff5] hover:text-black transition-all duration-300"
            style={{ fontFamily: 'Orbitron, monospace' }}>
            VIEW PROJECTS <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <ResumeDropdown
            label="RESUME"
            triggerCls="group flex items-center gap-2 px-8 py-3 text-sm tracking-widest font-bold border border-[#ff0090]/60 text-[#ff0090] hover:bg-[#ff0090] hover:text-white transition-all duration-300"
            triggerStyle={{ fontFamily: 'Orbitron, monospace' }}
            menuCls="border border-[#ff0090]/30 bg-[#050510] py-1"
            itemCls="block px-4 py-2.5 text-xs tracking-widest text-[#ff0090]/70 hover:text-[#ff0090] hover:bg-[#ff0090]/10 transition-colors"
          />
        </motion.div>

        {/* Scroll cue */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div className="w-px h-10 bg-gradient-to-b from-[#00fff5] to-transparent" />
          <div className="text-[#00fff5]/30 text-[9px] tracking-widest" style={{ fontFamily: 'Orbitron, monospace' }}>SCROLL</div>
        </motion.div>
      </motion.div>
    </section>
  )
}
