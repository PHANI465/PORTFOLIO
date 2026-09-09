/** A single logged day of the 100 day challenge. */
export interface ChallengeDay {
  id: string
  dayNumber: number
  date: string                 // ISO yyyy-mm-dd
  weightKg: number | null      // null = not recorded, never invent a value
  steps: number | null
  stepsGoalMet: boolean
  workoutCompleted: boolean
  cardioCompleted: boolean
  waterCompleted: boolean
  foodCompleted: boolean
  researchCompleted: boolean
  applicationsCount: number
  image1Url: string | null
  image2Url: string | null
  image3Url: string | null
  progressPhotoUrl: string | null
  notes: string | null
  published: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

/** Owner-editable settings. Nulls mean "not configured yet". */
export interface ChallengeConfig {
  challengeLength: number
  stepsGoal: number
  applicationsGoal: number
  startDate: string | null
  startingWeightKg: number | null
  goalWeightKg: number | null
  title: string
  intro: string | null
}

/** The seven tracked categories, in display order. */
export const CATEGORIES = [
  { key: 'stepsGoalMet',      label: '10K Steps', group: 'Fitness'  },
  { key: 'workoutCompleted',  label: 'Workout',   group: 'Fitness'  },
  { key: 'cardioCompleted',   label: 'Cardio',    group: 'Fitness'  },
  { key: 'waterCompleted',    label: 'Water',     group: 'Health'   },
  { key: 'foodCompleted',     label: 'Food',      group: 'Health'   },
  { key: 'applicationsMet',   label: 'Applications', group: 'Career' },
  { key: 'researchCompleted', label: 'Research',  group: 'Research' },
] as const

export type CategoryKey = typeof CATEGORIES[number]['key']

/** Display state for a slot on the 100 day timeline. */
export type DayState = 'completed' | 'in-progress' | 'no-entry' | 'upcoming'
