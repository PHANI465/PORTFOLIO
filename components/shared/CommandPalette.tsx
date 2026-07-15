'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search, ArrowRight, Home, Briefcase, Mail,
  Palette, Download, Github, Linkedin, Sparkles, TerminalSquare,
} from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import { THEME_LIST } from '@/lib/themes'
import { ThemeId } from '@/types'

type Item = {
  id: string
  label: string
  hint?: string
  icon: React.ReactNode
  action: () => void
  group: 'Navigation' | 'Theme' | 'Links'
  keywords?: string
}

export default function CommandPalette() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // ⌘K / Ctrl+K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const items: Item[] = useMemo(() => [
    { id: 'home', group: 'Navigation', label: 'Home', icon: <Home size={14} />, action: () => router.push('/') },
    { id: 'projects', group: 'Navigation', label: 'Work (Projects & Experience)', icon: <Briefcase size={14} />, action: () => router.push('/projects') },
    { id: 'contact', group: 'Navigation', label: 'Contact', icon: <Mail size={14} />, action: () => router.push('/contact') },
    { id: 'terminal', group: 'Navigation', label: 'Open Interactive Terminal', hint: '`', icon: <TerminalSquare size={14} />, action: () => window.dispatchEvent(new Event('open-terminal')), keywords: 'game easter egg cli command' },
    { id: 'resume-ai', group: 'Links', label: 'Download Resume: AI / ML', icon: <Download size={14} />, action: () => window.open('/resume/Phaneendra_Gavara_AI_Resume.pdf', '_blank') },
    { id: 'resume-data', group: 'Links', label: 'Download Resume: Data', icon: <Download size={14} />, action: () => window.open('/resume/Phaneendra_Gavara_Data_Resume.pdf', '_blank') },
    { id: 'github', group: 'Links', label: 'GitHub', icon: <Github size={14} />, action: () => window.open('https://github.com/PHANI465', '_blank') },
    { id: 'linkedin', group: 'Links', label: 'LinkedIn', icon: <Linkedin size={14} />, action: () => window.open('https://www.linkedin.com/in/phaneendra-gavara', '_blank') },
    ...THEME_LIST.map<Item>((t) => ({
      id: `theme-${t.id}`,
      group: 'Theme',
      label: `Switch to ${t.name}`,
      hint: theme === t.id ? 'Current' : undefined,
      icon: (
        <span
          className="w-3 h-3 rounded-full block"
          style={{ background: t.accentColor, boxShadow: `0 0 8px ${t.accentColor}90` }}
        />
      ),
      action: () => setTheme(t.id as ThemeId),
      keywords: 'theme color palette skin',
    })),
  ], [router, setTheme, theme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) =>
      it.label.toLowerCase().includes(q) ||
      (it.keywords && it.keywords.toLowerCase().includes(q))
    )
  }, [items, query])

  const groups = useMemo(() => {
    const map = new Map<string, Item[]>()
    for (const it of filtered) {
      const arr = map.get(it.group) ?? []
      arr.push(it)
      map.set(it.group, arr)
    }
    return Array.from(map.entries())
  }, [filtered])

  const flat = filtered
  useEffect(() => { setActive(0) }, [query])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(flat.length - 1, a + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      const it = flat[active]
      if (it) { it.action(); setOpen(false) }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-start justify-center pt-[14vh] px-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl overflow-hidden border"
            style={{
              background: 'linear-gradient(180deg, rgba(20,20,32,0.92), rgba(12,12,22,0.92))',
              borderColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(28px) saturate(140%)',
              WebkitBackdropFilter: 'blur(28px) saturate(140%)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <Search size={16} className="text-white/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search pages, themes, links…"
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 text-white/40">ESC</kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto py-2">
              {groups.length === 0 && (
                <div className="px-4 py-6 text-center text-white/40 text-sm flex flex-col items-center gap-2">
                  <Sparkles size={16} className="text-purple-400" />
                  No matches for &quot;{query}&quot;
                </div>
              )}
              {groups.map(([group, list]) => (
                <div key={group} className="mb-2">
                  <div className="px-4 pt-2 pb-1 text-[10px] tracking-widest text-white/30 uppercase">{group}</div>
                  {list.map((it) => {
                    const idx = flat.indexOf(it)
                    const isActive = idx === active
                    return (
                      <button
                        key={it.id}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => { it.action(); setOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors"
                        style={{
                          background: isActive ? 'rgba(139,92,246,0.14)' : 'transparent',
                          color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                        }}
                      >
                        <span className="w-5 flex items-center justify-center text-white/60">{it.icon}</span>
                        <span className="flex-1">{it.label}</span>
                        {it.hint && <span className="text-[10px] text-white/40">{it.hint}</span>}
                        <ArrowRight size={12} className={isActive ? 'text-purple-300' : 'text-white/20'} />
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 text-[10px] text-white/30">
              <div className="flex items-center gap-3">
                <span><kbd className="px-1 py-0.5 rounded border border-white/10">↑</kbd> <kbd className="px-1 py-0.5 rounded border border-white/10">↓</kbd> Navigate</span>
                <span><kbd className="px-1 py-0.5 rounded border border-white/10">↵</kbd> Select</span>
              </div>
              <span className="flex items-center gap-1"><Palette size={10} /> Command Palette</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
