'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { DayState } from '@/lib/challenge/types'

/* Shared primitives for the challenge environment.
   Deliberately its own visual language: near-black ground, hairline rules,
   monospace data, generous space. No portfolio tokens are used here. */

export function Stat({
  label, value, sub, accent,
}: { label: string; value: ReactNode; sub?: ReactNode; accent?: boolean }) {
  return (
    <div className="border-t border-white/10 pt-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-1.5">{label}</div>
      <div
        className={`font-mono tabular-nums leading-none ${accent ? 'text-emerald-300' : 'text-white'} text-2xl md:text-[28px]`}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-white/35 mt-1.5">{sub}</div>}
    </div>
  )
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-6">
      <h2 className="text-[11px] uppercase tracking-[0.28em] text-white/55">{children}</h2>
      {hint && <span className="text-[10px] text-white/25 font-mono">{hint}</span>}
    </div>
  )
}

/** Value that is genuinely unknown. Never shows a fabricated number. */
export function NotRecorded({ label = 'not recorded' }: { label?: string }) {
  return <span className="text-white/25 text-sm italic font-sans">{label}</span>
}

export function ProgressBar({ pct, tall }: { pct: number; tall?: boolean }) {
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div
      className={`w-full ${tall ? 'h-2' : 'h-1'} bg-white/10 overflow-hidden rounded-full`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-[width] duration-700 ease-out motion-reduce:transition-none"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

const STATE_STYLES: Record<DayState, string> = {
  completed:     'bg-emerald-400/85 text-black border-emerald-300/60',
  'in-progress': 'bg-amber-400/25 text-amber-200 border-amber-300/40',
  'no-entry':    'bg-transparent text-white/25 border-white/10',
  upcoming:      'bg-transparent text-white/15 border-white/5',
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
    <div>
      <div className="grid grid-cols-10 sm:grid-cols-[repeat(20,minmax(0,1fr))] gap-1.5">
        {states.map((state, i) => {
          const day = i + 1
          const clickable = state === 'completed' || state === 'in-progress'
          const cls = `aspect-square flex items-center justify-center border rounded-[3px] font-mono text-[9px] transition-transform ${STATE_STYLES[state]} ${clickable ? 'hover:scale-110 focus-visible:scale-110' : ''}`
          const label = `Day ${day}: ${STATE_LABEL[state]}`

          if (!clickable) {
            return <div key={day} className={cls} title={label} aria-label={label}>{day}</div>
          }
          return (
            <Link
              key={day}
              href={`/challenge/day/${day}`}
              className={`${cls} focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300`}
              title={label}
              aria-label={label}
            >
              {day}
            </Link>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[10px] text-white/40">
        {(Object.keys(STATE_LABEL) as DayState[]).map(s => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-[2px] border ${STATE_STYLES[s]}`} />
            {STATE_LABEL[s]}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Completion mark for a tracked category. */
export function Check({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between border-t border-white/10 py-2">
      <span className="text-[11px] uppercase tracking-[0.14em] text-white/55">{label}</span>
      <span
        className={`font-mono text-xs ${done ? 'text-emerald-300' : 'text-white/20'}`}
        aria-label={done ? `${label}: complete` : `${label}: not complete`}
      >
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
      <p className="text-white/30 text-sm">
        {series.length === 0
          ? 'No weight recorded yet.'
          : 'One reading so far. The chart appears once there are two.'}
      </p>
    )
  }

  const W = 720, H = 220, pad = { t: 14, r: 14, b: 24, l: 40 }
  const xs = series.map(s => s.dayNumber)
  const ys = series.map(s => s.weightKg)
  const values = goal !== null ? [...ys, goal] : ys
  const minY = Math.min(...values) - 0.6
  const maxY = Math.max(...values) + 0.6
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)

  const px = (d: number) =>
    pad.l + ((d - minX) / Math.max(1, maxX - minX)) * (W - pad.l - pad.r)
  const py = (w: number) =>
    pad.t + (1 - (w - minY) / Math.max(0.0001, maxY - minY)) * (H - pad.t - pad.b)

  const path = series.map((s, i) => `${i ? 'L' : 'M'}${px(s.dayNumber).toFixed(1)},${py(s.weightKg).toFixed(1)}`).join(' ')
  const area = `${path} L${px(maxX).toFixed(1)},${(H - pad.b).toFixed(1)} L${px(minX).toFixed(1)},${(H - pad.b).toFixed(1)} Z`

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[520px] h-auto" role="img"
        aria-label={`Weight from ${ys[0]} to ${ys[ys.length - 1]} kilograms across ${series.length} recorded days`}>
        <defs>
          <linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map(f => {
          const w = minY + (maxY - minY) * (1 - f)
          const y = pad.t + f * (H - pad.t - pad.b)
          return (
            <g key={f}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="rgba(255,255,255,0.08)" />
              <text x={4} y={y + 3} fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">
                {w.toFixed(1)}
              </text>
            </g>
          )
        })}

        {goal !== null && goal >= minY && goal <= maxY && (
          <g>
            <line x1={pad.l} y1={py(goal)} x2={W - pad.r} y2={py(goal)}
              stroke="#5eead4" strokeDasharray="4 4" strokeOpacity="0.7" />
            <text x={W - pad.r} y={py(goal) - 5} fill="#5eead4" fontSize="9"
              fontFamily="monospace" textAnchor="end">goal {goal}</text>
          </g>
        )}

        <path d={area} fill="url(#wfill)" />
        <path d={path} fill="none" stroke="#34d399" strokeWidth="1.75"
          strokeLinejoin="round" strokeLinecap="round" />

        {series.map(s => (
          <circle key={s.dayNumber} cx={px(s.dayNumber)} cy={py(s.weightKg)} r="2.5" fill="#34d399">
            <title>{`Day ${s.dayNumber}: ${s.weightKg} kg`}</title>
          </circle>
        ))}

        <text x={pad.l} y={H - 6} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">
          day {minX}
        </text>
        <text x={W - pad.r} y={H - 6} fill="rgba(255,255,255,0.3)" fontSize="9"
          fontFamily="monospace" textAnchor="end">day {maxX}</text>
      </svg>
    </div>
  )
}
