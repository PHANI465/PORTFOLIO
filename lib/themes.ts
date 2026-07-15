import { ThemeId, ThemeConfig } from '@/types'

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'glassmorphism': {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass cards with soft gradients and a clean modern aesthetic',
    preview: '/images/themes/glass-preview.png',
    accentColor: '#8b5cf6',
    fontFamily: 'Inter',
  },
  'minimal-professional': {
    id: 'minimal-professional',
    name: 'Minimal Professional',
    description: 'Clean white layout focused on readability, light mode, crisp typography',
    preview: '/images/themes/minimal-preview.png',
    accentColor: '#0f172a',
    fontFamily: 'Inter',
  },
  'bright-neon': {
    id: 'bright-neon',
    name: 'Bright Neon',
    description: 'Light background with vivid purple accents, energetic and bold',
    preview: '/images/themes/bright-preview.png',
    accentColor: '#7c3aed',
    fontFamily: 'Inter',
  },
  'terminal-hacker': {
    id: 'terminal-hacker',
    name: 'Terminal Hacker',
    description: 'Classic green-on-black terminal with typewriter animations and command-line vibes',
    preview: '/images/themes/terminal-preview.png',
    accentColor: '#00ff41',
    fontFamily: 'Share Tech Mono',
  },
}

export const DEFAULT_THEME: ThemeId = 'glassmorphism'

export function getThemeConfig(id: ThemeId): ThemeConfig {
  return THEMES[id] ?? THEMES[DEFAULT_THEME]
}

export function isValidTheme(id: string): id is ThemeId {
  return id in THEMES
}

export const THEME_LIST = Object.values(THEMES)
