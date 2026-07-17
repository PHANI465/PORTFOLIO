'use client'

import { useTheme } from '@/lib/context/ThemeContext'
import TerminalHero from '@/components/themes/terminal-hacker/Hero'
import GlassHero from '@/components/themes/glassmorphism/Hero'
import MinimalHero from '@/components/themes/minimal-professional/Hero'
import BrightNeonHero from '@/components/themes/bright-neon/Hero'
import ProjectsSection from '@/components/shared/ProjectsSection'
import SkillsSection from '@/components/shared/SkillsSection'
import BentoStrip from '@/components/shared/BentoStrip'
import AboutSection from '@/components/shared/AboutSection'
import FunFactsSection from '@/components/shared/FunFactsSection'
import ImpactScroll from '@/components/shared/ImpactScroll'
import RoleQuiz from '@/components/shared/RoleQuiz'
import CertificationsSection from '@/components/shared/CertificationsSection'
import portfolioData from '@/content/portfolio.json'
import { Portfolio } from '@/types'

const portfolio = portfolioData as Portfolio

export default function HomePage() {
  const { theme } = useTheme()

  const Hero = {
    'terminal-hacker': TerminalHero,
    'glassmorphism': GlassHero,
    'minimal-professional': MinimalHero,
    'bright-neon': BrightNeonHero,
  }[theme] ?? GlassHero

  return (
    <>
      <Hero portfolio={portfolio} />
      <AboutSection />
      <RoleQuiz />
      <ImpactScroll />
      <BentoStrip />
      <ProjectsSection />
      <SkillsSection />
      <CertificationsSection />
      <FunFactsSection />
    </>
  )
}
