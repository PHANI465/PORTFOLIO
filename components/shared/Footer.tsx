'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, FileText, Sparkles } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'

const socials = [
  { href: 'https://www.linkedin.com/in/phaneendra-gavara', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://github.com/PHANI465', icon: Github, label: 'GitHub' },
  { href: 'mailto:phaneendra.gavara@gmail.com', icon: Mail, label: 'Email' },
]

const CLOSER = 'Tempe, AZ · Open to remote · Building AI that ships.'

/* top border draws in on scroll-into-view — scaleX 0 → 1 */
function BorderDraw({ color }: { color: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 left-0 right-0 h-px origin-left"
      style={{ background: `linear-gradient(to right, ${color}60, ${color}10)` }}
    />
  )
}

export default function Footer() {
  const { theme } = useTheme()
  const year = new Date().getFullYear()
  const { accent } = getAccents(theme)

  const isCyberpunk = theme === 'cyberpunk-ai'
  const isTerminal  = theme === 'terminal-hacker'
  const isLight     = theme === 'minimal-professional' || theme === 'bright-neon'

  if (isTerminal) {
    return (
      <footer className="relative py-6 px-4"
        style={{ background: '#0d0d0d', fontFamily: 'Share Tech Mono, monospace' }}>
        <BorderDraw color={accent} />
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-[#00ff41]/60 block">$ echo &quot;{CLOSER}&quot;</span>
            <span className="text-xs text-[#00ff41]/40" suppressHydrationWarning>© {year} phaneendra_gavara · Next.js + AI</span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-5">
              {socials.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="icon-link text-xs text-[#00ff41]/50 hover:text-[#00ff41] flex items-center gap-1.5">
                  <Icon size={13} />{label}
                </a>
              ))}
            </div>
            <Link href="/build-your-own"
              className="text-[10px] text-[#00ff41]/25 hover:text-[#00ff41]/55 transition-colors flex items-center gap-1">
              <Sparkles size={10} /> Like this? Build your own portfolio →
            </Link>
          </div>
        </div>
      </footer>
    )
  }

  if (isLight) {
    return (
      <footer className="relative py-8 px-4 bg-white">
        <BorderDraw color={accent} />
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">Phaneendra Gavara</p>
            <p className="text-xs text-slate-500 mt-0.5">{CLOSER}</p>
            <p className="text-xs text-slate-400 mt-0.5" suppressHydrationWarning>© {year} · Built with Next.js</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {socials.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="icon-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 text-xs font-medium">
                  <Icon size={13} />{label}
                </a>
              ))}
              <a href="/resume/Phaneendra_G_Resume.pdf" download
                className="btn-press flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700">
                <FileText size={13} /> Resume
              </a>
            </div>
            <Link href="/build-your-own"
              className="text-[10px] text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-1">
              <Sparkles size={10} /> Like this? Build your own portfolio →
            </Link>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="relative py-8 px-4">
      <BorderDraw color={accent} />
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className={`font-display text-sm font-medium ${isCyberpunk ? 'text-[#00fff5]/70' : 'text-white/60'}`}>
            Phaneendra Gavara
          </p>
          <p className={`text-xs mt-0.5 ${isCyberpunk ? 'text-[#00fff5]/45' : 'text-white/50'}`}>
            {CLOSER}
          </p>
          <p className={`text-xs mt-0.5 ${isCyberpunk ? 'text-[#00fff5]/30' : 'text-white/30'}`} suppressHydrationWarning>
            © {year} · Built with Next.js · Deployed on Vercel
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {socials.map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className={`icon-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${
                  isCyberpunk
                    ? 'border-[#00fff5]/20 text-[#00fff5]/60 hover:text-[#00fff5]'
                    : 'border-white/10 text-white/50 hover:text-white/85'
                }`}>
                <Icon size={13} />{label}
              </a>
            ))}
            <a href="/resume/Phaneendra_G_Resume.pdf" download
              className={`btn-press flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${
                isCyberpunk
                  ? 'bg-[#00fff5]/10 border border-[#00fff5]/30 text-[#00fff5] hover:bg-[#00fff5]/20'
                  : 'bg-white/10 border border-white/15 text-white/70 hover:bg-white/15 hover:text-white'
              }`}>
              <FileText size={13} /> Resume
            </a>
            <Link href="/dashboard"
              className={`text-xs transition-colors ${isCyberpunk ? 'text-[#00fff5]/20 hover:text-[#00fff5]/40' : 'text-white/10 hover:text-white/25'}`}>
              Admin
            </Link>
          </div>
          <Link href="/build-your-own"
            className={`text-[10px] flex items-center gap-1 transition-colors ${
              isCyberpunk ? 'text-[#00fff5]/20 hover:text-[#00fff5]/45' : 'text-white/20 hover:text-white/45'
            }`}>
            <Sparkles size={10} /> Like this? Build your own portfolio →
          </Link>
        </div>
      </div>
    </footer>
  )
}
