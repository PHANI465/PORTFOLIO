'use client'

import { useTheme } from '@/lib/context/ThemeContext'
import CyberpunkHero from '@/components/themes/cyberpunk-ai/Hero'
import TerminalHero from '@/components/themes/terminal-hacker/Hero'
import GlassHero from '@/components/themes/glassmorphism/Hero'
import MinimalHero from '@/components/themes/minimal-professional/Hero'
import DarkProHero from '@/components/themes/dark-professional/Hero'
import BrightNeonHero from '@/components/themes/bright-neon/Hero'
import SpaceHero from '@/components/themes/futuristic-space/Hero'
import AnimeHero from '@/components/themes/anime-gaming/Hero'
import RetroHero from '@/components/themes/retro-pixel/Hero'
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
    'futuristic-space': SpaceHero,
    'anime-gaming': AnimeHero,
    'retro-pixel': RetroHero,
    'dark-professional': DarkProHero,
    'bright-neon': BrightNeonHero,
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
