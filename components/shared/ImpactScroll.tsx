'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'

const IMPACT_STATS = [
  { value: '$0', label: 'AWS teardown', detail: 'Full EKS deploy via Terraform + Helm, then a clean $0 teardown: AgentForge' },
  { value: '230K+', label: 'Rows pipelined', detail: 'Star-schema ETL into Azure SQL: InsightHub' },
  { value: '8×', label: 'Faster aggregation', detail: 'Columnstore index cut FactSales queries from ~8s to <1s' },
  { value: '25×', label: 'Cheaper LLM judge', detail: 'GPT-4o → GPT-4o-mini swap, zero quality drop: ASU LLM Eval' },
  { value: '6/6', label: 'Quality gates passing', detail: 'Faithfulness, hallucination rate, latency & cost - every push' },
  { value: '<90s', label: 'Itinerary generated', detail: 'Feasibility-checked plan streamed live: TravelIQ' },
]

export default function ImpactScroll() {
  const { theme } = useTheme()
  const { accent, light: isLight, mono: isTerminal } = getAccents(theme)

  if (isTerminal) return null

  const headingColor = isLight ? '#0f172a' : '#ffffff'

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
