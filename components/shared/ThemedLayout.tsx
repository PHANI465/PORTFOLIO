'use client'

import { useTheme } from '@/lib/context/ThemeContext'
import CyberpunkHeader from '@/components/themes/cyberpunk-ai/Header'
import TerminalHeader from '@/components/themes/terminal-hacker/Header'
import GlassHeader from '@/components/themes/glassmorphism/Header'
import MinimalHeader from '@/components/themes/minimal-professional/Header'
import Footer from '@/components/shared/Footer'
import AIAssistant from '@/components/assistant/AIAssistant'
import ThemeCursor from '@/components/shared/ThemeCursor'
import ScrollProgressBar from '@/components/shared/ScrollProgressBar'
import PageTransition from '@/components/effects/PageTransition'
import CommandPalette from '@/components/shared/CommandPalette'
import KonamiEgg from '@/components/shared/KonamiEgg'

interface ThemedLayoutProps {
  children: React.ReactNode
}

export default function ThemedLayout({ children }: ThemedLayoutProps) {
  const { theme } = useTheme()

  const Header = {
    'cyberpunk-ai': CyberpunkHeader,
    'terminal-hacker': TerminalHeader,
    'glassmorphism': GlassHeader,
    'minimal-professional': MinimalHeader,
    'dark-professional': GlassHeader,
    'bright-neon': MinimalHeader,
    'futuristic-space': CyberpunkHeader,
    'anime-gaming': GlassHeader,
    'retro-pixel': TerminalHeader,
  }[theme] ?? GlassHeader

  return (
    <div className="min-h-screen flex flex-col" data-theme={theme}>
      <Header />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <AIAssistant />
      <ThemeCursor />
      <ScrollProgressBar />
      <CommandPalette />
      <KonamiEgg />
    </div>
  )
}
