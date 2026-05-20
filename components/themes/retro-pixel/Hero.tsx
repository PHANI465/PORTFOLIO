'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Portfolio } from '@/types'

const ROLES = [
  'Data Scientist',
  'ML Engineer',
  'AI Developer',
  'Full-Stack Builder',
]

interface HeroProps { portfolio: Portfolio }

// Pixel border helper (box-shadow approach for pixel-perfect corners)
const pixelBorder = '4px solid #ffcc00'

export default function RetroHero({ portfolio }: HeroProps) {
  const [displayText, setDisplayText] = useState('')
  const [roleIdx, setRoleIdx] = useState(0)
  const [cursor, setCursor] = useState(true)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  const socials    = (portfolio.socials ?? []) as { platform: string; url: string }[]
  const linkedinUrl = socials.find(s => s.platform === 'LinkedIn')?.url ?? '#'
  const githubUrl   = socials.find(s => s.platform === 'GitHub')?.url   ?? '#'

  // Typewriter
  useEffect(() => {
    const role = ROLES[roleIdx]
    let timeout: ReturnType<typeof setTimeout>
    if (phase === 'typing') {
      if (displayText.length < role.length) {
        timeout = setTimeout(() => setDisplayText(role.slice(0, displayText.length + 1)), 100)
      } else {
        timeout = setTimeout(() => setPhase('pausing'), 1800)
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 400)
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(d => d.slice(0, -1)), 55)
      } else {
        setRoleIdx(i => (i + 1) % ROLES.length)
        setPhase('typing')
      }
    }
    return () => clearTimeout(timeout)
  }, [displayText, phase, roleIdx])

  useEffect(() => {
    const i = setInterval(() => setCursor(c => !c), 500)
    return () => clearInterval(i)
  }, [])

  // Scanlines
  const scanlineStyle: React.CSSProperties = {
    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 4px)',
    pointerEvents: 'none',
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 px-4"
      style={{ background: '#1a1a2e', fontFamily: '"Press Start 2P", monospace' }}
    >
      {/* Scanlines overlay */}
      <div className="absolute inset-0" style={scanlineStyle} />

      {/* CRT vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Pixel grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#ffcc00 1px, transparent 1px), linear-gradient(90deg, #ffcc00 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Floating pixel blocks */}
      {[
        { top: '15%', left: '8%', w: 12, h: 12, color: '#ffcc00', dur: 6 },
        { top: '25%', right: '10%', w: 8,  h: 8,  color: '#00ff88', dur: 8 },
        { top: '65%', left: '5%',  w: 6,  h: 6,  color: '#ff6eb4', dur: 5 },
        { top: '70%', right: '7%', w: 10, h: 10, color: '#38bdf8', dur: 7 },
        { top: '40%', right: '4%', w: 4,  h: 20, color: '#ffcc00', dur: 9 },
      ].map((b, i) => (
        <motion.div key={i}
          className="absolute pointer-events-none hidden lg:block"
          style={{ top: b.top, left: 'left' in b ? b.left : undefined, right: 'right' in b ? b.right : undefined,
            width: b.w, height: b.h, background: b.color }}
          animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        {/* INSERT COIN style */}
        {portfolio.openToWork && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="mb-8 text-[10px] tracking-widest text-[#ffcc00]">
            *** INSERT COIN TO HIRE ***
          </motion.div>
        )}

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-6">
          <div className="text-[10px] md:text-xs text-[#00ff88] mb-2 tracking-widest">PLAYER 1</div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#ffcc00] leading-tight"
            style={{ textShadow: '4px 4px 0 #ff6600, 0 0 20px rgba(255,204,0,0.3)' }}>
            PHANEENDRA<br />GAVARA
          </h1>
        </motion.div>

        {/* Social icons — pixelated */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-4 mb-6">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="flex items-center justify-center w-10 h-10 text-[#00ff88] hover:text-[#0A66C2] transition-colors text-xs font-bold"
            style={{ border: '2px solid #00ff88', imageRendering: 'pixelated' }}>
            IN
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            className="flex items-center justify-center w-10 h-10 text-[#00ff88] hover:text-white transition-colors text-xs font-bold"
            style={{ border: '2px solid #00ff88' }}>
            GH
          </a>
        </motion.div>

        {/* Typewriter role */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mb-6 text-[8px] md:text-[10px] tracking-wider text-[#38bdf8]">
          CLASS: {displayText}<span className={cursor ? 'opacity-100' : 'opacity-0'}>█</span>
        </motion.div>

        {/* Tagline — word-wrapped pixel text */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="text-[7px] md:text-[9px] text-[#ffcc00]/60 max-w-sm mx-auto leading-loose mb-8 tracking-wide">
          {portfolio.tagline}
        </motion.p>

        {/* Stats — 8-bit style */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
          className="flex justify-center gap-6 mb-8">
          {[
            { label: 'GPA', val: '3.9' },
            { label: 'XP', val: '6+' },
          ].map(({ label, val }) => (
            <div key={label} className="text-center">
              <div className="text-base text-[#ffcc00]" style={{ textShadow: '2px 2px 0 #ff6600' }}>{val}</div>
              <div className="text-[7px] text-[#ffcc00]/50 tracking-widest mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTAs — pixel buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link href="/projects"
            className="text-[9px] tracking-widest text-black px-6 py-3 font-bold transition-all hover:opacity-80 active:translate-y-0.5"
            style={{ background: '#ffcc00', border: '3px solid #ff6600', boxShadow: '4px 4px 0 #ff6600' }}>
            ▶ VIEW WORK
          </Link>
          <a href={portfolio.resumeUrl} download
            className="text-[9px] tracking-widest text-[#00ff88] px-6 py-3 font-bold transition-all hover:opacity-80 active:translate-y-0.5"
            style={{ border: '3px solid #00ff88', boxShadow: '4px 4px 0 #007744' }}>
            ↓ RESUME
          </a>
        </motion.div>

        {/* Blinking scroll cue */}
        <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
          className="text-[7px] tracking-widest text-[#ffcc00]/40">
          ▼ SCROLL ▼
        </motion.div>
      </motion.div>
    </section>
  )
}
