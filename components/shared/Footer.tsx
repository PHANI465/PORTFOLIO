'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Sparkles } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'
import ResumeDropdown from './ResumeDropdown'

const socials = [
  { href: 'https://www.linkedin.com/in/phaneendra-gavara', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://github.com/PHANI465', icon: Github, label: 'GitHub' },
  { href: 'mailto:phaneendra.gavara@gmail.com', icon: Mail, label: 'Email' },
]

const CLOSER = 'Tempe, AZ · Open to remote · Building AI that ships.'

/* top border draws in on scroll-into-view */
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

function BuildYourOwnLink({ cls }: { cls: string }) {
  return (
    <Link href="/build-your-own" className={`inline-flex items-center gap-1.5 transition-colors ${cls}`}>
      <Sparkles size={10} />
      Like this? Build your own portfolio →
    </Link>
  )
}

export default function Footer() {
  const { theme } = useTheme()
  const year = new Date().getFullYear()
  const { accent } = getAccents(theme)

  const isTerminal  = theme === 'terminal-hacker'
  const isLight     = theme === 'minimal-professional' || theme === 'bright-neon'

  if (isTerminal) {
    return (
      <footer className="relative px-4 pt-6 pb-4"
        style={{ background: '#0d0d0d', fontFamily: 'Share Tech Mono, monospace' }}>
        <BorderDraw color={accent} />
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs text-[#00ff41]/60 block">$ echo &quot;{CLOSER}&quot;</span>
            <span className="text-xs text-[#00ff41]/65" suppressHydrationWarning>© {year} phaneendra_gavara · Next.js + AI</span>
          </div>
          <div className="flex items-center gap-5">
            {socials.map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="icon-link text-xs text-[#00ff41]/50 hover:text-[#00ff41] flex items-center gap-1.5">
                <Icon size={13} />{label}
              </a>
            ))}
            <ResumeDropdown
              label="resume"
              openUp
              triggerCls="icon-link text-xs text-[#00ff41]/50 hover:text-[#00ff41] flex items-center gap-1.5"
              menuCls="border border-[#00ff41]/20 bg-[#0d0d0d] py-1"
              itemCls="block px-3 py-2 text-xs text-[#00ff41]/60 hover:text-[#00ff41] hover:bg-[#00ff41]/10 transition-colors whitespace-nowrap"
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#00ff41]/8 pt-3 text-center">
          <BuildYourOwnLink cls="text-[10px] text-[#00ff41]/25 hover:text-[#00ff41]/50" />
        </div>
      </footer>
    )
  }

  if (isLight) {
    return (
      <footer className="relative px-4 pt-8 pb-4 bg-white">
        <BorderDraw color={accent} />
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">Phaneendra Gavara</p>
            <p className="text-xs text-slate-500 mt-0.5">{CLOSER}</p>
            <p className="text-xs text-slate-600 mt-0.5" suppressHydrationWarning>© {year} · Built with Next.js</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {socials.map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="icon-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 text-xs font-medium">
                <Icon size={13} />{label}
              </a>
            ))}
            <ResumeDropdown
              label="Resume"
              openUp
              triggerCls="btn-press flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-[#ffffff] text-xs font-medium hover:bg-indigo-700"
              menuCls="rounded-lg border border-slate-200 bg-white shadow-lg py-1"
              itemCls="block px-3 py-2 text-xs text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors whitespace-nowrap"
            />
          </div>
        </div>
        <div className="max-w-5xl mx-auto border-t border-slate-100 pt-3 text-center">
          <BuildYourOwnLink cls="text-[10px] text-slate-600 hover:text-indigo-500" />
        </div>
      </footer>
    )
  }

  return (
    <footer className="relative px-4 pt-8 pb-4">
      <BorderDraw color={accent} />
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div>
          <p className="font-display text-sm font-medium text-white/60">
            Phaneendra Gavara
          </p>
          <p className="text-xs mt-0.5 text-white/50">
            {CLOSER}
          </p>
          <p className="text-xs mt-0.5 text-white/50" suppressHydrationWarning>
            © {year} · Built with Next.js · Deployed on Vercel
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {socials.map(({ href, icon: Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="icon-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs border-white/10 text-white/50 hover:text-white/85">
              <Icon size={13} />{label}
            </a>
          ))}
          <ResumeDropdown
            label="Resume"
            openUp
            triggerCls="btn-press flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/10 border border-white/15 text-white/70 hover:bg-white/15 hover:text-white"
            menuCls="border border-white/10 bg-[#0a0a0f] rounded-lg py-1 shadow-2xl"
            itemCls="block px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
          />
          <Link href="/dashboard"
            className="text-xs transition-colors text-white/50 hover:text-white/80">
            Admin
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t pt-3 text-center border-white/6">
        <BuildYourOwnLink cls="text-[10px] text-white/55 hover:text-white/85" />
      </div>
    </footer>
  )
}
