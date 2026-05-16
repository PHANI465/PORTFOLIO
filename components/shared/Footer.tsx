'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, FileText } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'

const socials = [
  { href: 'https://www.linkedin.com/in/phaneendra-gavara', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://github.com/PHANI465', icon: Github, label: 'GitHub' },
  { href: 'mailto:phaneendragavara436@gmail.com', icon: Mail, label: 'Email' },
]

export default function Footer() {
  const { theme } = useTheme()
  const year = new Date().getFullYear()

  const isCyberpunk = theme === 'cyberpunk-ai'
  const isTerminal  = theme === 'terminal-hacker'
  const isLight     = theme === 'minimal-professional' || theme === 'bright-neon'

  if (isTerminal) {
    return (
      <footer className="border-t border-[#00ff41]/15 py-6 px-4"
        style={{ background: '#0d0d0d', fontFamily: 'Share Tech Mono, monospace' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#00ff41]/40" suppressHydrationWarning>© {year} phaneendra_gavara — Next.js + AI</span>
          <div className="flex gap-5">
            {socials.map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="text-xs text-[#00ff41]/50 hover:text-[#00ff41] transition-colors flex items-center gap-1.5">
                <Icon size={13} />{label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    )
  }

  if (isLight) {
    return (
      <footer className="border-t border-slate-100 py-8 px-4 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">Phaneendra Gavara</p>
            <p className="text-xs text-slate-400 mt-0.5" suppressHydrationWarning>© {year} · Built with Next.js</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {socials.map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-xs font-medium">
                <Icon size={13} />{label}
              </a>
            ))}
            <a href="/resume/Phaneendra_G_Resume.pdf" download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors">
              <FileText size={13} /> Resume
            </a>
            <Link href="/one-page" className="text-xs text-slate-400 hover:text-slate-600 transition-colors ml-1">
              One Page
            </Link>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className={`border-t py-8 px-4 ${isCyberpunk ? 'border-[#00fff5]/10' : 'border-white/5'}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className={`text-sm font-medium ${isCyberpunk ? 'text-[#00fff5]/70' : 'text-white/50'}`}>
            Phaneendra Gavara
          </p>
          <p className={`text-xs mt-0.5 ${isCyberpunk ? 'text-[#00fff5]/30' : 'text-white/25'}`} suppressHydrationWarning>
            © {year} · Built with Next.js · Deployed on Vercel
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {socials.map(({ href, icon: Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                isCyberpunk
                  ? 'border-[#00fff5]/20 text-[#00fff5]/60 hover:border-[#00fff5]/50 hover:text-[#00fff5]'
                  : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
              }`}>
              <Icon size={13} />{label}
            </a>
          ))}
          <a href="/resume/Phaneendra_G_Resume.pdf" download
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              isCyberpunk
                ? 'bg-[#00fff5]/10 border border-[#00fff5]/30 text-[#00fff5] hover:bg-[#00fff5]/20'
                : 'bg-white/10 border border-white/15 text-white/70 hover:bg-white/15 hover:text-white'
            }`}>
            <FileText size={13} /> Resume
          </a>
          <Link href="/one-page"
            className={`text-xs transition-colors ml-1 ${isCyberpunk ? 'text-[#00fff5]/30 hover:text-[#00fff5]/60' : 'text-white/20 hover:text-white/40'}`}>
            One Page
          </Link>
          <Link href="/dashboard"
            className={`text-xs transition-colors ${isCyberpunk ? 'text-[#00fff5]/20 hover:text-[#00fff5]/40' : 'text-white/10 hover:text-white/25'}`}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
