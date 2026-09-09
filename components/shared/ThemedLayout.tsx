'use client'

import { MotionConfig } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/lib/context/ThemeContext'
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
import BackToTop from '@/components/shared/BackToTop'
import InteractiveTerminal from '@/components/shared/InteractiveTerminal'

interface ThemedLayoutProps {
  children: React.ReactNode
}

export default function ThemedLayout({ children }: ThemedLayoutProps) {
  const { theme } = useTheme()
  const pathname = usePathname()

  // The 100 day challenge is intentionally a separate environment reached
  // through the terminal, so the portfolio chrome (header, footer, assistant,
  // terminal) is not rendered there.
  const isChallenge = pathname?.startsWith('/challenge') ?? false
  if (isChallenge) {
    return (
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen">{children}</div>
      </MotionConfig>
    )
  }

  const Header = {
    'terminal-hacker': TerminalHeader,
    'glassmorphism': GlassHeader,
    'minimal-professional': MinimalHeader,
  }[theme] ?? GlassHeader

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col" data-theme={theme}>
        <Header />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <AIAssistant />
        <ThemeCursor />
        <ScrollProgressBar />
        <BackToTop />
        <CommandPalette />
        <InteractiveTerminal />
        <KonamiEgg />
      </div>
    </MotionConfig>
  )
}
