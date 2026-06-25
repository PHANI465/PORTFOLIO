'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/lib/context/ThemeContext'
import { ExternalLink, Github, ChevronRight, CheckCircle, Copy, Check, Menu, X } from 'lucide-react'

const GITHUB_URL = 'https://github.com/PHANI465/CLONE-PORTFOLIO'

// ── Nav sections ──────────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',      label: 'Overview',             emoji: '🚀' },
  { id: 'privacy',       label: 'Privacy & Safety',     emoji: '🔒' },
  { id: 'setup',         label: 'Setup Guide',          emoji: '⚙️' },
  { id: 'github-upload', label: 'Upload to GitHub',     emoji: '📤' },
  { id: 'faq',           label: 'Common Questions',     emoji: '❓' },
  { id: 'disable-ai',    label: 'Disable AI Chat',      emoji: '🤖' },
  { id: 'next-steps',    label: "What's Next",          emoji: '🔮' },
]

// ── Tiny components ───────────────────────────────────────────────────────────
function useAccent() {
  const { theme } = useTheme()
  const isLight = theme === 'minimal-professional' || theme === 'bright-neon'
  const isCyber = theme === 'cyberpunk-ai'
  const isTerminal = theme === 'terminal-hacker'
  return {
    accent:  isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#4f46e5' : '#a78bfa',
    accent2: isCyber ? '#ff0090' : isTerminal ? '#ffb000' : isLight ? '#6366f1' : '#7c3aed',
    isLight, isCyber, isTerminal,
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="p-1.5 rounded-lg transition-all hover:bg-white/10">
      {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} className="opacity-40" />}
    </button>
  )
}

function Code({ children, copy = true }: { children: string; copy?: boolean }) {
  return (
    <div className="relative group my-2.5">
      <pre className="text-[12px] px-4 py-3 rounded-xl overflow-x-auto font-mono leading-relaxed pr-10"
        style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)', color: '#a5f3fc' }}>
        {children}
      </pre>
      {copy && <div className="absolute top-2 right-2"><CopyButton text={children} /></div>}
    </div>
  )
}

function Accordion({ title, emoji, children, defaultOpen = false }: {
  title: string; emoji: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const { accent, isLight } = useAccent()
  return (
    <div className="mb-3 rounded-2xl overflow-hidden border"
      style={{ borderColor: `${accent}25`, background: open ? `${accent}06` : 'transparent' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-white/5">
        <span className="text-lg flex-shrink-0">{emoji}</span>
        <span className="flex-1 font-semibold text-sm" style={{ color: isLight ? '#1e293b' : '#fff' }}>{title}</span>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight size={15} style={{ color: accent }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className="overflow-hidden">
            <div className="px-5 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  const { accent, isLight } = useAccent()
  return (
    <div className="flex gap-4 mb-7">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)`, color: '#fff' }}>{n}</div>
        <div className="flex-1 w-px mt-2" style={{ background: `${accent}20` }} />
      </div>
      <div className="flex-1 pb-4">
        <h3 className="font-bold text-sm mb-2.5" style={{ color: isLight ? '#0f172a' : '#fff' }}>{title}</h3>
        <div className="text-sm leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.65)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  const { isLight } = useAccent()
  return (
    <div className="flex gap-2 p-3 rounded-xl my-2.5 text-xs"
      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: isLight ? '#166534' : '#86efac' }}>
      <span className="flex-shrink-0">💡</span><span>{children}</span>
    </div>
  )
}

function Warn({ children }: { children: React.ReactNode }) {
  const { isLight } = useAccent()
  return (
    <div className="flex gap-2 p-3 rounded-xl my-2.5 text-xs"
      style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: isLight ? '#92400e' : '#fde68a' }}>
      <span className="flex-shrink-0">⚠️</span><span>{children}</span>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  const { isLight } = useAccent()
  return <p className="mb-2.5 text-sm leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.65)' }}>{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  const { accent, isLight } = useAccent()
  return (
    <li className="flex gap-2 mb-1.5 text-sm" style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.65)' }}>
      <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: accent }} /><span>{children}</span>
    </li>
  )
}

function SectionTitle({ id, emoji, children }: { id: string; emoji: string; children: React.ReactNode }) {
  const { accent2, isCyber, isTerminal } = useAccent()
  return (
    <h2 id={id} className="text-xl font-bold mb-5 flex items-center gap-2 scroll-mt-28"
      style={{ color: accent2, fontFamily: isCyber || isTerminal ? 'monospace' : undefined }}>
      <span>{emoji}</span>{children}
    </h2>
  )
}

// ── Sticky sidebar ────────────────────────────────────────────────────────────
function Sidebar({ activeId }: { activeId: string }) {
  const { accent, accent2, isLight } = useAccent()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = (
    <nav className="space-y-0.5">
      {NAV.map(item => {
        const isActive = activeId === item.id
        return (
          <a key={item.id} href={`#${item.id}`}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all group"
            style={{
              background: isActive ? `${accent}15` : 'transparent',
              color: isActive ? accent : isLight ? '#64748b' : 'rgba(255,255,255,0.45)',
              fontWeight: isActive ? 600 : 400,
              borderLeft: isActive ? `2px solid ${accent}` : '2px solid transparent',
            }}>
            <span className="text-sm">{item.emoji}</span>
            <span className="leading-tight">{item.label}</span>
            {isActive && (
              <motion.div layoutId="sidebarDot" className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: accent }} />
            )}
          </a>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-52 flex-shrink-0">
        <div className="sticky top-28">
          <p className="text-[10px] font-bold tracking-widest mb-3 px-3"
            style={{ color: `${accent2}70` }}>ON THIS PAGE</p>
          {links}
        </div>
      </aside>

      {/* Mobile floating TOC button */}
      <div className="lg:hidden fixed bottom-24 left-4 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}>
          {mobileOpen ? <X size={16} color="#fff" /> : <Menu size={16} color="#fff" />}
        </motion.button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-12 left-0 w-52 rounded-2xl p-3 shadow-2xl"
              style={{
                background: isLight ? '#fff' : 'rgba(15,10,30,0.97)',
                border: `1px solid ${accent}30`,
                backdropFilter: 'blur(20px)',
              }}>
              {links}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function DocsClient() {
  const { accent, accent2, isLight, isCyber, isTerminal } = useAccent()
  const [activeId, setActiveId] = useState('overview')

  const cardCls = isLight
    ? 'border border-slate-100 bg-white rounded-2xl'
    : 'border border-white/10 glass-card rounded-2xl'

  // IntersectionObserver to track active section
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id) })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    NAV.forEach(item => {
      const el = document.getElementById(item.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-28 px-4 relative">
      {!isLight && (
        <motion.div className="fixed top-32 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent}05 0%, transparent 70%)`, filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} />
      )}

      {/* ── Two-column layout ── */}
      <div className="max-w-5xl mx-auto relative z-10 flex gap-10">

        <Sidebar activeId={activeId} />

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-10">
            <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="text-xs tracking-widest mb-2 font-medium"
              style={{ color: accent, fontFamily: isCyber || isTerminal ? 'monospace' : undefined }}>
              {isTerminal ? '$ cat MAKE_YOUR_OWN.md' : isCyber ? '>> CREATE.SYS' : 'Open Source'}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
              className="text-4xl font-bold tracking-tight mb-3"
              style={{
                color: isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#0f172a' : '#fff',
                fontFamily: isCyber ? 'Orbitron, monospace' : isTerminal ? 'Share Tech Mono, monospace' : undefined,
                textShadow: isCyber ? '0 0 24px rgba(0,255,245,0.35)' : undefined,
              }}>
              {isCyber ? 'CREATE YOUR OWN' : 'Create Your Own Portfolio'}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-sm leading-relaxed" style={{ color: `${accent}80` }}>
              Fork → fill in your details → deploy free in under an hour. No React knowledge needed.
            </motion.p>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-4 h-px origin-left" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
          </motion.div>

          {/* ── Overview ── */}
          <section id="overview" className="scroll-mt-28 mb-12">
            <SectionTitle id="overview" emoji="🚀">Overview</SectionTitle>
            <div className={`p-5 ${cardCls} mb-4`} style={{ boxShadow: `0 0 24px ${accent}10` }}>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <p className="font-bold text-sm mb-1.5" style={{ color: isLight ? '#0f172a' : '#fff' }}>What is this?</p>
                  <P>This portfolio is open-source, anyone can clone it from GitHub, replace the content with their own info, and have a live AI-powered portfolio. When you clone it, you get placeholder files ("Your Name", fake projects). You replace those, add API keys, and deploy.</P>
                  <P>This guide walks you through every step, including how to keep your repo <strong>private</strong> on GitHub until you're ready to share it.</P>
                </div>
              </div>
            </div>
            <div className={`p-4 flex items-center justify-between gap-4 ${cardCls}`}>
              <div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: isLight ? '#1e293b' : '#fff' }}>📂 GitHub Repository</p>
                <p className="text-xs" style={{ color: `${accent}70` }}>Link will be updated soon</p>
              </div>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl flex-shrink-0"
                  style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}35` }}>
                  <Github size={14} />GitHub<ExternalLink size={11} />
                </motion.div>
              </a>
            </div>
          </section>

          {/* ── Privacy ── */}
          <section id="privacy" className="scroll-mt-28 mb-12">
            <SectionTitle id="privacy" emoji="🔒">Privacy & Safety</SectionTitle>
            <div className={`p-5 ${cardCls}`}>
              <ul className="space-y-2">
                <Li>The repo contains <strong>placeholder files</strong> with fake data, "Your Name", fake projects, sample resume. That's all anyone who clones sees.</Li>
                <Li>Your real files (<code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>portfolio.json</code>, <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>resume.json</code>, <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>projects.json</code>) are in <strong>.gitignore</strong>, they are never uploaded to GitHub.</Li>
                <Li>Your API keys live in <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>.env.local</code> which is also gitignored, never committed, ever.</Li>
                <Li>After <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>npm install</code>, a setup script auto-copies the example files into your real files. You edit those, your data never touches GitHub.</Li>
              </ul>
            </div>
          </section>

          {/* ── Setup Guide ── */}
          <section id="setup" className="scroll-mt-28 mb-12">
            <SectionTitle id="setup" emoji="⚙️">Setup Guide</SectionTitle>

            <Step n={1} title="Install the tools (one-time)">
              <ul className="space-y-1.5 mb-2">
                <Li><strong>Node.js</strong>, <a href="https://nodejs.org" target="_blank" className="underline" style={{ color: accent }}>nodejs.org</a> → click "LTS" → install. Runs JavaScript on your computer.</Li>
                <Li><strong>Git</strong>, <a href="https://git-scm.com" target="_blank" className="underline" style={{ color: accent }}>git-scm.com</a> → download and install. Needed to clone the code.</Li>
                <Li><strong>VS Code</strong> (editor), <a href="https://code.visualstudio.com" target="_blank" className="underline" style={{ color: accent }}>code.visualstudio.com</a>, free, beginner friendly.</Li>
              </ul>
              <Tip>Check Node is installed: open a terminal and type <code className="px-1 rounded text-xs" style={{ background: 'rgba(0,0,0,0.3)' }}>node --version</code>. You should see v18 or higher.</Tip>
            </Step>

            <Step n={2} title="Clone the repo">
              <Code>{`git clone ${GITHUB_URL}\ncd phaneendra-portfolio`}</Code>
              <Tip>In VS Code: File → Open Folder → select the phaneendra-portfolio folder.</Tip>
            </Step>

            <Step n={3} title="Install and auto-setup content files">
              <Code>npm install</Code>
              <P>This installs all libraries AND runs a setup script that copies the example files to real files:</P>
              <ul className="space-y-1 mb-2 text-xs font-mono" style={{ color: `${accent}80` }}>
                <li>portfolio.example.json → portfolio.json</li>
                <li>resume.example.json → resume.json</li>
                <li>projects.example.json → projects.json</li>
              </ul>
              <P>These real files are what the site reads. They are gitignored, your data never goes to GitHub.</P>
              <Warn>Errors? Make sure you're inside the project folder in the terminal, and Node.js is installed.</Warn>
            </Step>

            <Step n={4} title="Get your API keys (all free tiers available)">
              <Accordion emoji="🤖" title="OpenAI: powers the AI chat" defaultOpen>
                <ul className="space-y-1.5">
                  <Li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" className="underline" style={{ color: accent }}>platform.openai.com/api-keys</a> → sign up</Li>
                  <Li>Click "Create new secret key" → copy it (starts with <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>sk-</code>)</Li>
                  <Li>Add $5 minimum credit to your account, GPT-4o is very cheap, lasts months</Li>
                </ul>
                <Warn>You can only see the key once. Copy it before closing the window.</Warn>
              </Accordion>
              <Accordion emoji="🧠" title="Pinecone: AI memory & search">
                <ul className="space-y-1.5">
                  <Li><a href="https://app.pinecone.io" target="_blank" className="underline" style={{ color: accent }}>app.pinecone.io</a> → sign up free (no card)</Li>
                  <Li>API Keys in sidebar → copy the default key</Li>
                  <Li>Indexes → Create Index → name: <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>portfolio</code>, Dimensions: <strong>1536</strong>, Metric: <strong>cosine</strong></Li>
                </ul>
              </Accordion>
              <Accordion emoji="📧" title="Resend: contact form emails">
                <ul className="space-y-1.5">
                  <Li><a href="https://resend.com" target="_blank" className="underline" style={{ color: accent }}>resend.com</a> → sign up free, no card</Li>
                  <Li>API Keys → Create API Key → copy (starts with <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>re_</code>)</Li>
                </ul>
                <Tip>Skip Resend if you want, messages still save locally to data/contacts.json.</Tip>
              </Accordion>
            </Step>

            <Step n={5} title="Set up environment variables">
              <Code>cp .env.local.example .env.local</Code>
              <P>Open <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>.env.local</code> and fill in:</P>
              <Code copy={false}>{`OPENAI_API_KEY=sk-your-key-here\nPINECONE_API_KEY=your-pinecone-key\nPINECONE_INDEX=portfolio\nRESEND_API_KEY=re_your-key-here\nCONTACT_TO_EMAIL=your.email@gmail.com`}</Code>
              <Warn>.env.local is in .gitignore, it will NEVER go to GitHub. Windows: use `copy` instead of `cp`.</Warn>
            </Step>

            <Step n={6} title="Fill in your personal content">
              <Accordion emoji="👤" title="content/portfolio.json: name, bio, links">
                <Code copy={false}>{`{\n  "name": "Your Full Name",\n  "title": "Your Role · Another Role",\n  "tagline": "One punchy sentence",\n  "bio": "2-3 sentence bio",\n  "email": "you@email.com",\n  "social": {\n    "github": "https://github.com/your-username",\n    "linkedin": "https://linkedin.com/in/you"\n  }\n}`}</Code>
              </Accordion>
              <Accordion emoji="📋" title="content/resume.json: experience, skills, education">
                <P>Edit the experience, education, skills, and achievements arrays. Each entry needs a unique <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>id</code>.</P>
              </Accordion>
              <Accordion emoji="🗂️" title="content/projects.json: your projects">
                <P>Array of project objects. The <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>id</code> field becomes the URL (<code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>/projects/your-id</code>). Set <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>featured: true</code> for homepage.</P>
              </Accordion>
              <Accordion emoji="🤖" title="lib/ai-assistant.ts, what the AI knows">
                <P>Find <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>SYSTEM_PROMPT</code> near the top and rewrite it to describe yourself. The more detail, the better the AI's answers.</P>
              </Accordion>
            </Step>

            <Step n={7} title="Index content into Pinecone">
              <Code>npm run index-content</Code>
              <Tip>Re-run this every time you update your content files to keep the AI up to date.</Tip>
            </Step>

            <Step n={8} title="Preview locally">
              <Code>npm run dev</Code>
              <P>Open <a href="http://localhost:3000" target="_blank" className="underline" style={{ color: accent }}>localhost:3000</a>. Content file changes auto-reload, no restart needed.</P>
            </Step>

            <Step n={9} title="Deploy to Vercel">
              <P>See the "Upload to GitHub" section below first, then come back here.</P>
              <ul className="space-y-1.5">
                <Li>Go to <a href="https://vercel.com" target="_blank" className="underline" style={{ color: accent }}>vercel.com</a> → sign in with GitHub → Add New Project → select your repo → Deploy</Li>
                <Li>Go to Project → Settings → Environment Variables → add all keys from .env.local</Li>
                <Li>Click Redeploy, AI chat and email now work on your live site</Li>
              </ul>
              <Warn>Add env variables on Vercel or the AI chat and contact form won't work on the live site.</Warn>
              <Tip>Your live URL: your-project.vercel.app, you can set a custom domain for free in Vercel settings.</Tip>
            </Step>
          </section>

          {/* ── GitHub Upload ── */}
          <section id="github-upload" className="scroll-mt-28 mb-12">
            <SectionTitle id="github-upload" emoji="📤">Upload to GitHub (Private First)</SectionTitle>

            <div className="p-4 mb-5 rounded-2xl"
              style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#fde68a' }}>⭐ Keep it private until you're ready</p>
              <p className="text-xs" style={{ color: 'rgba(253,230,138,0.7)' }}>
                GitHub lets you create private repositories, only you can see them. You can make it public at any time with one click. This is the recommended approach while you're still building and customizing.
              </p>
            </div>

            <Step n={1} title="Create a GitHub account (if you don't have one)">
              <ul className="space-y-1.5">
                <Li>Go to <a href="https://github.com" target="_blank" className="underline" style={{ color: accent }}>github.com</a> → click <strong>Sign up</strong></Li>
                <Li>Enter your email, create a password, and choose a username, this appears in your repo URL, so pick something clean (e.g. <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>your-name</code>)</Li>
                <Li>Verify your email address before continuing</Li>
              </ul>
            </Step>

            <Step n={2} title="Create a new PRIVATE repository">
              <ul className="space-y-1.5 mb-2">
                <Li>Click the <strong>+</strong> icon (top-right) → <strong>New repository</strong></Li>
                <Li>Repository name: <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>my-portfolio</code> (or any name you like)</Li>
                <Li>Set visibility to <strong>Private</strong> ← this is the important one</Li>
                <Li><strong>Leave all three checkboxes unchecked</strong>, no README, no .gitignore, no license. The project already has these; adding them here causes a conflict.</Li>
                <Li>Click <strong>Create repository</strong></Li>
              </ul>
              <Tip>You'll land on a setup page with commands. Keep it open, you need the repo URL in Step 4.</Tip>
            </Step>

            <Step n={3} title="Open a terminal in your project folder">
              <P>In VS Code, press <strong>Ctrl + `</strong> (backtick) to open the integrated terminal. Make sure you're inside the portfolio folder, you should see files like <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>package.json</code> when you type <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>ls</code>.</P>
            </Step>

            <Step n={4} title="Initialize git and connect to GitHub">
              <P>Run these commands one at a time:</P>
              <Code>{`git init`}</Code>
              <P>This initializes git tracking in your project folder (only needed once).</P>
              <Code>{`git remote add origin https://github.com/YOUR-USERNAME/my-portfolio.git`}</Code>
              <P>Replace <strong>YOUR-USERNAME</strong> and <strong>my-portfolio</strong> with your GitHub username and repo name. Copy the exact URL from the GitHub page you left open.</P>
            </Step>

            <Step n={5} title="Verify your personal files are protected">
              <P>Before pushing anything, confirm what's gitignored:</P>
              <Code>{`cat .gitignore`}</Code>
              <P>You should see these entries, these files will <strong>never</strong> go to GitHub:</P>
              <Code copy={false}>{`content/portfolio.json\ncontent/resume.json\ncontent/projects.json\n.env.local\ndata/`}</Code>
              <P>Now check exactly what will be uploaded:</P>
              <Code>{`git status`}</Code>
              <Tip>Scan the list, <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>.env.local</code> and <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>content/portfolio.json</code> should NOT appear. Only <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>*.example.json</code> files should be included.</Tip>
            </Step>

            <Step n={6} title="Generate a Personal Access Token (GitHub password won't work)">
              <P>GitHub no longer accepts regular passwords for git operations. You need a token:</P>
              <ul className="space-y-1.5">
                <Li>Go to GitHub → your profile photo (top-right) → <strong>Settings</strong></Li>
                <Li>Scroll the left sidebar all the way down → <strong>Developer settings</strong></Li>
                <Li>Click <strong>Personal access tokens</strong> → <strong>Tokens (classic)</strong></Li>
                <Li>Click <strong>Generate new token (classic)</strong></Li>
                <Li>Give it a name (e.g. "portfolio push"), set expiration (90 days or No expiration)</Li>
                <Li>Check only the <strong>repo</strong> checkbox</Li>
                <Li>Click <strong>Generate token</strong> at the bottom</Li>
                <Li><strong>Copy the token immediately</strong>, GitHub won't show it again</Li>
              </ul>
              <Warn>When git asks for your password during the next step, paste this token, not your GitHub password.</Warn>
            </Step>

            <Step n={7} title="Stage, commit, and push">
              <Code>{`git add .`}</Code>
              <Code>{`git commit -m "Initial portfolio setup"`}</Code>
              <Code>{`git push -u origin main`}</Code>
              <P>If you get an error about "main" not existing, try:</P>
              <Code>{`git push -u origin master`}</Code>
              <P>When git prompts for login, enter your GitHub username and paste your token as the password.</P>
            </Step>

            <Step n={8} title="Verify on GitHub">
              <ul className="space-y-1.5">
                <Li>Go to <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>github.com/YOUR-USERNAME/my-portfolio</code></Li>
                <Li>Confirm <strong>content/portfolio.json</strong> does NOT appear, only <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>portfolio.example.json</code> should be there</Li>
                <Li>Confirm <strong>.env.local</strong> does NOT appear</Li>
                <Li>The repo header should show a 🔒 <strong>Private</strong> label</Li>
              </ul>
            </Step>

            <Step n={9} title="Push future changes">
              <P>Every time you make updates and want to save them to GitHub:</P>
              <Code>{`git add .\ngit commit -m "describe what you changed"\ngit push`}</Code>
              <Tip>Write a clear commit message each time. Example: "Add new project, Industrial AI Copilot" or "Update bio and contact info".</Tip>
            </Step>

            <Step n={10} title="Make the repo public when you're ready">
              <ul className="space-y-1.5">
                <Li>Go to your repo → <strong>Settings</strong> tab (top-right of repo page)</Li>
                <Li>Scroll all the way down to the <strong>Danger Zone</strong> section</Li>
                <Li>Click <strong>"Change repository visibility"</strong> → select <strong>Public</strong> → confirm</Li>
                <Li>Your portfolio source code is now public, but your personal data is still safe, those JSON files are gitignored and won't appear</Li>
              </ul>
              <Tip>You can switch back to private at any time from the same settings page.</Tip>
            </Step>
          </section>

          {/* ── FAQ ── */}
          <section id="faq" className="scroll-mt-28 mb-12">
            <SectionTitle id="faq" emoji="❓">Common Questions</SectionTitle>
            {[
              { q: "I changed portfolio.json but the site didn't update, why?", a: "Make sure npm run dev is still running. If not, restart it. Also press Ctrl+S to save the file. The browser auto-refreshes within a second of saving." },
              { q: 'The AI chat says "Make sure OPENAI_API_KEY is set", what do I do?', a: "Open .env.local and verify OPENAI_API_KEY starts with sk-. After editing .env.local, restart the dev server (Ctrl+C to stop, then npm run dev). Env variable changes always require a restart." },
              { q: 'How do I change the default theme?', a: "Open lib/context/ThemeContext.tsx, find useState('cyberpunk-ai'), and change the value to: glassmorphism, minimal-professional, terminal-hacker, dark-professional, bright-neon, futuristic-space, anime-gaming, or retro-pixel." },
              { q: 'How do I add a blog post?', a: "Create a .md file in content/blog/. Add frontmatter at the top between --- lines: title, date, tags (array), category, excerpt. Everything below the second --- is the post body. It appears on the Blog page automatically." },
              { q: 'How do I update the resume PDF?', a: "Replace the file at public/resume/Phaneendra_G_Resume.pdf with your own PDF. Keep the same filename, or update the download links in the Experience page and One Page view." },
              { q: 'Git is asking for a password but my GitHub password doesn\'t work?', a: "GitHub no longer accepts passwords for git operations. Go to github.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → Generate new token → check the repo checkbox → generate → use this token as your password when git asks." },
            ].map(({ q, a }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className={`mb-3 p-4 ${cardCls}`}>
                <p className="text-sm font-semibold mb-1.5" style={{ color: isLight ? '#1e293b' : accent }}>Q: {q}</p>
                <p className="text-sm" style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.58)' }}>{a}</p>
              </motion.div>
            ))}
          </section>

          {/* ── Disable AI ── */}
          <section id="disable-ai" className="scroll-mt-28 mb-12">
            <SectionTitle id="disable-ai" emoji="🤖">Don't Need the AI Chat?</SectionTitle>
            <div className={`p-5 ${cardCls}`}>
              <P>The AI assistant uses OpenAI which costs a small amount per query. If you'd rather skip it, two steps remove it completely:</P>
              <Step n={1} title="Remove it from the layout">
                <P>Open <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>components/shared/ThemedLayout.tsx</code> and delete these two lines:</P>
                <Code>{`import AIAssistant from '@/components/assistant/AIAssistant'`}</Code>
                <Code>{`<AIAssistant />`}</Code>
                <P>The chat button disappears from every page.</P>
              </Step>
              <Step n={2} title="Clean up (optional)">
                <P>Delete the <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>app/api/assistant/</code> folder. Skip <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>OPENAI_API_KEY</code> and <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>PINECONE_API_KEY</code> in .env.local. Everything else works perfectly without them.</P>
              </Step>
              <Tip>Want the AI but lower costs? In <code className="px-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>app/api/assistant/route.ts</code>, reduce max_tokens from 500 to 200. Typical portfolio usage is pennies per month.</Tip>
            </div>
          </section>

          {/* ── Next Steps ── */}
          <section id="next-steps" className="scroll-mt-28 mb-12">
            <SectionTitle id="next-steps" emoji="🔮">What You Can Do Next</SectionTitle>
            <div className="space-y-3">
              {[
                { icon: '🌐', title: 'Buy your own domain', body: 'Get yourname.com or yourname.dev from Namecheap (~$10/year). In Vercel → Project → Settings → Domains, add it and follow the DNS instructions. Takes 10 minutes.' },
                { icon: '✉️', title: 'Email from your own domain', body: "Once you have a domain, in Resend go to Domains → Add Domain, verify DNS, then update the 'from' field in app/api/contact/route.ts to hello@yourdomain.com." },
                { icon: '📊', title: 'Add visitor analytics', body: 'Run: npm install @vercel/analytics, then import and render the Analytics component in app/layout.tsx. Free. Shows page views, locations, and which pages people visit.' },
                { icon: '📝', title: 'Write blog posts', body: 'Drop .md files in content/blog/. Blog is fully built, you just need content. Writing about projects gets you noticed by recruiters.' },
                { icon: '🎨', title: 'Make your own theme', body: 'Duplicate a theme in lib/themes.ts, change the color variables, add it to the switcher. No React needed for color changes.' },
                { icon: '🔒', title: 'Make the repo public', body: "When you're happy with it: GitHub → repo → Settings → scroll to Danger Zone → Change visibility → Public. Your personal files are still safe." },
              ].map(({ icon, title, body }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className={`p-4 ${cardCls} flex gap-3`}>
                  <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: isLight ? '#1e293b' : accent }}>{title}</p>
                    <p className="text-sm" style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.58)' }}>{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-center">
            <p className="text-xs mb-1" style={{ color: `${accent}45` }}>
              Still stuck? Open the AI chat (bottom right corner) and ask, it knows this entire guide.
            </p>
            <p className="text-xs" style={{ color: `${accent}30` }}>Built by Phaneendra Gavara · phaneendra.gavara@gmail.com</p>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
