'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, Mail, Linkedin, Github } from 'lucide-react'
import ResumeDropdown from '@/components/shared/ResumeDropdown'
import { Portfolio } from '@/types'
import { useTypewriter } from '@/lib/hooks/useTypewriter'

const ROLES = [
  'Data Scientist',
  'ML Engineer',
  'AI Developer',
  'Research Engineer',
  'Full-Stack Builder',
]

function Counter({ to, decimals = 0, delay = 0 }: { to: number, decimals?: number, delay?: number }) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const timeout = setTimeout(() => {
      let n = 0
      const steps = 50
      const increment = to / steps
      const t = setInterval(() => {
        n += increment
        if (n >= to) { setVal(to); clearInterval(t) }
        else setVal(parseFloat(n.toFixed(decimals)))
      }, 20)
      return () => clearInterval(t)
    }, delay)
    return () => clearTimeout(timeout)
  }, [started, to, decimals, delay])

  return <span ref={ref}>{val.toFixed(decimals)}</span>
}

export default function MinimalHero({ portfolio }: { portfolio: Portfolio }) {
  const socials     = (portfolio.socials ?? []) as { platform: string; url: string }[]
  const linkedinUrl = socials.find(s => s.platform === 'LinkedIn')?.url ?? '#'
  const githubUrl   = socials.find(s => s.platform === 'GitHub')?.url   ?? '#'
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const textY  = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const statsY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const { displayText } = useTypewriter({ words: ROLES, typeSpeed: 80, deleteSpeed: 45, pauseTime: 2200 })

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-white flex items-center pt-16 overflow-hidden">

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Accent gradient top */}
      <div className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6)' }}
      />

      {/* Subtle side gradient */}
      <div className="absolute top-0 right-0 w-[40%] h-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, #6366f1, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">

          {/* Left column */}
          <motion.div
            style={{ y: textY, opacity }}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1 max-w-2xl"
          >
            {/* Available chip */}
            {portfolio.openToWork && (
              <motion.div variants={itemVariants}
                className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs text-green-700 font-medium">Available for full-time roles</span>
              </motion.div>
            )}

            {/* Name */}
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-3 leading-none tracking-tight">
              Phaneendra{' '}
              <span className="text-indigo-600">Gavara</span>
            </motion.h1>

            {/* Social icons */}
            <motion.div variants={itemVariants} className="flex items-center gap-2.5 mb-5">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="flex items-center justify-center w-8 h-8 rounded-full border border-indigo-200 text-indigo-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-indigo-50 transition-all">
                <Linkedin size={14} />
              </a>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-400 hover:bg-slate-50 transition-all">
                <Github size={14} />
              </a>
            </motion.div>

            {/* Typewriter role */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-5 h-9">
              <span className="text-slate-400 text-lg font-light">I&apos;m a</span>
              <span className="text-xl font-semibold text-indigo-600">{displayText}</span>
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                className="text-indigo-400 font-bold text-xl">|</motion.span>
            </motion.div>

            {/* Location + email */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><MapPin size={13} /> Tempe, Arizona</span>
              <span className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block" />
              <a href="mailto:phaneendragavara436@gmail.com"
                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Mail size={13} /> phaneendragavara436@gmail.com
              </a>
            </motion.div>

            {/* Bio */}
            <motion.p variants={itemVariants} className="text-slate-600 max-w-xl leading-relaxed mb-8">
              {portfolio.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <Link href="/projects"
                className="group flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                View Projects
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <ResumeDropdown
                label="Download CV"
                triggerCls="flex items-center gap-2 px-6 py-2.5 rounded-lg text-slate-700 text-sm font-medium border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                menuCls="rounded-xl border border-slate-200 bg-white shadow-lg py-1"
                itemCls="block px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              />
            </motion.div>
          </motion.div>

          {/* Right column — stats (desktop only) */}
          <motion.div
            style={{ y: statsY, opacity }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0"
          >
            <div className="w-12 h-1 rounded-full mb-2" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />

            {[
              { num: 3.9, decimals: 1, suffix: '/4.0', label: 'GPA @ ASU', icon: '🎓' },
              { num: 4, decimals: 0, suffix: '', label: 'Courses Assisted', icon: '📚' },
              { num: 6, decimals: 0, suffix: '+', label: 'Projects Built', icon: '🚀' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }}
                className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="text-2xl font-bold text-slate-900">
                    <Counter to={s.num} decimals={s.decimals} delay={i * 150} />{s.suffix}
                  </div>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </motion.div>
            ))}

            <div className="mt-2 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <p className="text-xs text-indigo-600 leading-relaxed italic">
                &ldquo;Turning data into decisions, models into products.&rdquo;
              </p>
            </div>
          </motion.div>

        </div>

        {/* Mobile stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="grid grid-cols-2 gap-4 max-w-sm mt-10 lg:hidden">
          {[
            { num: 3.9, decimals: 1, suffix: '/4.0', label: 'GPA @ ASU' },
            { num: 4, decimals: 0, suffix: '', label: 'Courses Assisted' },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="text-2xl font-bold text-slate-900 mb-0.5">
                <Counter to={s.num} decimals={s.decimals} delay={i * 150} />{s.suffix}
              </div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-5 h-8 rounded-full border border-slate-200 flex items-start justify-center pt-1.5 mx-auto">
            <motion.div className="w-1 h-1.5 rounded-full bg-indigo-400"
              animate={{ y: [0, 8, 0], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <div className="text-[10px] text-slate-300 text-center mt-1 tracking-widest">SCROLL</div>
        </motion.div>
      </div>
    </section>
  )
}
