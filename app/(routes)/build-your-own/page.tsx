'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Github, ExternalLink, ArrowLeft, Layers, Zap, Palette, Brain, Server, Globe,
} from 'lucide-react'

const REPO = 'https://github.com/PHANI465/CLONE-PORTFOLIO'

const STACK = [
  { name: 'Next.js 14', desc: 'App Router, server components, dynamic routes', icon: '⬡' },
  { name: 'TypeScript', desc: 'End-to-end type safety across all components', icon: '⟨/⟩' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling with custom CSS token system', icon: '🎨' },
  { name: 'Framer Motion', desc: 'Page transitions, scroll animations, layout effects', icon: '◎' },
  { name: 'Three.js', desc: '3D neural network background via WebGL', icon: '△' },
  { name: 'Vercel', desc: 'Zero-config deploy from git, live in minutes', icon: '▲' },
]

const STEPS = [
  {
    n: 1,
    title: 'Fork the repo',
    body: 'One click on GitHub: the repo is fully public. No template forms, no sign-ups.',
    icon: <Github size={18} />,
  },
  {
    n: 2,
    title: 'Fill in your content',
    body: 'Edit three JSON files: portfolio.json (bio, socials), projects.json, and resume.json. They never go to GitHub, fully private.',
    icon: <Layers size={18} />,
  },
  {
    n: 3,
    title: 'Pick your theme',
    body: 'Four themes ship out of the box: Glassmorphism, Minimal Professional, Bright Neon, Terminal Hacker.',
    icon: <Palette size={18} />,
  },
  {
    n: 4,
    title: 'Deploy to Vercel',
    body: 'Connect the repo in Vercel, add your .env vars, and push. Your portfolio goes live at a *.vercel.app URL instantly.',
    icon: <Globe size={18} />,
  },
]

const FEATURES = [
  { label: '9 switchable themes', icon: <Palette size={14} /> },
  { label: 'AI chat assistant (RAG)', icon: <Brain size={14} /> },
  { label: '3D neural network hero', icon: <Zap size={14} /> },
  { label: 'Command palette ⌘K', icon: <Layers size={14} /> },
  { label: 'Contact form + email', icon: <Server size={14} /> },
  { label: 'Admin dashboard', icon: <Globe size={14} /> },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
})

export default function BuildYourOwnPage() {
  return (
    <div className="min-h-screen bg-[#07090f] text-white pt-24 pb-28 px-4 relative overflow-hidden">

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Back link */}
        <motion.div {...fade(0)} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-white/35 hover:text-white/70 transition-colors">
            <ArrowLeft size={13} /> Back to portfolio
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div {...fade(0.05)} className="mb-12">
          <p className="text-xs tracking-widest text-purple-400 mb-3 font-medium uppercase">Open Source</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-none mb-4">
            Build your{' '}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8, #60a5fa)' }}>
              own portfolio
            </span>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed max-w-xl">
            This portfolio is fully open source. Fork it, swap in your content, and have your own live in under 15 minutes.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div {...fade(0.1)} className="flex flex-wrap gap-3 mb-16">
          <a href={REPO} target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-6 py-3 text-sm font-semibold rounded-xl text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              boxShadow: '0 4px 24px rgba(124,58,237,0.35)',
            }}
          >
            <Github size={16} />
            Fork on GitHub
            <ExternalLink size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href={`${REPO}#readme`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-all">
            Read the docs
          </a>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-xl font-bold text-white/90 mb-6">How it works</h2>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 + i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4 p-4 rounded-xl border border-white/8 bg-white/[0.03]"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-purple-400"
                  style={{ background: 'rgba(139,92,246,0.12)' }}>
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90 mb-0.5">
                    <span className="text-purple-400/70 mr-2 font-mono text-xs">{step.n}.</span>
                    {step.title}
                  </p>
                  <p className="text-sm text-white/45 leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-16"
        >
          <h2 className="text-xl font-bold text-white/90 mb-6">Tech stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STACK.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.48 + i * 0.05, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                className="p-4 rounded-xl border border-white/8 bg-white/[0.03] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group"
              >
                <span className="font-mono text-lg text-purple-400/70 mb-2 block">{item.icon}</span>
                <p className="text-sm font-semibold text-white/85 mb-1">{item.name}</p>
                <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-16"
        >
          <h2 className="text-xl font-bold text-white/90 mb-4">What&apos;s included</h2>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <span key={f.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/60 bg-white/[0.03]">
                <span className="text-purple-400">{f.icon}</span>
                {f.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-purple-500/20 p-8 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(99,102,241,0.04))' }}
        >
          <p className="text-2xl font-bold text-white mb-2">Ready to build yours?</p>
          <p className="text-white/50 text-sm mb-6">Fork in one click: your content stays private, only the code is open source.</p>
          <a href={REPO} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3 text-sm font-semibold rounded-xl text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              boxShadow: '0 4px 28px rgba(124,58,237,0.4)',
            }}
          >
            <Github size={16} /> Fork on GitHub
          </a>
        </motion.div>

      </div>
    </div>
  )
}
