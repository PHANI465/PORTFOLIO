'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { useTheme } from '@/lib/context/ThemeContext'
import { ThemeId } from '@/types'

/* ---- Cursor shape definitions ---- */
const Shapes: Record<ThemeId, { main: ReactNode; trail: ReactNode }> = {

  /* Terminal: blinking text-cursor block */
  'terminal-hacker': {
    main: (
      <div style={{
        width: 13, height: 20,
        background: '#00ff41',
        boxShadow: '0 0 6px #00ff41',
        animation: 'cursorBlink 1s step-end infinite',
      }} />
    ),
    trail: null,
  },

  /* Glassmorphism: frosted glass orb */
  'glassmorphism': {
    main: (
      <svg width="38" height="38" viewBox="0 0 38 38">
        <defs>
          <radialGradient id="glassOrb" cx="38%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ede9fe" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.45" />
          </radialGradient>
        </defs>
        <circle cx="19" cy="19" r="17" fill="url(#glassOrb)" stroke="#a78bfa" strokeWidth="1.5" />
        <circle cx="13" cy="12" r="4" fill="white" opacity="0.3" />
        <circle cx="19" cy="19" r="4" fill="#8b5cf6" opacity="0.85" />
      </svg>
    ),
    trail: (
      <svg width="54" height="54" viewBox="0 0 54 54">
        <circle cx="27" cy="27" r="24" fill="rgba(139,92,246,0.07)"
          stroke="rgba(167,139,250,0.3)" strokeWidth="1.5" />
      </svg>
    ),
  },

  /* Minimal: clean thin plus sign */
  'minimal-professional': {
    main: (
      <svg width="26" height="26" viewBox="0 0 26 26">
        <line x1="13" y1="3" x2="13" y2="23" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="3" y1="13" x2="23" y2="13" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="13" cy="13" r="2" fill="#334155" />
      </svg>
    ),
    trail: (
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(51,65,85,0.18)" strokeWidth="1" />
      </svg>
    ),
  },

  /* Bright Neon: 4-point star */
  'bright-neon': {
    main: (
      <svg width="32" height="32" viewBox="0 0 32 32" style={{ filter: 'drop-shadow(0 0 6px rgba(124,58,237,0.7))' }}>
        <polygon points="16,1 18.5,13.5 31,16 18.5,18.5 16,31 13.5,18.5 1,16 13.5,13.5" fill="#7c3aed" />
      </svg>
    ),
    trail: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <polygon points="24,2 26.5,21.5 46,24 26.5,26.5 24,46 21.5,26.5 2,24 21.5,21.5"
          fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="1"
          style={{ transformOrigin: '24px 24px', animation: 'cursorSpinSlow 8s linear infinite reverse' }} />
      </svg>
    ),
  },

}

export default function ThemeCursor() {
  const { theme } = useTheme()
  const mainRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -300, y: -300 })
  const lagged = useRef({ x: -300, y: -300 })
  const raf = useRef<number>()
  const clicking = useRef(false)
  const hovering = useRef(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only run on devices with a real pointer, saves a rAF loop on touch
    setEnabled(window.matchMedia('(pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary, [data-cursor-hover]'
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      const target = e.target as HTMLElement
      hovering.current = !!target?.closest?.(INTERACTIVE_SELECTOR)
    }
    const onDown = () => { clicking.current = true }
    const onUp = () => { clicking.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const loop = () => {
      if (mainRef.current) {
        mainRef.current.style.left = mouse.current.x + 'px'
        mainRef.current.style.top = mouse.current.y + 'px'
        const scale = clicking.current ? 0.75 : hovering.current ? 1.35 : 1
        mainRef.current.style.transform = `translate(-50%,-50%) scale(${scale})`
        mainRef.current.style.opacity = hovering.current ? '0.85' : '1'
      }
      lagged.current.x += (mouse.current.x - lagged.current.x) * 0.1
      lagged.current.y += (mouse.current.y - lagged.current.y) * 0.1
      if (trailRef.current) {
        trailRef.current.style.left = lagged.current.x + 'px'
        trailRef.current.style.top = lagged.current.y + 'px'
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [enabled])

  const { main, trail } = Shapes[theme as ThemeId] ?? Shapes['glassmorphism']

  if (!enabled) return null

  return (
    <div aria-hidden="true">
      {/* Exact-position: main cursor shape */}
      <div ref={mainRef} style={{
        position: 'fixed', top: 0, left: 0,
        pointerEvents: 'none', zIndex: 99999,
        transform: 'translate(-50%,-50%)',
        transition: 'transform 0.1s ease',
        willChange: 'left, top',
      }}>
        {main}
      </div>
      {/* Lagged-position: outer trail/ring */}
      {trail && (
        <div ref={trailRef} style={{
          position: 'fixed', top: 0, left: 0,
          pointerEvents: 'none', zIndex: 99998,
          transform: 'translate(-50%,-50%)',
          willChange: 'left, top',
        }}>
          {trail}
        </div>
      )}
    </div>
  )
}
