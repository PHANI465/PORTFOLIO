'use client'

import { useRef, ReactNode, MouseEvent } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  strength?: number
  as?: 'button' | 'a' | 'div'
  download?: boolean
  target?: string
  rel?: string
}

/**
 * Cursor-attracting button. Wraps any element and pulls it toward
 * the mouse position with a spring. Pairs perfectly with the
 * glassmorphism theme's glow utilities.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  style,
  strength = 18,
  as,
  download,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 220, damping: 18 })
  const y = useSpring(0, { stiffness: 220, damping: 18 })
  const childX = useTransform(x, (v) => v * 0.45)
  const childY = useTransform(y, (v) => v * 0.45)

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    const max = strength
    x.set(Math.max(-max, Math.min(max, relX * 0.35)))
    y.set(Math.max(-max, Math.min(max, relY * 0.35)))
  }
  const onMouseLeave = () => { x.set(0); y.set(0) }

  const Tag: any = href ? 'a' : as ?? 'button'
  const tagProps: Record<string, any> = href
    ? { href, download, target, rel }
    : { onClick, type: 'button' }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y, display: 'inline-block' }}
      className="will-change-transform"
    >
      <Tag {...tagProps} className={className} style={style}>
        <motion.span
          style={{ x: childX, y: childY, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {children}
        </motion.span>
      </Tag>
    </motion.div>
  )
}
