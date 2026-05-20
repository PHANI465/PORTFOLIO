'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import { THEME_LIST } from '@/lib/themes'
import { ThemeId } from '@/types'

// Mini preview gradient per theme — keeps each swatch recognizable at a glance
const themePreview: Record<string, string> = {
  'cyberpunk-ai':       'linear-gradient(135deg, #00fff5 0%, #7b2fff 60%, #ff0090 100%)',
  'terminal-hacker':    'linear-gradient(135deg, #00ff41 0%, #064e1a 100%)',
  'glassmorphism':      'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #14b8a6 100%)',
  'minimal-professional':'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
  'dark-professional':  'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
  'bright-neon':        'linear-gradient(135deg, #fefce8 0%, #c4b5fd 50%, #7c3aed 100%)',
  'futuristic-space':   'linear-gradient(135deg, #6366f1 0%, #1e1b4b 100%)',
  'anime-gaming':       'linear-gradient(135deg, #ff6eb4 0%, #f472b6 50%, #fb923c 100%)',
  'retro-pixel':        'linear-gradient(135deg, #ffcc00 0%, #f97316 100%)',
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const isLight = theme === 'minimal-professional' || theme === 'bright-neon'

  const popupStyle = isLight
    ? { background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.12)' }
    : {
        background: 'linear-gradient(180deg, rgba(20,20,32,0.95), rgba(10,10,22,0.95))',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(24px) saturate(140%)',
        WebkitBackdropFilter: 'blur(24px) saturate(140%)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
      }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-current opacity-70 hover:opacity-100 transition-opacity"
        title="Switch theme"
        aria-label="Switch theme"
      >
        <Palette size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl overflow-hidden"
              style={popupStyle}
            >
              <div className="p-2">
                <p className={`text-[10px] tracking-widest uppercase px-3 py-2 font-medium ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                  Theme
                </p>
                <div className="grid grid-cols-1 gap-0.5">
                  {THEME_LIST.map((t) => {
                    const active = theme === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => { setTheme(t.id as ThemeId); setOpen(false) }}
                        className={`relative w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all text-left group ${
                          isLight ? 'hover:bg-slate-50' : 'hover:bg-white/8'
                        } ${active ? (isLight ? 'bg-slate-50' : 'bg-white/8') : ''}`}
                      >
                        {/* Mini gradient preview tile */}
                        <span
                          className="w-9 h-9 rounded-lg flex-shrink-0 relative overflow-hidden"
                          style={{
                            background: themePreview[t.id] ?? t.accentColor,
                            boxShadow: active ? `0 0 18px ${t.accentColor}80` : `0 0 0 1px rgba(255,255,255,0.06)`,
                          }}
                        >
                          <span
                            className="absolute inset-0 opacity-50"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.25), transparent 50%)',
                            }}
                          />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold truncate ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                            {t.name}
                          </div>
                          <div className={`text-[10px] truncate ${isLight ? 'text-slate-500' : 'text-white/45'}`}>
                            {t.description}
                          </div>
                        </div>
                        {active && (
                          <Check size={13} className={isLight ? 'text-indigo-500' : 'text-purple-300'} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
