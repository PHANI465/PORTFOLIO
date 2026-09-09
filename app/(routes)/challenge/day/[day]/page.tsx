import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPublishedDays, fetchConfig, isChallengeConfigured } from '@/lib/challenge/supabase'
import { categoriesCompleted } from '@/lib/challenge/analytics'
import { TOTAL_CATEGORIES } from '@/lib/challenge/config'
import { Check, SectionTitle } from '@/components/challenge/ui'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Challenge Day',
  robots: { index: false, follow: false },
}

const longDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default async function ChallengeDayPage({ params }: { params: { day: string } }) {
  const dayNumber = Number(params.day)
  if (!Number.isInteger(dayNumber) || dayNumber < 1) notFound()

  if (!isChallengeConfigured()) notFound()

  const [days, config] = await Promise.all([fetchPublishedDays(), fetchConfig()])
  const day = days.find(d => d.dayNumber === dayNumber)

  // A day with no entry is a real state, not an error.
  if (!day) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-mono text-6xl text-white/15 mb-4">
            {String(dayNumber).padStart(3, '0')}
          </p>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/45 mb-8">
            {dayNumber > config.challengeLength ? 'Beyond the challenge' : 'No entry for this day'}
          </p>
          <Link href="/challenge" className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/70 hover:text-emerald-300">
            ← back to the challenge
          </Link>
        </div>
      </main>
    )
  }

  const images = [day.image1Url, day.image2Url, day.image3Url].filter(Boolean) as string[]
  const appsMet = day.applicationsCount >= config.applicationsGoal
  const done = categoriesCompleted(day, config.applicationsGoal)

  return (
    <main className="min-h-screen bg-[#08090b] text-white antialiased">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/challenge" className="text-[11px] uppercase tracking-[0.2em] text-white/35 hover:text-white/70 transition-colors">
          ← challenge
        </Link>

        <header className="mt-10 mb-12 border-b border-white/10 pb-10">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-5xl md:text-6xl tabular-nums">
              {String(day.dayNumber).padStart(3, '0')}
            </span>
            <span className="text-white/25 font-mono text-lg">/ {config.challengeLength}</span>
          </div>
          <p className="text-white/45 mt-3 text-sm">{longDate(day.date)}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/70 mt-4">
            {done} of {TOTAL_CATEGORIES} categories complete
          </p>
        </header>

        {/* Metrics */}
        <section className="grid grid-cols-2 gap-x-10 gap-y-8 mb-14">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Weight</div>
            <div className="font-mono text-2xl">
              {day.weightKg === null
                ? <span className="text-white/25 text-base italic font-sans">not recorded</span>
                : `${day.weightKg.toFixed(1)} kg`}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Steps</div>
            <div className="font-mono text-2xl">
              {day.steps === null
                ? <span className="text-white/25 text-base italic font-sans">not recorded</span>
                : day.steps.toLocaleString()}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-14">
          <SectionTitle>Checklist</SectionTitle>
          <Check done={day.stepsGoalMet} label="10k steps" />
          <Check done={day.workoutCompleted} label="Workout" />
          <Check done={day.cardioCompleted} label="Cardio" />
          <Check done={day.waterCompleted} label="Water" />
          <Check done={day.foodCompleted} label="Food on plan" />
          <Check done={appsMet} label={`Applications (${day.applicationsCount}/${config.applicationsGoal})`} />
          <Check done={day.researchCompleted} label="Research" />
        </section>

        {/* Photos */}
        {images.length > 0 && (
          <section className="mb-14">
            <SectionTitle hint={`${images.length} photo${images.length > 1 ? 's' : ''}`}>Photos</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={`Day ${day.dayNumber}, photo ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-square object-cover rounded-lg border border-white/10 bg-white/5"
                />
              ))}
            </div>
          </section>
        )}

        {day.progressPhotoUrl && (
          <section className="mb-14">
            <SectionTitle>Progress photo</SectionTitle>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={day.progressPhotoUrl}
              alt={`Progress photo, day ${day.dayNumber}`}
              loading="lazy"
              decoding="async"
              className="w-full max-w-sm rounded-lg border border-white/10"
            />
          </section>
        )}

        {/* Notes */}
        <section className="mb-16">
          <SectionTitle>Notes</SectionTitle>
          {day.notes?.trim() ? (
            <p className="text-white/70 leading-relaxed whitespace-pre-wrap text-[15px]">{day.notes}</p>
          ) : (
            <p className="text-white/25 italic text-sm">No notes for this day.</p>
          )}
        </section>

        <nav className="flex items-center justify-between border-t border-white/10 pt-6 font-mono text-xs">
          {days.some(d => d.dayNumber === dayNumber - 1) ? (
            <Link href={`/challenge/day/${dayNumber - 1}`} className="text-white/40 hover:text-emerald-300 transition-colors">
              ← day {dayNumber - 1}
            </Link>
          ) : <span />}
          {days.some(d => d.dayNumber === dayNumber + 1) ? (
            <Link href={`/challenge/day/${dayNumber + 1}`} className="text-white/40 hover:text-emerald-300 transition-colors">
              day {dayNumber + 1} →
            </Link>
          ) : <span />}
        </nav>
      </div>
    </main>
  )
}
