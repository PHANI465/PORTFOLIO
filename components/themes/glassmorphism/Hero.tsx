'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { ArrowRight, Linkedin, Github } from 'lucide-react'
import ResumeDropdown from '@/components/shared/ResumeDropdown'
import { Portfolio } from '@/types'
import { useTypewriter } from '@/lib/hooks/useTypewriter'
import MagneticButton from '@/components/effects/MagneticButton'
import CountUp from '@/components/effects/CountUp'

// Signature 3D element: code-split, client-only, self-gating on
// reduced-motion / low-power / touch (falls back to the blob gradient).
const NeuralNetwork = dynamic(() => import('@/components/effects/NeuralNetwork'), { ssr: false })

interface HeroProps { portfolio: Portfolio }

// Hero load sequence: 45ms stagger steps (Step 4 spec)
const STEP = 0.045
const enter = (step: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: step * STEP, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
})

const HERO_STATS = [
  { value: 10, suffix: '+', label: 'projects shipped' },
  { value: 230, suffix: 'K+', label: 'rows pipelined' },
  { value: 8, suffix: '×', label: 'query speedup' },
  { value: 5, suffix: '', label: 'certifications' },
]

const ROLES = [
  'Data Scientist',
  'ML Engineer',
  'AI/LLM Developer',
  'Data Engineer',
  'Research Engineer',
]

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

      {/* Signature element: 3D neural network node graph */}
      <NeuralNetwork accent="#8b5cf6" accent2="#14b8a6" />

      {/* Animated blobs with mouse parallax: ambient base + fallback when the network is gated */}
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

        {/* Availability badge: step 0 */}
        {portfolio.openToWork && (
          <motion.div
            {...enter(0)}
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

        {/* Name: step 1, the typographic moment */}
        <motion.h1
          {...enter(1)}
          className="font-display text-6xl md:text-7xl font-bold text-white mb-4"
        >
          {firstName}{' '}
          <span
            className="shimmer-text font-bold"
            style={{ backgroundImage: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 25%, #14b8a6 50%, #3b82f6 75%, #8b5cf6 100%)' }}
          >
            {lastName}
          </span>
        </motion.h1>

        {/* Typewriter role: step 2 */}
        <motion.div
          {...enter(2)}
          className="flex items-center justify-center gap-2 mb-5 h-8"
        >
          <span className="text-purple-300 text-sm tracking-[0.18em] uppercase">I&apos;m a</span>
          <span className="font-display text-white font-medium text-base md:text-lg tracking-wide">{displayText}</span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
            className="text-purple-400 font-bold">|</motion.span>
        </motion.div>

        {/* Tagline: step 3 */}
        <motion.p
          {...enter(3)}
          className="text-white/70 max-w-xl mx-auto mb-6 text-base md:text-lg leading-relaxed text-pretty"
        >
          {portfolio.tagline}
        </motion.p>

        {/* Social icon links: step 4 */}
        <motion.div
          {...enter(4)}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <a
            href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="icon-link flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white/55 hover:text-white"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            className="icon-link flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white/55 hover:text-white"
          >
            <Github size={16} />
          </a>
        </motion.div>

        {/* CTAs: step 5 */}
        <motion.div
          {...enter(5)}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <MagneticButton
            href="/projects"
            className="group btn-shine btn-press flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm glow-primary"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
          >
            View Projects
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-fast" />
          </MagneticButton>

          <ResumeDropdown
            label="Download CV"
            triggerCls="group flex items-center gap-2 px-6 py-3 rounded-xl text-white/85 font-medium text-sm border border-white/10 hover:bg-white/10 hover:text-white transition-all"
            menuCls="rounded-xl border border-white/10 bg-black/80 backdrop-blur-md py-1 shadow-2xl"
            itemCls="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          />
        </motion.div>

        {/* Proof-of-work stat strip: step 6 */}
        <motion.div
          {...enter(6)}
          className="mt-10 mx-auto max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/10"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          {HERO_STATS.map(({ value, suffix, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-0.5 px-4 py-4"
              style={{ background: 'rgba(11,7,23,0.72)', backdropFilter: 'blur(12px)' }}
            >
              <CountUp
                value={value}
                suffix={suffix}
                className="font-display text-2xl font-bold text-white tabular-nums"
              />
              <span className="text-[11px] tracking-wide text-white/65 font-mono">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll cue: step 7 */}
        <motion.div
          {...enter(7)}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border border-white/15 flex items-start justify-center pt-1.5"
          >
            <motion.div
              className="w-1 h-2 rounded-full bg-white/40"
              animate={{ y: [0, 10, 0], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  )
}
