'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Download, ChevronDown, FileText } from 'lucide-react'
import { RESUMES, resumeUrl } from '@/lib/resumes'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'

interface ResumeDropdownProps {
  label?: string
  triggerCls: string
  triggerStyle?: React.CSSProperties
  /** kept for API compatibility with existing call sites; the menu is self-styled */
  menuCls?: string
  itemCls?: string
  openUp?: boolean
}

interface MenuPos {
  left: number
  top: number
  maxHeight: number
  placement: 'down' | 'up'
}

const MENU_W = 300
const GAP = 8
const EDGE = 12

export default function ResumeDropdown({
  label = 'Download CV',
  triggerCls,
  triggerStyle,
  openUp = false,
}: ResumeDropdownProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<MenuPos | null>(null)
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { theme } = useTheme()
  const { accent, light: isLight, mono: isTerminal } = getAccents(theme)

  useEffect(() => setMounted(true), [])

  /**
   * Position the menu in viewport coordinates. It renders in a portal on
   * document.body so ancestor `overflow-hidden` (the hero section) can no
   * longer clip it — which is what previously made the list unscrollable.
   */
  const place = useCallback(() => {
    const b = btnRef.current?.getBoundingClientRect()
    if (!b) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const below = vh - b.bottom - GAP - EDGE
    const above = b.top - GAP - EDGE
    const wantUp = openUp ? above > 180 : below < 240 && above > below
    const maxHeight = Math.max(160, Math.min(440, wantUp ? above : below))
    let left = b.left
    if (left + MENU_W > vw - EDGE) left = Math.max(EDGE, vw - EDGE - MENU_W)
    setPos({
      left,
      top: wantUp ? b.top - GAP : b.bottom + GAP,
      maxHeight,
      placement: wantUp ? 'up' : 'down',
    })
  }, [openUp])

  useEffect(() => {
    if (!open) return
    place()
    const onScroll = (e: Event) => {
      // let the menu scroll internally; only reposition for outside scrolls
      if (menuRef.current?.contains(e.target as Node)) return
      place()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return
      setOpen(false)
    }
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', place)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', place)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open, place])

  // Bright, high-contrast surfaces per theme.
  const panel = isTerminal
    ? { background: '#04140a', border: '1px solid rgba(0,255,65,0.45)', boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,65,0.12)' }
    : isLight
    ? { background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 24px 60px rgba(15,23,42,0.16)' }
    : { background: 'linear-gradient(180deg, #232a45 0%, #1a2038 100%)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 24px 60px rgba(0,0,0,0.55)' }

  const titleColor = isTerminal ? '#00ff41' : isLight ? '#0f172a' : '#ffffff'
  const descColor = isTerminal ? 'rgba(0,255,65,0.65)' : isLight ? '#64748b' : 'rgba(255,255,255,0.75)'
  const hoverBg = isTerminal ? 'rgba(0,255,65,0.12)' : isLight ? '#eef2ff' : 'rgba(255,255,255,0.14)'

  const menu = pos && (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Choose a resume to download"
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.placement === 'up' ? undefined : pos.top,
        bottom: pos.placement === 'up' ? window.innerHeight - pos.top : undefined,
        width: MENU_W,
        maxWidth: 'calc(100vw - 24px)',
        maxHeight: pos.maxHeight,
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        borderRadius: 14,
        zIndex: 2147483000,
        padding: 6,
        ...panel,
      }}
    >
      <p
        className="px-2.5 pt-1.5 pb-2 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: isTerminal ? '#ffb000' : accent, fontFamily: isTerminal ? 'monospace' : undefined }}
      >
        Choose a resume
      </p>

      {RESUMES.map(r => (
        <a
          key={r.id}
          role="menuitem"
          href={resumeUrl(r)}
          download={r.file}
          onClick={() => setOpen(false)}
          className="resume-item flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg transition-colors"
          style={{ textDecoration: 'none', fontFamily: isTerminal ? 'monospace' : undefined }}
          onMouseEnter={e => { e.currentTarget.style.background = hoverBg }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <FileText size={15} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
          <span className="flex-1 min-w-0">
            <span className="flex items-center gap-2">
              <span className="text-[13px] font-semibold leading-tight" style={{ color: titleColor }}>
                {r.label}
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-px rounded-full flex-shrink-0"
                style={{ color: accent, background: `${accent}22`, border: `1px solid ${accent}55` }}
              >
                {r.pages}p
              </span>
            </span>
            <span className="block text-[11px] leading-snug mt-0.5" style={{ color: descColor }}>
              {r.description}
            </span>
          </span>
          <Download size={13} className="mt-1 flex-shrink-0" style={{ color: accent, opacity: 0.75 }} />
        </a>
      ))}
    </div>
  )

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        className={triggerCls}
        style={triggerStyle}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Download size={15} />
        {label}
        <ChevronDown size={11} className={`ml-0.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {mounted && open && createPortal(menu, document.body)}
    </>
  )
}
