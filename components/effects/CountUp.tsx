'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

interface CountUpProps {
  value: number
  /** rendered before the number, e.g. "$" */
  prefix?: string
  /** rendered after the number, e.g. "K+", "×", "%" */
  suffix?: string
  decimals?: number
  className?: string
  style?: React.CSSProperties
}

/** Number that counts up from 0 when scrolled into view. */
export default function CountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  style,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 })

  useEffect(() => {
    if (inView) motionVal.set(value)
  }, [inView, value, motionVal])

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`
      }
    })
    return unsub
  }, [spring, prefix, suffix, decimals])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}0{suffix}
    </span>
  )
}
