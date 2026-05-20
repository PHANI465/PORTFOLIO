'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import ThemeSwitcher from '@/components/shared/ThemeSwitcher'

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/projects', label: 'WORK' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/docs', label: 'CREATE YOURS' },
]

export default function CyberpunkHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00fff5] to-transparent animate-scan-line opacity-20" />
      </div>

      <div
        className="relative border-b border-[#00fff5]/20 backdrop-blur-md"
        style={{ background: 'rgba(5, 5, 16, 0.85)' }}
      >
        {/* Top accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#00fff5] to-transparent opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 flex items-center justify-center border border-[#00fff5]/50 group-hover:border-[#00fff5] transition-colors">
                <Zap size={16} className="text-[#00fff5]" />
                <div className="absolute inset-0 bg-[#00fff5]/10 group-hover:bg-[#00fff5]/20 transition-colors" />
              </div>
              <span
                className="text-sm font-bold tracking-[0.2em] text-[#00fff5]"
                style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 10px #00fff5' }}
              >
                PG.DEV
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-xs tracking-[0.15em] text-[#00fff5]/70 hover:text-[#00fff5] transition-colors group"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00fff5] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <button
                className="md:hidden p-2 text-[#00fff5] border border-[#00fff5]/30 hover:border-[#00fff5] transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff0090]/40 to-transparent" />
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-b border-[#00fff5]/20"
            style={{ background: 'rgba(5, 5, 16, 0.97)' }}
          >
            <nav className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-xs tracking-[0.15em] text-[#00fff5]/70 hover:text-[#00fff5] py-2 border-b border-[#00fff5]/10 transition-colors"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  &gt; {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
