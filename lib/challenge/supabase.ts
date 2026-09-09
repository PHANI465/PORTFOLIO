import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ChallengeDay, ChallengeConfig } from './types'
import { DEFAULT_CONFIG } from './config'

/**
 * Two clients, deliberately separated:
 *
 *  publicClient  - anon key. Row Level Security limits it to SELECT on
 *                  published rows. Safe to use for public reads.
 *  adminClient   - service-role key. Bypasses RLS, so it is created only
 *                  inside server route handlers and its key is never sent
 *                  to the browser (no NEXT_PUBLIC_ prefix).
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const isChallengeConfigured = () => Boolean(url && anonKey)

export function publicClient(): SupabaseClient | null {
  if (!url || !anonKey) return null
  return createClient(url, anonKey, { auth: { persistSession: false } })
}

export function adminClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

/* ---------------------------------------------------------------- *
 * Row <-> domain mapping. Keeps snake_case confined to this file.   *
 * ---------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToDay(r: any): ChallengeDay {
  return {
    id: r.id,
    dayNumber: r.day_number,
    date: r.date,
    weightKg: r.weight_kg === null || r.weight_kg === undefined ? null : Number(r.weight_kg),
    steps: r.steps ?? null,
    stepsGoalMet: !!r.steps_goal_met,
    workoutCompleted: !!r.workout_completed,
    cardioCompleted: !!r.cardio_completed,
    waterCompleted: !!r.water_completed,
    foodCompleted: !!r.food_completed,
    researchCompleted: !!r.research_completed,
    applicationsCount: r.applications_count ?? 0,
    image1Url: r.image1_url ?? null,
    image2Url: r.image2_url ?? null,
    image3Url: r.image3_url ?? null,
    progressPhotoUrl: r.progress_photo_url ?? null,
    notes: r.notes ?? null,
    published: !!r.published,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    publishedAt: r.published_at ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dayToRow(d: Partial<ChallengeDay>): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: Record<string, any> = {}
  const set = (k: string, v: unknown) => { if (v !== undefined) row[k] = v }
  set('day_number', d.dayNumber)
  set('date', d.date)
  set('weight_kg', d.weightKg)
  set('steps', d.steps)
  set('steps_goal_met', d.stepsGoalMet)
  set('workout_completed', d.workoutCompleted)
  set('cardio_completed', d.cardioCompleted)
  set('water_completed', d.waterCompleted)
  set('food_completed', d.foodCompleted)
  set('research_completed', d.researchCompleted)
  set('applications_count', d.applicationsCount)
  set('image1_url', d.image1Url)
  set('image2_url', d.image2Url)
  set('image3_url', d.image3Url)
  set('progress_photo_url', d.progressPhotoUrl)
  set('notes', d.notes)
  set('published', d.published)
  set('published_at', d.publishedAt)
  return row
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToConfig(r: any): ChallengeConfig {
  if (!r) return DEFAULT_CONFIG
  return {
    challengeLength: r.challenge_length ?? DEFAULT_CONFIG.challengeLength,
    stepsGoal: r.steps_goal ?? DEFAULT_CONFIG.stepsGoal,
    applicationsGoal: r.applications_goal ?? DEFAULT_CONFIG.applicationsGoal,
    startDate: r.start_date ?? null,
    startingWeightKg: r.starting_weight_kg === null || r.starting_weight_kg === undefined
      ? null : Number(r.starting_weight_kg),
    goalWeightKg: r.goal_weight_kg === null || r.goal_weight_kg === undefined
      ? null : Number(r.goal_weight_kg),
    title: r.title ?? DEFAULT_CONFIG.title,
    intro: r.intro ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function configToRow(c: Partial<ChallengeConfig>): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: Record<string, any> = {}
  const set = (k: string, v: unknown) => { if (v !== undefined) row[k] = v }
  set('challenge_length', c.challengeLength)
  set('steps_goal', c.stepsGoal)
  set('applications_goal', c.applicationsGoal)
  set('start_date', c.startDate)
  set('starting_weight_kg', c.startingWeightKg)
  set('goal_weight_kg', c.goalWeightKg)
  set('title', c.title)
  set('intro', c.intro)
  return row
}

/* ---------------------------------------------------------------- *
 * Public reads. Return empty rather than throwing so the page can   *
 * render an honest "not configured / no entries" state.             *
 * ---------------------------------------------------------------- */

export async function fetchPublishedDays(): Promise<ChallengeDay[]> {
  const sb = publicClient()
  if (!sb) return []
  const { data, error } = await sb
    .from('challenge_days')
    .select('*')
    .eq('published', true)
    .order('day_number', { ascending: true })
  if (error) {
    console.error('[challenge] fetchPublishedDays:', error.message)
    return []
  }
  return (data ?? []).map(rowToDay)
}

export async function fetchConfig(): Promise<ChallengeConfig> {
  const sb = publicClient()
  if (!sb) return DEFAULT_CONFIG
  const { data, error } = await sb.from('challenge_config').select('*').eq('id', 1).maybeSingle()
  if (error) {
    console.error('[challenge] fetchConfig:', error.message)
    return DEFAULT_CONFIG
  }
  return rowToConfig(data)
}
