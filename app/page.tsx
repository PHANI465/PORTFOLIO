'use client'

import { useTheme } from '@/lib/context/ThemeContext'
import CyberpunkHero from '@/components/themes/cyberpunk-ai/Hero'
import TerminalHero from '@/components/themes/terminal-hacker/Hero'
import GlassHero from '@/components/themes/glassmorphism/Hero'
import MinimalHero from '@/components/themes/minimal-professional/Hero'
import ProjectsSection from '@/components/shared/ProjectsSection'
import SkillsSection from '@/components/shared/SkillsSection'
import BentoStrip from '@/components/shared/BentoStrip'
import AboutSection from '@/components/shared/AboutSection'
import FunFactsSection from '@/components/shared/FunFactsSection'
import portfolioData from '@/content/portfolio.json'
import { Portfolio } from '@/types'

const portfolio = portfolioData as Portfolio

export default function HomePage() {
  const { theme } = useTheme()

  const Hero = {
    'cyberpunk-ai': CyberpunkHero,
    'terminal-hacker': TerminalHero,
    'glassmorphism': GlassHero,
    'minimal-professional': MinimalHero,
    'futuristic-space': CyberpunkHero,
    'anime-gaming': GlassHero,
    'retro-pixel': TerminalHero,
    'dark-professional': GlassHero,
    'bright-neon': MinimalHero,
  }[theme] ?? CyberpunkHero

  return (
    <>
      <Hero portfolio={portfolio} />
      <AboutSection />
      <BentoStrip />
      <ProjectsSection />
      <SkillsSection />
      <FunFactsSection />
    </>
  )
}
