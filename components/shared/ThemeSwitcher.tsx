'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import { THEME_LIST } from '@/lib/themes'
import { ThemeId } from '@/types'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const isLight = theme === 'minimal-professional' || theme === 'bright-neon'

  const popupStyle = isLight
    ? { background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.12)' }
    : { background: 'rgba(10,10,20,0.95)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-current opacity-60 hover:opacity-100 transition-opacity"
        title="Switch theme"
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
              className="absolute right-0 top-full mt-2 z-50 w-60 rounded-xl overflow-hidden shadow-2xl"
              style={popupStyle}
            >
              <div className="p-2">
                <p className={`text-xs px-3 py-1.5 font-medium ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                  Choose Theme
                </p>
                {THEME_LIST.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id as ThemeId); setOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group ${
                      isLight ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ background: t.accentColor, boxShadow: `0 0 8px ${t.accentColor}60` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium truncate ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                        {t.name}
                      </div>
                    </div>
                    {theme === t.id && (
                      <Check size={12} className={isLight ? 'text-indigo-500' : 'text-white/60'} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
