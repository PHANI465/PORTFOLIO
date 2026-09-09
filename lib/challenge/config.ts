import { ChallengeConfig } from './types'

/**
 * Defaults used until the owner configures the challenge in the admin panel.
 * startDate / weights stay null on purpose: the UI shows a "not configured"
 * state rather than inventing numbers.
 */
export const DEFAULT_CONFIG: ChallengeConfig = {
  challengeLength: 100,
  stepsGoal: 10000,
  applicationsGoal: 50,
  startDate: null,
  startingWeightKg: null,
  goalWeightKg: null,
  title: '100 Day Challenge',
  intro: null,
}

/**
 * Streak rule, documented and easy to change.
 * A day counts toward the streak when at least this many of the seven
 * tracked categories are complete.
 */
export const STREAK_MIN_CATEGORIES = 5

/** Total number of tracked categories per day. */
export const TOTAL_CATEGORIES = 7

/** Milestone days that get special treatment in the UI. */
export const MILESTONES = [1, 7, 10, 25, 50, 75, 90, 100]
