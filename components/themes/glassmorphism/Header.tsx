'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Command } from 'lucide-react'
import ThemeSwitcher from '@/components/shared/ThemeSwitcher'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Work' },
  { href: '/contact', label: 'Contact' },
  { href: '/docs', label: 'Build Your Own' },
]

export default function GlassHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href)

  const openPalette = () => {
    // Simulate ⌘K press
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    )
  }

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      <div
        className="rounded-2xl border border-white/10 px-5 py-2.5 flex items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          backdropFilter: 'blur(22px) saturate(140%)',
          WebkitBackdropFilter: 'blur(22px) saturate(140%)',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              boxShadow: '0 0 20px rgba(139,92,246,0.45)',
            }}
          >
            <span className="relative z-10">P</span>
            <span className="absolute inset-0 opacity-50"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'gradientShift 4s linear infinite',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
          <span className="text-white font-semibold text-sm hidden sm:block">Phaneendra</span>
        </Link>

        {/* Desktop Nav with active-link pill */}
        <nav className="hidden md:flex items-center gap-0.5 relative">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  active ? 'text-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.18))',
                      border: '1px solid rgba(139,92,246,0.35)',
                      boxShadow: '0 0 18px rgba(139,92,246,0.25)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          {/* ⌘K trigger */}
          <button
            onClick={openPalette}
            title="Open command palette (⌘K)"
            className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] text-white/55 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all"
          >
            <Command size={11} /> K
          </button>
          <ThemeSwitcher />
          <button
            className="md:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-all"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mt-2 rounded-2xl border border-white/10 p-3"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm rounded-lg transition-all ${
                  isActive(link.href)
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
