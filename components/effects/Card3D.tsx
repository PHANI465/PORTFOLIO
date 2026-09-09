'use client'

import { useRef, useState, ReactNode, MouseEvent } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface Card3DProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  /** max rotation in degrees */
  maxTilt?: number
  /** glare tint that tracks the cursor */
  glareColor?: string
  /** lift of the whole card on hover, in px of Z */
  lift?: number
  disabled?: boolean
}

/**
 * True 3D card: the surface rotates in perspective while inner layers sit at
 * different Z depths, so the banner, text and actions separate as you move the
 * pointer instead of the whole card tilting as one flat plane.
 *
 * Children opt into depth with `data-depth="<px>"` (see `depthLayer` below).
 */
export default function Card3D({
  children,
  className = '',
  style,
  maxTilt = 10,
  glareColor = 'rgba(255,255,255,0.18)',
  lift = 24,
  disabled = false,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [glare, setGlare] = useState({ x: 50, y: 50 })

  const px = useSpring(0, { stiffness: 200, damping: 22, mass: 0.5 })
  const py = useSpring(0, { stiffness: 200, damping: 22, mass: 0.5 })
  const z = useSpring(0, { stiffness: 220, damping: 24 })

  const rotateY = useTransform(px, [-1, 1], [-maxTilt, maxTilt])
  const rotateX = useTransform(py, [-1, 1], [maxTilt, -maxTilt])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    px.set(nx * 2 - 1)
    py.set(ny * 2 - 1)
    setGlare({ x: nx * 100, y: ny * 100 })
  }

  const onEnter = () => { if (!disabled) { setHovered(true); z.set(lift) } }
  const onLeave = () => {
    if (disabled) return
    setHovered(false)
    px.set(0); py.set(0); z.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative ${className}`}
      style={{
        ...style,
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        z,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
        willChange: 'transform',
      }}
    >
      {children}

      {/* cursor-tracking glare, sits above the surface in Z */}
      {!disabled && hovered && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, ${glareColor} 0%, transparent 55%)`,
            transform: 'translateZ(40px)',
          }}
        />
      )}
    </motion.div>
  )
}

/**
 * Style helper: push an element toward the viewer inside a Card3D.
 * Usage: <div style={depthLayer(30)}>…</div>
 */
export const depthLayer = (px: number): React.CSSProperties => ({
  transform: `translateZ(${px}px)`,
  transformStyle: 'preserve-3d',
})
