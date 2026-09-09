import Link from 'next/link'
import type { Metadata } from 'next'
import { fetchPublishedDays, fetchConfig, isChallengeConfigured } from '@/lib/challenge/supabase'
import {
  totals, streaks, weightStats, weeklyBreakdown, timelineStates, currentDayNumber,
} from '@/lib/challenge/analytics'
import { MILESTONES, STREAK_MIN_CATEGORIES, TOTAL_CATEGORIES } from '@/lib/challenge/config'
import { Stat, SectionTitle, ProgressBar, Timeline, WeightChart } from '@/components/challenge/ui'

// Always read fresh so a newly published day appears immediately.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '100 Day Challenge',
  description: 'A personal experiment in discipline, health and growth.',
  // Discovery is meant to happen through the terminal, not search.
  robots: { index: false, follow: false },
}

const kg = (v: number | null | undefined) => (v === null || v === undefined ? '—' : `${v.toFixed(1)} kg`)
const num = (v: number | null | undefined) => (v === null || v === undefined ? '—' : v.toLocaleString())
const pctText = (v: number | null | undefined) => (v === null || v === undefined ? '—' : `${v}%`)

export default async function ChallengePage() {
  const configured = isChallengeConfigured()
  const [days, config] = configured
    ? await Promise.all([fetchPublishedDays(), fetchConfig()])
    : [[], null]

  if (!configured || !config) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-4">100 Day Challenge</p>
          <h1 className="text-2xl font-semibold mb-3">Not connected yet</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            The challenge database has not been configured on this deployment.
            Once the environment variables are set, this page will show the live experiment.
          </p>
        </div>
      </main>
    )
  }

  const t = totals(days, config)
  const s = streaks(days, config.applicationsGoal)
  const w = weightStats(days, config)
  const weeks = weeklyBreakdown(days, config)
  const states = timelineStates(days, config)
  const today = currentDayNumber(config)
  const started = config.startDate !== null

  const recent = [...days].sort((a, b) => b.dayNumber - a.dayNumber).slice(0, 6)

  return (
    <main className="min-h-screen bg-[#08090b] text-white antialiased">
      {/* ── Opening ─────────────────────────────────────────── */}
      <section className="relative border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(52,211,153,0.12), transparent 55%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-300/70 mb-6">
            A personal experiment
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
            {config.title}
          </h1>
          <p className="text-white/45 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            {config.intro ??
              'Discipline, health and growth, tracked one day at a time. Every number on this page comes from a real logged entry.'}
          </p>

          <div className="mt-12 max-w-xl mx-auto">
            {started ? (
              <>
                <div className="flex items-baseline justify-center gap-3 font-mono">
                  <span className="text-5xl md:text-6xl tabular-nums">
                    {String(today ?? 0).padStart(2, '0')}
                  </span>
                  <span className="text-white/30 text-2xl">/ {config.challengeLength}</span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-3 mb-6">
                  {t.completionPct}% logged · {t.daysLogged} entries
                </p>
                <ProgressBar pct={t.completionPct} tall />
              </>
            ) : (
              <p className="text-white/35 text-sm border border-white/10 rounded-lg py-6 px-4">
                The challenge has not been started yet. Once a start date is set, the day counter begins here.
              </p>
            )}
          </div>

          {(w.starting !== null || w.current !== null) && (
            <div className="mt-12 flex items-start justify-center gap-10 md:gap-16">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-2">Starting</div>
                <div className="font-mono text-xl">{kg(w.starting)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-2">Current</div>
                <div className="font-mono text-xl text-emerald-300">{kg(w.current)}</div>
              </div>
              {w.totalChange !== null && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-2">Change</div>
                  <div className="font-mono text-xl">
                    {w.totalChange <= 0 ? '↓' : '↑'} {Math.abs(w.totalChange).toFixed(1)} kg
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Dashboard ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <SectionTitle hint={`${t.daysLogged} entries`}>Dashboard</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-7">
          <Stat label="Days logged" value={t.daysLogged} sub={`${t.daysRemaining} remaining`} />
          <Stat label="Current streak" value={s.current} accent sub={`longest ${s.longest}`} />
          <Stat label="Workouts" value={t.workouts} sub={pctText(t.workoutPct)} />
          <Stat label="Cardio" value={t.cardioSessions} sub={pctText(t.cardioPct)} />
          <Stat label="Total steps" value={num(t.totalSteps)} sub={`avg ${num(t.averageSteps)}/day`} />
          <Stat label="Water" value={pctText(t.waterPct)} sub={`${t.waterDays} days`} />
          <Stat label="Food on plan" value={pctText(t.foodPct)} sub={`${t.foodDays} days`} />
          <Stat label="Applications" value={num(t.totalApplications)} sub={`goal ${config.applicationsGoal}/day`} />
          <Stat label="Research" value={pctText(t.researchPct)} sub={`${t.researchDays} days`} />
          <Stat label="Goal weight" value={kg(w.goal)} sub={w.remainingToGoal !== null ? `${Math.abs(w.remainingToGoal).toFixed(1)} kg to go` : undefined} />
          <Stat label="Lowest weight" value={kg(w.lowest)} />
          <Stat label="Consistency" value={pctText(t.consistencyScore)} accent sub="see method below" />
        </div>
      </section>

      {/* ── Timeline ────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
        <SectionTitle hint="click a logged day">Timeline</SectionTitle>
        <Timeline states={states} />
      </section>

      {/* ── Weight ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
        <SectionTitle hint={`${w.series.length} readings`}>Weight</SectionTitle>
        <WeightChart series={w.series} goal={w.goal} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-7 mt-10">
          <Stat label="Starting" value={kg(w.starting)} />
          <Stat label="Current" value={kg(w.current)} accent />
          <Stat label="Lowest" value={kg(w.lowest)} />
          <Stat label="Goal progress" value={pctText(w.goalProgressPct)} />
        </div>
      </section>

      {/* ── Weekly analysis ─────────────────────────────────── */}
      {weeks.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
          <SectionTitle hint={`${weeks.length} weeks`}>Weekly analysis</SectionTitle>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[720px] text-sm border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                  {['Week', 'Days', 'Avg weight', 'Change', 'Steps', 'Workout', 'Cardio', 'Water', 'Apps', 'Consistency'].map(h => (
                    <th key={h} className="text-left font-normal pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono text-[13px]">
                {weeks.map(wk => (
                  <tr key={wk.week} className="border-t border-white/10">
                    <td className="py-3 pr-4 text-white/70">{String(wk.week).padStart(2, '0')}</td>
                    <td className="py-3 pr-4 text-white/50">{wk.entries}/7</td>
                    <td className="py-3 pr-4">{wk.averageWeight === null ? '—' : `${wk.averageWeight} kg`}</td>
                    <td className="py-3 pr-4">
                      {wk.weightChange === null ? '—' : (
                        <span className={wk.weightChange <= 0 ? 'text-emerald-300' : 'text-amber-300'}>
                          {wk.weightChange > 0 ? '+' : ''}{wk.weightChange}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">{num(wk.totalSteps)}</td>
                    <td className="py-3 pr-4">{wk.workouts}/{wk.entries}</td>
                    <td className="py-3 pr-4">{wk.cardio}/{wk.entries}</td>
                    <td className="py-3 pr-4">{wk.water}/{wk.entries}</td>
                    <td className="py-3 pr-4">{num(wk.applications)}</td>
                    <td className="py-3 pr-4 text-emerald-300">{wk.consistencyPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Journal ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
        <SectionTitle hint={days.length ? 'most recent first' : undefined}>Journal</SectionTitle>
        {recent.length === 0 ? (
          <p className="text-white/30 text-sm">
            No days published yet. The first entry will appear here.
          </p>
        ) : (
          <div className="space-y-px">
            {recent.map(d => (
              <Link
                key={d.id}
                href={`/challenge/day/${d.dayNumber}`}
                className="group flex items-center gap-5 py-4 border-t border-white/10 hover:bg-white/[0.03] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-300"
              >
                <span className="font-mono text-white/35 text-sm w-12 shrink-0">
                  {String(d.dayNumber).padStart(3, '0')}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-white/85 truncate">
                    {d.notes?.trim() || 'No notes for this day.'}
                  </span>
                  <span className="block text-[11px] text-white/35 mt-1 font-mono">
                    {d.date}
                    {d.weightKg !== null && ` · ${d.weightKg} kg`}
                    {d.steps !== null && ` · ${d.steps.toLocaleString()} steps`}
                  </span>
                </span>
                <span className="text-white/20 group-hover:text-emerald-300 transition-colors shrink-0">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Milestones ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
        <SectionTitle>Milestones</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {MILESTONES.map(m => {
            const reached = today !== null && today >= m
            const logged = days.some(d => d.dayNumber === m)
            return (
              <span
                key={m}
                className={`px-3 py-1.5 rounded-full border font-mono text-xs ${
                  logged
                    ? 'border-emerald-300/50 text-emerald-300 bg-emerald-400/10'
                    : reached
                    ? 'border-white/20 text-white/50'
                    : 'border-white/10 text-white/20'
                }`}
              >
                Day {m}{m === 100 ? ' · the experiment complete' : ''}
              </span>
            )
          })}
        </div>
      </section>

      {/* ── Method ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
        <SectionTitle>Method</SectionTitle>
        <div className="text-sm text-white/45 leading-relaxed space-y-3 max-w-2xl">
          <p>
            Each day tracks {TOTAL_CATEGORIES} categories: 10k steps, workout, cardio, water,
            food on plan, {config.applicationsGoal} applications, and research.
          </p>
          <p>
            The consistency figure is the share of those categories completed across every logged
            day. A day counts toward a streak when at least {STREAK_MIN_CATEGORIES} of the{' '}
            {TOTAL_CATEGORIES} are complete.
          </p>
          <p className="text-white/30">
            This is a personal challenge consistency metric and is not a scientific health or
            fitness score. Days without a recorded value are left out of the relevant averages
            rather than counted as zero.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-center">
        <Link href="/" className="text-[11px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors">
          ← back to portfolio
        </Link>
      </footer>
    </main>
  )
}
