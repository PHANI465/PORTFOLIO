// ============================================================
// CORE TYPE DEFINITIONS
// ============================================================

export type ThemeId =
  | 'cyberpunk-ai'
  | 'terminal-hacker'
  | 'glassmorphism'
  | 'minimal-professional'
  | 'dark-professional'
  | 'bright-neon'
  | 'futuristic-space'
  | 'anime-gaming'
  | 'retro-pixel'

export interface ThemeConfig {
  id: ThemeId
  name: string
  description: string
  preview: string
  accentColor: string
  fontFamily: string
}

// ---- Portfolio ----
export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface Portfolio {
  name: string
  title: string
  tagline: string
  bio: string
  email: string
  phone: string
  location: string
  avatar: string
  resumeUrl: string
  defaultTheme: ThemeId
  socials: SocialLink[]
  openToWork: boolean
  availability: string
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
  }
}

// ---- Projects ----
export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tech: string[]
  category: string
  featured: boolean
  image: string
  github?: string
  demo?: string
  status: 'completed' | 'in-progress' | 'archived'
  highlights: string[]
  date: string
}

// ---- Resume / Experience ----
export interface ExperienceItem {
  id: string
  role: string
  organization: string
  type: 'work' | 'education' | 'volunteer'
  location: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  highlights: string[]
  skills?: string[]
  gpa?: string
}

export interface SkillCategory {
  category: string
  icon: string
  skills: string[]
}

export interface Achievement {
  id: string
  title: string
  organization: string
  date: string
  description: string
  icon: string
}

export interface Resume {
  experience: ExperienceItem[]
  education: ExperienceItem[]
  skills: SkillCategory[]
  achievements: Achievement[]
  certifications: Array<{
    name: string
    issuer: string
    date: string
    url?: string
  }>
}

// ---- Blog ----
export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  tags: string[]
  category: string
  readingTime: number
  published: boolean
  coverImage?: string
}

// ---- AI Assistant ----
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface AssistantConfig {
  name: string
  personality: string
  systemPrompt: string
  welcomeMessage: string
  avatar: string
  idleMessages: string[]
}

// ---- Contact ----
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}
