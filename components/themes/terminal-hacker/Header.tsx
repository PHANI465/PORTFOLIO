'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeSwitcher from '@/components/shared/ThemeSwitcher'

const navLinks = [
  { href: '/', label: 'home', cmd: 'cd ~' },
  { href: '/projects', label: 'work', cmd: 'ls ./work' },
  { href: '/contact', label: 'contact', cmd: 'mail -s "hi"' },
]

function pathToTerminal(pathname: string): string {
  if (pathname === '/') return '~'
  const segments = pathname.replace(/^\//, '').split('/')
  return '~/' + segments.join('/')
}

export default function TerminalHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [time, setTime] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="border-b border-[#00ff41]/20"
        style={{ background: '#0d0d0d', fontFamily: 'Share Tech Mono, monospace' }}
      >
        {/* Terminal title bar */}
        <div
          className="flex items-center justify-between px-4 py-1 border-b border-[#00ff41]/10"
          style={{ background: '#111' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
            <span className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
            <span className="text-[10px] text-[#00ff41]/70 ml-2">
              phaneendra@portfolio:{pathToTerminal(pathname)}
            </span>
          </div>
          <span className="text-[10px] text-[#00ff41]/65">{time}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Prompt */}
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-[#00ff41]/60 text-xs">phaneendra</span>
              <span className="text-[#00ff41]/40 text-xs">@</span>
              <span className="text-[#00ff41] text-xs">portfolio</span>
              <span className="text-[#00ff41]/40 text-xs">:{pathToTerminal(pathname)}$</span>
              <span className="ml-1 text-xs text-[#00ff41]">█</span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group px-3 py-1 text-xs text-[#00ff41]/50 hover:text-[#00ff41] hover:bg-[#00ff41]/5 transition-colors"
                  title={link.cmd}
                >
                  ./{link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-xs text-[#00ff41]/60 hover:text-[#00ff41] border border-[#00ff41]/20 px-2 py-1"
              >
                {menuOpen ? '[close]' : '[menu]'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b border-[#00ff41]/20 overflow-hidden"
            style={{ background: '#0d0d0d', fontFamily: 'Share Tech Mono, monospace' }}
          >
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-xs text-[#00ff41]/60 hover:text-[#00ff41] py-1"
                >
                  <span className="text-[#00ff41]/30 mr-1">{i + 1}.</span>
                  $ {link.cmd}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
