'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { useTheme } from '@/lib/context/ThemeContext'
import { ThemeId } from '@/types'

/* ---- Cursor shape definitions ---- */
const Shapes: Record<ThemeId, { main: ReactNode; trail: ReactNode }> = {

  /* Cyberpunk: rotating crosshair reticle */
  'cyberpunk-ai': {
    main: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ filter: 'drop-shadow(0 0 5px #00fff5)' }}>
        <circle cx="22" cy="22" r="17" fill="none" stroke="#00fff5" strokeWidth="1" strokeDasharray="5 3"
          style={{ transformOrigin: '22px 22px', animation: 'cursorSpin 3s linear infinite' }} />
        <line x1="22" y1="1" x2="22" y2="10" stroke="#00fff5" strokeWidth="1.5" />
        <line x1="22" y1="34" x2="22" y2="43" stroke="#00fff5" strokeWidth="1.5" />
        <line x1="1" y1="22" x2="10" y2="22" stroke="#00fff5" strokeWidth="1.5" />
        <line x1="34" y1="22" x2="43" y2="22" stroke="#00fff5" strokeWidth="1.5" />
        <circle cx="22" cy="22" r="5" fill="none" stroke="#00fff5" strokeWidth="0.8" opacity="0.5" />
        <circle cx="22" cy="22" r="2" fill="#00fff5" />
      </svg>
    ),
    trail: (
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(0,255,245,0.15)" strokeWidth="1" />
      </svg>
    ),
  },

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

  /* Dark Professional: spinning diamond */
  'dark-professional': {
    main: (
      <svg width="28" height="28" viewBox="0 0 28 28" style={{ filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.6))' }}>
        <polygon points="14,1 27,14 14,27 1,14" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="2.5" fill="#3b82f6" />
      </svg>
    ),
    trail: (
      <svg width="44" height="44" viewBox="0 0 44 44">
        <polygon points="22,2 42,22 22,42 2,22" fill="none" stroke="rgba(59,130,246,0.2)"
          strokeWidth="1" strokeDasharray="4 3"
          style={{ transformOrigin: '22px 22px', animation: 'cursorSpinSlow 6s linear infinite' }} />
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

  /* Futuristic Space: planetary orbit */
  'futuristic-space': {
    main: (
      <svg width="42" height="42" viewBox="0 0 42 42">
        <ellipse cx="21" cy="21" rx="17" ry="7" fill="none" stroke="#a78bfa" strokeWidth="1.2"
          transform="rotate(-35 21 21)"
          style={{ animation: 'cursorOrbit 2s linear infinite', transformOrigin: '21px 21px' }} />
        <circle cx="21" cy="21" r="3.5" fill="#c4b5fd" style={{ filter: 'drop-shadow(0 0 5px #a78bfa)' }} />
      </svg>
    ),
    trail: (
      <svg width="56" height="56" viewBox="0 0 56 56">
        <ellipse cx="28" cy="28" rx="24" ry="10" fill="none" stroke="rgba(167,139,250,0.15)"
          strokeWidth="1" transform="rotate(-35 28 28)" />
      </svg>
    ),
  },

  /* Anime Gaming: lightning bolt */
  'anime-gaming': {
    main: (
      <svg width="24" height="32" viewBox="0 0 24 32" style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.8))' }}>
        <polygon points="15,0 5,14 12,14 9,32 19,12 13,12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
      </svg>
    ),
    trail: (
      <svg width="46" height="46" viewBox="0 0 46 46">
        <polygon points="23,2 25.5,20.5 44,23 25.5,25.5 23,44 20.5,25.5 2,23 20.5,20.5"
          fill="none" stroke="rgba(251,191,36,0.2)" strokeWidth="1"
          style={{ transformOrigin: '23px 23px', animation: 'cursorSpinSlow 5s linear infinite' }} />
      </svg>
    ),
  },

  /* Retro Pixel: pixel-art arrow */
  'retro-pixel': {
    main: (
      <svg width="18" height="22" viewBox="0 0 18 22" shapeRendering="crispEdges">
        <rect x="0" y="0" width="4" height="18" fill="#00ff41" />
        <rect x="4" y="4" width="4" height="8" fill="#00ff41" />
        <rect x="8" y="8" width="4" height="6" fill="#00ff41" />
        <rect x="12" y="12" width="4" height="4" fill="#00ff41" />
        <rect x="4" y="14" width="4" height="4" fill="#00ff41" />
        <rect x="0" y="18" width="4" height="4" fill="#00ff41" />
      </svg>
    ),
    trail: null,
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

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    const onDown = () => { clicking.current = true }
    const onUp = () => { clicking.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const loop = () => {
      if (mainRef.current) {
        mainRef.current.style.left = mouse.current.x + 'px'
        mainRef.current.style.top = mouse.current.y + 'px'
        mainRef.current.style.transform = `translate(-50%,-50%) scale(${clicking.current ? 0.75 : 1})`
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
  }, [])

  const { main, trail } = Shapes[theme as ThemeId] ?? Shapes['cyberpunk-ai']

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
