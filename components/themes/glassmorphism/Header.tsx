'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search } from 'lucide-react'
import ThemeSwitcher from '@/components/shared/ThemeSwitcher'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Work' },
  { href: '/contact', label: 'Contact' },
  { href: '/docs', label: 'Build Your Own' },
]

export default function GlassHeader() {
  const [open, setOpen] = useState(false)
  const [photoOpen, setPhotoOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href)

  const openPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    )
  }

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setPhotoOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
    {/* Photo lightbox */}
    <AnimatePresence>
      {photoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center cursor-zoom-out"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          onClick={() => setPhotoOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              width: 'min(380px, 90vw)',
              aspectRatio: '3/4',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src="/images/avatar.jpg"
              alt="Phaneendra Gavara"
              fill
              className="object-cover object-top"
              sizes="380px"
              priority
            />
            <button
              onClick={() => setPhotoOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <X size={14} className="text-white" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPhotoOpen(true)}
            title="View photo"
            className="w-8 h-8 rounded-lg overflow-hidden relative flex-shrink-0 cursor-zoom-in hover:ring-2 hover:ring-purple-400/60 transition-all"
            style={{ boxShadow: '0 0 20px rgba(139,92,246,0.45)' }}
          >
            <Image
              src="/images/avatar.jpg"
              alt="Phaneendra"
              fill
              className="object-cover object-top"
              sizes="32px"
            />
          </button>
          <Link href="/" className="text-white font-semibold text-sm hidden sm:block hover:text-white/80 transition-colors">
            Phaneendra
          </Link>
        </div>

        {/* Desktop Nav with active-link pill */}
        <nav className="hidden md:flex items-center gap-0.5 relative">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  active ? 'text-white' : 'nav-underline text-white/55 hover:text-white'
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
          {/* Search trigger */}
          <button
            onClick={openPalette}
            title="Search (⌘K)"
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-white/50 hover:text-white border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all"
          >
            <Search size={14} />
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
    </>
  )
}
