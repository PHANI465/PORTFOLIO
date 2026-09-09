'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DayState } from '@/lib/challenge/types'

/* Visual language for the challenge: near-black ground, thin emerald accent,
   monospace for anything numeric, cards with a faint inner highlight so they
   read as surfaces rather than outlines. Deliberately unlike the portfolio. */

const rise = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
}

export const cardSurface =
  'rounded-xl border border-white/10 bg-white/[0.035] backdrop-blur-sm ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'

/** Numbered section heading with a rule that runs to the edge. */
export function SectionTitle({
  children, hint, index,
}: { children: ReactNode; hint?: string; index?: string }) {
  return (
    <motion.div {...rise} className="mb-7">
      <div className="flex items-baseline gap-4">
        {index && (
          <span className="font-mono text-[11px] text-emerald-300/70 tabular-nums">{index}</span>
        )}
        <h2 className="text-[11px] uppercase tracking-[0.3em] text-white/70">{children}</h2>
        <span className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
        {hint && <span className="text-[10px] text-white/30 font-mono shrink-0">{hint}</span>}
      </div>
    </motion.div>
  )
}

/** Stat as a real card, with the number as the focal point. */
export function Stat({
  label, value, sub, accent,
}: { label: string; value: ReactNode; sub?: ReactNode; accent?: boolean }) {
  return (
    <motion.div
      {...rise}
      className={`${cardSurface} group relative overflow-hidden p-4 transition-colors hover:border-white/20`}
    >
      {accent && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent"
        />
      )}
      <div className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-2">{label}</div>
      <div
        className={`font-mono tabular-nums leading-none text-[26px] md:text-[30px] ${
          accent ? 'text-emerald-300' : 'text-white'
        }`}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-white/35 mt-2">{sub}</div>}
    </motion.div>
  )
}

/** Value that is genuinely unknown. Never shows a fabricated number. */
export function NotRecorded({ label = 'not recorded' }: { label?: string }) {
  return <span className="text-white/25 text-sm italic font-sans">{label}</span>
}

/** Designed empty state, so "nothing yet" still looks intentional. */
export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      {...rise}
      className={`${cardSurface} px-6 py-10 text-center border-dashed`}
    >
      <p className="text-white/70 text-sm mb-1.5">{title}</p>
      <p className="text-white/35 text-xs max-w-sm mx-auto leading-relaxed">{body}</p>
    </motion.div>
  )
}

export function ProgressBar({ pct, tall }: { pct: number; tall?: boolean }) {
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div
      className={`relative w-full ${tall ? 'h-2.5' : 'h-1.5'} rounded-full overflow-hidden bg-white/[0.07] border border-white/10`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.5)]"
      />
    </div>
  )
}

const STATE_STYLES: Record<DayState, string> = {
  completed:     'bg-emerald-400 text-black border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.35)]',
  'in-progress': 'bg-amber-400/25 text-amber-200 border-amber-300/50',
  'no-entry':    'bg-white/[0.03] text-white/30 border-white/10',
  upcoming:      'bg-transparent text-white/15 border-white/[0.06]',
}

export const STATE_LABEL: Record<DayState, string> = {
  completed: 'Completed',
  'in-progress': 'In progress',
  'no-entry': 'No entry',
  upcoming: 'Upcoming',
}

/** The 100 day grid. Only days with an entry are links. */
export function Timeline({ states }: { states: DayState[] }) {
  return (
    <motion.div {...rise}>
      <div className={`${cardSurface} p-4 md:p-5`}>
        <div className="grid grid-cols-10 sm:grid-cols-[repeat(20,minmax(0,1fr))] gap-1.5">
          {states.map((state, i) => {
            const day = i + 1
            const clickable = state === 'completed' || state === 'in-progress'
            const cls = `aspect-square flex items-center justify-center border rounded-[4px] font-mono text-[9px] transition-all duration-200 ${STATE_STYLES[state]} ${clickable ? 'hover:scale-[1.18] hover:z-10' : ''}`
            const lbl = `Day ${day}: ${STATE_LABEL[state]}`
            if (!clickable) {
              return <div key={day} className={cls} title={lbl} aria-label={lbl}>{day}</div>
            }
            return (
              <Link key={day} href={`/challenge/day/${day}`} title={lbl} aria-label={lbl}
                className={`${cls} focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300`}>
                {day}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[10px] text-white/40">
        {(Object.keys(STATE_LABEL) as DayState[]).map(s => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-[3px] border ${STATE_STYLES[s]}`} />
            {STATE_LABEL[s]}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

/** Completion mark for a tracked category. */
export function Check({ done, label }: { done: boolean; label: string }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border px-3.5 py-3 transition-colors ${
      done ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-white/10 bg-white/[0.02]'
    }`}>
      <span className={`text-[11px] uppercase tracking-[0.12em] ${done ? 'text-emerald-200' : 'text-white/45'}`}>
        {label}
      </span>
      <span className={`font-mono text-xs ${done ? 'text-emerald-300' : 'text-white/20'}`}
        aria-label={done ? `${label}: complete` : `${label}: not complete`}>
        {done ? '✓' : '—'}
      </span>
    </div>
  )
}

/** Weight line chart. Plots only recorded points; gaps are never filled in. */
export function WeightChart({
  series, goal,
}: { series: { dayNumber: number; weightKg: number }[]; goal: number | null }) {
  if (series.length < 2) {
    return (
      <EmptyState
        title={series.length === 0 ? 'No weight recorded yet' : 'One reading so far'}
        body={
          series.length === 0
            ? 'The progression chart appears once two days have a weight logged.'
            : 'The chart needs a second reading before it can draw a line.'
        }
      />
    )
  }

  const W = 720, H = 240, pad = { t: 16, r: 16, b: 26, l: 42 }
  const xs = series.map(s => s.dayNumber)
  const ys = series.map(s => s.weightKg)
  const values = goal !== null ? [...ys, goal] : ys
  const minY = Math.min(...values) - 0.6
  const maxY = Math.max(...values) + 0.6
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)

  const px = (d: number) => pad.l + ((d - minX) / Math.max(1, maxX - minX)) * (W - pad.l - pad.r)
  const py = (w: number) => pad.t + (1 - (w - minY) / Math.max(0.0001, maxY - minY)) * (H - pad.t - pad.b)

  const path = series.map((s, i) => `${i ? 'L' : 'M'}${px(s.dayNumber).toFixed(1)},${py(s.weightKg).toFixed(1)}`).join(' ')
  const area = `${path} L${px(maxX).toFixed(1)},${(H - pad.b).toFixed(1)} L${px(minX).toFixed(1)},${(H - pad.b).toFixed(1)} Z`

  return (
    <motion.div {...rise} className={`${cardSurface} p-4 md:p-5 overflow-x-auto`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[520px] h-auto" role="img"
        aria-label={`Weight from ${ys[0]} to ${ys[ys.length - 1]} kilograms across ${series.length} recorded days`}>
        <defs>
          <linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
          <filter id="wglow"><feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map(f => {
          const w = minY + (maxY - minY) * (1 - f)
          const y = pad.t + f * (H - pad.t - pad.b)
          return (
            <g key={f}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="rgba(255,255,255,0.07)" />
              <text x={6} y={y + 3} fill="rgba(255,255,255,0.32)" fontSize="9" fontFamily="monospace">
                {w.toFixed(1)}
              </text>
            </g>
          )
        })}

        {goal !== null && goal >= minY && goal <= maxY && (
          <g>
            <line x1={pad.l} y1={py(goal)} x2={W - pad.r} y2={py(goal)}
              stroke="#5eead4" strokeDasharray="5 5" strokeOpacity="0.75" />
            <text x={W - pad.r} y={py(goal) - 6} fill="#5eead4" fontSize="9"
              fontFamily="monospace" textAnchor="end">goal {goal}</text>
          </g>
        )}

        <path d={area} fill="url(#wfill)" />
        <path d={path} fill="none" stroke="#34d399" strokeWidth="2"
          strokeLinejoin="round" strokeLinecap="round" filter="url(#wglow)" />

        {series.map(s => (
          <circle key={s.dayNumber} cx={px(s.dayNumber)} cy={py(s.weightKg)} r="3"
            fill="#07080a" stroke="#34d399" strokeWidth="1.75">
            <title>{`Day ${s.dayNumber}: ${s.weightKg} kg`}</title>
          </circle>
        ))}

        <text x={pad.l} y={H - 7} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">day {minX}</text>
        <text x={W - pad.r} y={H - 7} fill="rgba(255,255,255,0.3)" fontSize="9"
          fontFamily="monospace" textAnchor="end">day {maxX}</text>
      </svg>
    </motion.div>
  )
}
