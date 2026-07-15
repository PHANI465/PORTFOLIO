import { ThemeId } from '@/types'

/**
 * Theme accent tokens: TS mirror of the per-theme CSS vars in app/tokens.css.
 * Use this instead of inline `isCyber ? '#00fff5' : ...` ternaries.
 * Keep in sync with tokens.css when adding a theme.
 */
export interface ThemeAccents {
  /** primary accent, matches --accent-1 */
  accent: string
  /** secondary accent, matches --accent-2 */
  accent2: string
  /** light-surface theme (dark text on light background) */
  light: boolean
  /** monospace-identity theme (terminal / cyberpunk / retro) */
  mono: boolean
}

export const THEME_ACCENTS: Record<ThemeId, ThemeAccents> = {
  'terminal-hacker':      { accent: '#00ff41', accent2: '#ffb000', light: false, mono: true },
  'glassmorphism':        { accent: '#8b5cf6', accent2: '#14b8a6', light: false, mono: false },
  'minimal-professional': { accent: '#4f46e5', accent2: '#6366f1', light: true,  mono: false },
  'bright-neon':          { accent: '#7c3aed', accent2: '#ec4899', light: true,  mono: false },
}

export function getAccents(theme: string): ThemeAccents {
  return THEME_ACCENTS[theme as ThemeId] ?? THEME_ACCENTS['glassmorphism']
}
