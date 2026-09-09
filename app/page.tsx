'use client'

import { useTheme } from '@/lib/context/ThemeContext'
import TerminalHero from '@/components/themes/terminal-hacker/Hero'
import GlassHero from '@/components/themes/glassmorphism/Hero'
import MinimalHero from '@/components/themes/minimal-professional/Hero'
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

/**
 * Each theme gets its own page composition rather than one shared outline.
 *
 *  glassmorphism        the full, immersive experience: personality included
 *  minimal-professional a tight recruiter-first document: proof, then work
 *  terminal-hacker      command-line native: the hero already prints the
 *                       identity, certs and stats, so the page stays lean
 */
export default function HomePage() {
  const { theme } = useTheme()

  if (theme === 'terminal-hacker') {
    return (
      <>
        <TerminalHero portfolio={portfolio} />
        <ProjectsSection />
        <SkillsSection />
      </>
    )
  }

  if (theme === 'minimal-professional') {
    return (
      <>
        <MinimalHero portfolio={portfolio} />
        <AboutSection />
        <ImpactScroll />
        <ProjectsSection />
        <SkillsSection />
        <CertificationsSection />
      </>
    )
  }

  // glassmorphism (default)
  return (
    <>
      <GlassHero portfolio={portfolio} />
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
