'use client'

import { useRef, useState, ReactNode, MouseEvent } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'

interface Ripple { id: number; x: number; y: number }

interface ActionButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  /** magnetic pull distance in px */
  strength?: number
  /** max 3D tilt in degrees */
  tilt?: number
  /** colour of the click ripple */
  rippleColor?: string
  download?: string | boolean
  target?: string
  rel?: string
  ariaLabel?: string
}

/**
 * Primary call-to-action with real tactile feedback:
 *  - magnetic pull toward the cursor
 *  - live 3D tilt that tracks the pointer across the face
 *  - a ripple that expands from the exact click point
 *  - depth press on tap (translateZ + scale)
 *
 * Everything is spring-driven so it settles naturally, and it degrades to a
 * plain button/link when the pointer never moves (touch, keyboard).
 */
export default function ActionButton({
  children,
  href,
  onClick,
  className = '',
  style,
  strength = 16,
  tilt = 12,
  rippleColor = 'rgba(255,255,255,0.55)',
  download,
  target,
  rel,
  ariaLabel,
}: ActionButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])

  // pointer position, normalised to -1..1 across the button face
  const px = useSpring(0, { stiffness: 260, damping: 20, mass: 0.4 })
  const py = useSpring(0, { stiffness: 260, damping: 20, mass: 0.4 })

  const moveX = useTransform(px, [-1, 1], [-strength, strength])
  const moveY = useTransform(py, [-1, 1], [-strength, strength])
  const rotateY = useTransform(px, [-1, 1], [-tilt, tilt])
  const rotateX = useTransform(py, [-1, 1], [tilt, -tilt])
  // sheen follows the pointer across the surface
  const sheenX = useTransform(px, [-1, 1], ['0%', '100%'])

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width) * 2 - 1)
    py.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  const reset = () => { px.set(0); py.set(0) }

  const spawnRipple = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const id = Date.now() + Math.random()
    setRipples(rs => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top }])
    // ripple lives just long enough to finish its animation
    setTimeout(() => setRipples(rs => rs.filter(p => p.id !== id)), 620)
  }

  const inner = (
    <>
      {/* pointer-tracking sheen */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(120px circle at ${'var(--sheen-x, 50%)'} 50%, rgba(255,255,255,0.28), transparent 60%)`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ['--sheen-x' as any]: sheenX,
        }}
      />
      {/* click ripples */}
      {ripples.map(r => (
        <motion.span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
          initial={{ width: 0, height: 0, opacity: 0.55, x: r.x, y: r.y }}
          animate={{ width: 320, height: 320, opacity: 0, x: r.x - 160, y: r.y - 160 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ background: rippleColor, left: 0, top: 0 }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2 w-full">
        {children}
      </span>
    </>
  )

  const shared = {
    ref,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    onMouseDown: spawnRipple,
    className: `group relative overflow-hidden isolate ${className}`,
    style: {
      ...style,
      x: moveX,
      y: moveY,
      rotateX,
      rotateY,
      transformStyle: 'preserve-3d' as const,
      transformPerspective: 600,
      willChange: 'transform',
    },
    whileTap: { scale: 0.96, z: -8 },
  }

  if (href) {
    const external = href.startsWith('http') || download !== undefined
    return (
      <motion.div {...shared}>
        {external ? (
          <a
            href={href}
            target={target}
            rel={rel}
            aria-label={ariaLabel}
            download={download as string | undefined}
            className="absolute inset-0 z-20"
          />
        ) : (
          <Link href={href} aria-label={ariaLabel} className="absolute inset-0 z-20" />
        )}
        {inner}
      </motion.div>
    )
  }

  return (
    <motion.div {...shared} role="button" tabIndex={0} aria-label={ariaLabel} onClick={onClick}>
      {inner}
    </motion.div>
  )
}
