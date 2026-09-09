import { ChallengeDay, ChallengeConfig, DayState } from './types'
import { STREAK_MIN_CATEGORIES, TOTAL_CATEGORIES } from './config'

/**
 * Every derived number for the challenge lives here so no component
 * recalculates a statistic on its own.
 *
 * Rules that matter:
 *  - Missing data is never invented. A day with no weight contributes
 *    nothing to weight stats rather than being treated as zero.
 *  - Percentages are computed over days that actually have an entry,
 *    except overall completion which is over the full challenge length.
 */

/** How many of the seven categories this day completed. */
export function categoriesCompleted(d: ChallengeDay, applicationsGoal: number): number {
  return [
    d.stepsGoalMet,
    d.workoutCompleted,
    d.cardioCompleted,
    d.waterCompleted,
    d.foodCompleted,
    d.applicationsCount >= applicationsGoal,
    d.researchCompleted,
  ].filter(Boolean).length
}

/** A day counts toward a streak when it hits the documented minimum. */
export function countsForStreak(d: ChallengeDay, applicationsGoal: number): boolean {
  return categoriesCompleted(d, applicationsGoal) >= STREAK_MIN_CATEGORIES
}

/** ISO date (yyyy-mm-dd) for "today" in local time. */
export function todayISO(): string {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
}

/**
 * Which day number the challenge is on right now, from the configured
 * start date. Returns null when the challenge has not been configured.
 */
export function currentDayNumber(config: ChallengeConfig): number | null {
  if (!config.startDate) return null
  const start = new Date(config.startDate + 'T00:00:00')
  const now = new Date(todayISO() + 'T00:00:00')
  const diff = Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1
  if (diff < 1) return 0            // configured but not started yet
  return Math.min(diff, config.challengeLength)
}

export interface StreakInfo { current: number; longest: number }

/**
 * Streaks walk the day-number sequence. A gap in day numbers breaks the
 * run, as does a day that misses the category minimum.
 */
export function streaks(days: ChallengeDay[], applicationsGoal: number): StreakInfo {
  const sorted = [...days].sort((a, b) => a.dayNumber - b.dayNumber)
  let longest = 0
  let run = 0
  let prevDay: number | null = null
  let current = 0

  for (const d of sorted) {
    const consecutive = prevDay === null || d.dayNumber === prevDay + 1
    if (consecutive && countsForStreak(d, applicationsGoal)) {
      run += 1
    } else if (countsForStreak(d, applicationsGoal)) {
      run = 1
    } else {
      run = 0
    }
    longest = Math.max(longest, run)
    prevDay = d.dayNumber
    current = run
  }
  return { current, longest }
}

export interface WeightStats {
  starting: number | null
  current: number | null
  goal: number | null
  lowest: number | null
  totalChange: number | null      // negative = lost
  remainingToGoal: number | null
  goalProgressPct: number | null  // 0..100
  series: { dayNumber: number; date: string; weightKg: number }[]
}

export function weightStats(days: ChallengeDay[], config: ChallengeConfig): WeightStats {
  const series = days
    .filter(d => typeof d.weightKg === 'number')
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map(d => ({ dayNumber: d.dayNumber, date: d.date, weightKg: d.weightKg as number }))

  // Prefer the configured starting weight; fall back to the first recorded.
  const starting = config.startingWeightKg ?? (series.length ? series[0].weightKg : null)
  const current = series.length ? series[series.length - 1].weightKg : null
  const goal = config.goalWeightKg
  const lowest = series.length ? Math.min(...series.map(s => s.weightKg)) : null

  const totalChange = starting !== null && current !== null ? +(current - starting).toFixed(2) : null
  const remainingToGoal = goal !== null && current !== null ? +(current - goal).toFixed(2) : null

  let goalProgressPct: number | null = null
  if (starting !== null && goal !== null && current !== null && starting !== goal) {
    const pct = ((starting - current) / (starting - goal)) * 100
    goalProgressPct = Math.max(0, Math.min(100, +pct.toFixed(1)))
  }

  return { starting, current, goal, lowest, totalChange, remainingToGoal, goalProgressPct, series }
}

export interface Totals {
  daysLogged: number
  daysRemaining: number
  completionPct: number        // over the whole challenge length
  workouts: number
  cardioSessions: number
  totalSteps: number
  averageSteps: number | null
  waterDays: number
  foodDays: number
  researchDays: number
  totalApplications: number
  stepsGoalDays: number
  workoutPct: number | null
  cardioPct: number | null
  waterPct: number | null
  foodPct: number | null
  researchPct: number | null
  applicationsGoalPct: number | null
  consistencyScore: number | null   // 0..100 across all logged days
}

const pct = (n: number, d: number) => (d > 0 ? +((n / d) * 100).toFixed(1) : null)

export function totals(days: ChallengeDay[], config: ChallengeConfig): Totals {
  const n = days.length
  const stepDays = days.filter(d => typeof d.steps === 'number')
  const totalSteps = stepDays.reduce((s, d) => s + (d.steps as number), 0)

  const workouts = days.filter(d => d.workoutCompleted).length
  const cardio = days.filter(d => d.cardioCompleted).length
  const water = days.filter(d => d.waterCompleted).length
  const food = days.filter(d => d.foodCompleted).length
  const research = days.filter(d => d.researchCompleted).length
  const stepsGoalDays = days.filter(d => d.stepsGoalMet).length
  const appsGoalDays = days.filter(d => d.applicationsCount >= config.applicationsGoal).length
  const totalApplications = days.reduce((s, d) => s + d.applicationsCount, 0)

  const completedCats = days.reduce((s, d) => s + categoriesCompleted(d, config.applicationsGoal), 0)
  const consistencyScore = n > 0 ? +((completedCats / (n * TOTAL_CATEGORIES)) * 100).toFixed(1) : null

  return {
    daysLogged: n,
    daysRemaining: Math.max(0, config.challengeLength - n),
    completionPct: +((n / config.challengeLength) * 100).toFixed(1),
    workouts,
    cardioSessions: cardio,
    totalSteps,
    averageSteps: stepDays.length ? Math.round(totalSteps / stepDays.length) : null,
    waterDays: water,
    foodDays: food,
    researchDays: research,
    totalApplications,
    stepsGoalDays,
    workoutPct: pct(workouts, n),
    cardioPct: pct(cardio, n),
    waterPct: pct(water, n),
    foodPct: pct(food, n),
    researchPct: pct(research, n),
    applicationsGoalPct: pct(appsGoalDays, n),
    consistencyScore,
  }
}

export interface WeekSummary {
  week: number
  dayFrom: number
  dayTo: number
  entries: number
  averageWeight: number | null
  weightChange: number | null
  totalSteps: number
  averageSteps: number | null
  workouts: number
  cardio: number
  water: number
  food: number
  research: number
  applications: number
  consistencyPct: number | null
}

/** Groups logged days into weeks of 7 by day number. */
export function weeklyBreakdown(days: ChallengeDay[], config: ChallengeConfig): WeekSummary[] {
  const weeks = Math.ceil(config.challengeLength / 7)
  const out: WeekSummary[] = []

  for (let w = 1; w <= weeks; w++) {
    const from = (w - 1) * 7 + 1
    const to = Math.min(w * 7, config.challengeLength)
    const inWeek = days.filter(d => d.dayNumber >= from && d.dayNumber <= to)
    if (!inWeek.length) continue

    const withWeight = inWeek.filter(d => typeof d.weightKg === 'number')
      .sort((a, b) => a.dayNumber - b.dayNumber)
    const avgWeight = withWeight.length
      ? +(withWeight.reduce((s, d) => s + (d.weightKg as number), 0) / withWeight.length).toFixed(2)
      : null
    const weightChange = withWeight.length >= 2
      ? +((withWeight[withWeight.length - 1].weightKg as number) - (withWeight[0].weightKg as number)).toFixed(2)
      : null

    const stepDays = inWeek.filter(d => typeof d.steps === 'number')
    const totalSteps = stepDays.reduce((s, d) => s + (d.steps as number), 0)
    const cats = inWeek.reduce((s, d) => s + categoriesCompleted(d, config.applicationsGoal), 0)

    out.push({
      week: w,
      dayFrom: from,
      dayTo: to,
      entries: inWeek.length,
      averageWeight: avgWeight,
      weightChange,
      totalSteps,
      averageSteps: stepDays.length ? Math.round(totalSteps / stepDays.length) : null,
      workouts: inWeek.filter(d => d.workoutCompleted).length,
      cardio: inWeek.filter(d => d.cardioCompleted).length,
      water: inWeek.filter(d => d.waterCompleted).length,
      food: inWeek.filter(d => d.foodCompleted).length,
      research: inWeek.filter(d => d.researchCompleted).length,
      applications: inWeek.reduce((s, d) => s + d.applicationsCount, 0),
      consistencyPct: +((cats / (inWeek.length * TOTAL_CATEGORIES)) * 100).toFixed(1),
    })
  }
  return out
}

/** Display state for every slot on the 100 day timeline. */
export function timelineStates(days: ChallengeDay[], config: ChallengeConfig): DayState[] {
  const byNumber = new Map(days.map(d => [d.dayNumber, d]))
  const today = currentDayNumber(config)
  const states: DayState[] = []

  for (let n = 1; n <= config.challengeLength; n++) {
    const entry = byNumber.get(n)
    if (entry) {
      states.push(
        countsForStreak(entry, config.applicationsGoal) ? 'completed' : 'in-progress'
      )
    } else if (today === null) {
      states.push('upcoming')          // challenge not configured yet
    } else if (n > today) {
      states.push('upcoming')
    } else {
      states.push('no-entry')
    }
  }
  return states
}
