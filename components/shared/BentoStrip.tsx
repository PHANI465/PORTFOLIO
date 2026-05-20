'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Sparkles, Code2, BookOpen, Github, ArrowUpRight } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import portfolioData from '@/content/portfolio.json'
import { Portfolio } from '@/types'

const portfolio = portfolioData as Portfolio

function useLocalTime(timezone = 'America/Phoenix') {
  const [now, setNow] = useState<string>('')
  useEffect(() => {
    const tick = () => {
      try {
        const d = new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' })
        setNow(d)
      } catch { setNow('') }
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [timezone])
  return now
}

const cardBase =
  'group relative overflow-hidden rounded-2xl border border-white/10 p-5 transition-all'
const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 30px -10px rgba(0,0,0,0.4)',
}

export default function BentoStrip() {
  const { theme } = useTheme()
  const time = useLocalTime()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const ghHandle = portfolio.socials.find(s => s.platform.toLowerCase() === 'github')?.url

  // Avoid SSR/CSR mismatch when localStorage swaps theme post-hydration.
  if (!mounted) return null
  // only render in dark glass-family variants — keeps light themes clean
  if (theme === 'minimal-professional' || theme === 'bright-neon' || theme === 'terminal-hacker') {
    return null
  }

  return (
    <section className="relative py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px]">
        {/* Now */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          whileHover={{ y: -3 }}
          className={`${cardBase} md:col-span-2`}
          style={cardStyle}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] tracking-widest text-emerald-300 uppercase">Now</span>
          </div>
          <h3 className="text-white text-lg font-semibold mb-1">Open to AI/LLM Engineering & ML roles</h3>
          <p className="text-white/55 text-sm leading-relaxed">
            Building LLM pipelines, RAG systems, and production ML applications. Available full-time. OPT authorized through Jun 2029.
          </p>
        </motion.div>

        {/* Location / Time */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
          whileHover={{ y: -3 }}
          className={cardBase}
          style={cardStyle}
        >
          <div className="flex items-center gap-2 mb-2 text-white/60">
            <MapPin size={14} /> <span className="text-[10px] tracking-widest uppercase">Based in</span>
          </div>
          <div className="text-white text-base font-semibold">Tempe, AZ</div>
          <div className="text-white/50 text-xs mt-1" suppressHydrationWarning>{time ? `${time} local` : 'America/Phoenix'}</div>
          <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-30 blur-2xl"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
        </motion.div>

        {/* Currently learning */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          whileHover={{ y: -3 }}
          className={cardBase}
          style={cardStyle}
        >
          <div className="flex items-center gap-2 mb-2 text-white/60">
            <BookOpen size={14} /> <span className="text-[10px] tracking-widest uppercase">Learning</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['LangGraph', 'vLLM', 'Triton', 'Modal', 'Ray'].map(t => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70">{t}</span>
            ))}
          </div>
        </motion.div>

        {/* Stack */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          whileHover={{ y: -3 }}
          className={`${cardBase} md:col-span-2`}
          style={cardStyle}
        >
          <div className="flex items-center gap-2 mb-2 text-white/60">
            <Code2 size={14} /> <span className="text-[10px] tracking-widest uppercase">Daily Stack</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              { name: 'Python', c: '#3776ab' },
              { name: 'PyTorch', c: '#ee4c2c' },
              { name: 'LangChain', c: '#1c3c3c' },
              { name: 'Next.js', c: '#ffffff' },
              { name: 'TypeScript', c: '#3178c6' },
              { name: 'Postgres', c: '#336791' },
              { name: 'AWS', c: '#ff9900' },
              { name: 'Docker', c: '#2496ed' },
            ].map(({ name, c }) => (
              <span
                key={name}
                className="text-[11px] px-2 py-1 rounded-md border text-white/85 flex items-center gap-1.5"
                style={{ background: `${c}14`, borderColor: `${c}40` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          whileHover={{ y: -3 }}
          className={cardBase}
          style={cardStyle}
        >
          <a href={ghHandle ?? '#'} target="_blank" rel="noopener noreferrer" className="block h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/60">
                <Github size={14} /> <span className="text-[10px] tracking-widest uppercase">GitHub</span>
              </div>
              <ArrowUpRight size={14} className="text-white/40 group-hover:text-white transition-colors" />
            </div>
            <div className="mt-2 text-white text-base font-semibold">See the code</div>
            <p className="text-white/55 text-xs mt-1 leading-relaxed">Open-source ML, RAG, and full-stack projects.</p>
          </a>
        </motion.div>

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
          whileHover={{ y: -3 }}
          className={cardBase}
          style={cardStyle}
        >
          <Link href="/projects" className="block h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/60">
                <Sparkles size={14} className="text-purple-300" /> <span className="text-[10px] tracking-widest uppercase">Featured</span>
              </div>
              <ArrowUpRight size={14} className="text-white/40" />
            </div>
            <div className="mt-2 text-white text-base font-semibold">Social Bias Hackathon</div>
            <p className="text-white/55 text-xs mt-1 leading-relaxed">Voice-based human vs. AI-call classifier built with ASU + Ethical Spectacle Research.</p>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
