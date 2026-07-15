'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'

const IMPACT_STATS = [
  { value: '230K+', label: 'Rows pipelined', detail: 'Star-schema ETL into Azure SQL: InsightHub' },
  { value: '8×', label: 'Faster aggregation', detail: 'Columnstore index cut FactSales queries from ~8s to <1s' },
  { value: '25×', label: 'Cheaper LLM judge', detail: 'GPT-4o → GPT-4o-mini swap, zero quality drop: ASU LLM Eval' },
  { value: '6/6', label: 'Quality gates passing', detail: 'Faithfulness, hallucination rate, latency & cost - every push' },
  { value: '<90s', label: 'Itinerary generated', detail: 'Feasibility-checked plan streamed live: TravelIQ' },
]

/**
 * Scroll-scrubbed stat sequence. Pins on desktop (GSAP ScrollTrigger drives
 * a crossfade timeline tied to scroll progress); on touch, narrow, or
 * reduced-motion, renders a plain static grid instead: pinning +
 * scroll-scrub is fragile on mobile viewports and unnecessary there.
 */
export default function ImpactScroll() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLElement>(null)
  const statRefs = useRef<(HTMLDivElement | null)[]>([])
  const railRefs = useRef<(HTMLDivElement | null)[]>([])
  const [scrubEnabled, setScrubEnabled] = useState(false)
  const [ready, setReady] = useState(false)

  const { accent, light: isLight, mono: isTerminal } = getAccents(theme)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const narrow = window.matchMedia('(max-width: 1023px)').matches
    setScrubEnabled(!reduced && !coarse && !narrow)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!scrubEnabled || !sectionRef.current) return
    let cancelled = false
    let ctx: { revert: () => void } | undefined

    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled || !sectionRef.current) return
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const stats = statRefs.current.filter(Boolean) as HTMLDivElement[]
        const rails = railRefs.current.filter(Boolean) as HTMLDivElement[]
        if (!stats.length) return

        gsap.set(stats, { autoAlpha: 0, y: 24 })
        gsap.set(stats[0], { autoAlpha: 1, y: 0 })
        gsap.set(rails[0], { scaleX: 1 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${stats.length * 70}%`,
            scrub: 0.8,
          },
        })

        stats.forEach((el, i) => {
          if (i === 0) return
          tl.to(stats[i - 1], { autoAlpha: 0, y: -24, duration: 0.4 }, i - 0.5)
            .to(el, { autoAlpha: 1, y: 0, duration: 0.4 }, i - 0.5)
            .to(rails[i], { scaleX: 1, duration: 0.4 }, i - 0.5)
        })
      }, sectionRef)
    })()

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [scrubEnabled])

  if (isTerminal || !ready) return null

  const headingColor = isLight ? '#0f172a' : '#ffffff'
  const detailColor = isLight ? '#64748b' : 'rgba(255,255,255,0.5)'

  if (scrubEnabled) {
    return (
      <section
        ref={sectionRef}
        className="relative px-4"
        style={{ height: `${IMPACT_STATS.length * 80}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          <p className="text-xs tracking-widest uppercase mb-6 font-medium" style={{ color: accent }}>
            Impact, in numbers
          </p>
          <div className="relative w-full max-w-2xl h-64 flex items-center justify-center">
            {IMPACT_STATS.map((s, i) => (
              <div
                key={s.label}
                ref={(el) => { statRefs.current[i] = el }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
              >
                <span className="font-display text-6xl md:text-7xl font-bold tracking-tight" style={{ color: headingColor }}>
                  {s.value}
                </span>
                <span className="text-sm md:text-base mt-3 font-semibold" style={{ color: accent }}>
                  {s.label}
                </span>
                <span className="text-xs md:text-sm mt-2 max-w-sm" style={{ color: detailColor }}>
                  {s.detail}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-10">
            {IMPACT_STATS.map((_, i) => (
              <div
                key={i}
                className="w-8 h-1 rounded-full overflow-hidden"
                style={{ background: `${accent}20` }}
              >
                <div
                  ref={(el) => { railRefs.current[i] = el }}
                  className="h-full origin-left scale-x-0"
                  style={{ background: accent }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-widest uppercase mb-8 font-medium text-center"
          style={{ color: accent }}
        >
          Impact, in numbers
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {IMPACT_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="text-center"
            >
              <div className="font-display text-3xl md:text-4xl font-bold tracking-tight" style={{ color: headingColor }}>
                {s.value}
              </div>
              <div className="text-xs mt-1.5 font-medium" style={{ color: accent }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
