import { ThemeId, ThemeConfig } from '@/types'

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'cyberpunk-ai': {
    id: 'cyberpunk-ai',
    name: 'Cyberpunk AI',
    description: 'Neon-soaked dark interface with glitch effects and a futuristic hacker aesthetic',
    preview: '/images/themes/cyberpunk-preview.png',
    accentColor: '#00fff5',
    fontFamily: 'Orbitron',
  },
  'terminal-hacker': {
    id: 'terminal-hacker',
    name: 'Terminal Hacker',
    description: 'Classic green-on-black terminal with typewriter animations and command-line vibes',
    preview: '/images/themes/terminal-preview.png',
    accentColor: '#00ff41',
    fontFamily: 'Share Tech Mono',
  },
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
  'dark-professional': {
    id: 'dark-professional',
    name: 'Dark Professional',
    description: 'Sleek dark UI with blue accents, clean, serious, modern dark mode',
    preview: '/images/themes/dark-preview.png',
    accentColor: '#3b82f6',
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
  'futuristic-space': {
    id: 'futuristic-space',
    name: 'Futuristic Space',
    description: 'Deep space aesthetic with stars, gradients and holographic elements',
    preview: '/images/themes/space-preview.png',
    accentColor: '#6366f1',
    fontFamily: 'Rajdhani',
  },
  'anime-gaming': {
    id: 'anime-gaming',
    name: 'Anime / Gaming',
    description: 'Vibrant anime-inspired UI with gaming HUD elements and bold colors',
    preview: '/images/themes/anime-preview.png',
    accentColor: '#ff6eb4',
    fontFamily: 'Nunito',
  },
  'retro-pixel': {
    id: 'retro-pixel',
    name: 'Retro Pixel',
    description: 'Nostalgic 8-bit pixel art style with retro game UI and pixel fonts',
    preview: '/images/themes/pixel-preview.png',
    accentColor: '#ffcc00',
    fontFamily: '"Press Start 2P"',
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
