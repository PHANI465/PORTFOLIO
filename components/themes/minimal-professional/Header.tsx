'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeSwitcher from '@/components/shared/ThemeSwitcher'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Work' },
  { href: '/contact', label: 'Contact' },
  { href: '/docs', label: 'Create Your Own' },
]

export default function MinimalHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-semibold text-slate-900 tracking-tight text-sm">
          Phaneendra Gavara
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="nav-underline px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <button onClick={() => setOpen(!open)}
            className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-50">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="md:hidden bg-white border-b border-slate-100 px-6 pb-4">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="block py-2.5 text-sm text-slate-500 hover:text-slate-900 border-b border-slate-50 last:border-0">
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
