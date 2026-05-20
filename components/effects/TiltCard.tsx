'use client'

import { useRef, useState, ReactNode } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  maxTilt?: number
  glareColor?: string
  disabled?: boolean
}

export default function TiltCard({
  children,
  className = '',
  style,
  maxTilt = 12,
  glareColor = 'rgba(255,255,255,0.06)',
  disabled = false,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const rawX = useSpring(0, { stiffness: 200, damping: 20 })
  const rawY = useSpring(0, { stiffness: 200, damping: 20 })
  const scale = useSpring(1, { stiffness: 250, damping: 20 })

  const rotateX = useTransform(rawY, [-1, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(rawX, [-1, 1], [-maxTilt, maxTilt])

  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  // 0-1
    const y = (e.clientY - rect.top) / rect.height   // 0-1
    rawX.set(x * 2 - 1)
    rawY.set(y * 2 - 1)
    setGlarePos({ x: x * 100, y: y * 100 })
  }

  const handleMouseEnter = () => {
    if (disabled) return
    setIsHovered(true)
    scale.set(1.02)
  }

  const handleMouseLeave = () => {
    if (disabled) return
    setIsHovered(false)
    rawX.set(0)
    rawY.set(0)
    scale.set(1)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        scale,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className={`relative ${className}`}
    >
      {children}

      {/* Glare overlay */}
      {!disabled && isHovered && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glareColor} 0%, transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  )
}
