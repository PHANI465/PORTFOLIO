'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { TerminalSquare } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import { THEME_LIST, isValidTheme } from '@/lib/themes'
import portfolioData from '@/content/portfolio.json'
import resumeData from '@/content/resume.json'
import projectsData from '@/content/projects.json'
import { Portfolio, Resume, Project } from '@/types'

const portfolio = portfolioData as Portfolio
const resume = resumeData as Resume
const projects = projectsData as Project[]

type Line = { text: string; cls?: string }
type Mood = 'idle' | 'happy' | 'confused' | 'talking'

const PROMPT = 'guest@phaneendra-portfolio'

// Small kaomoji mascot that reacts to what you type: eyes and mouth per mood, blinks while idle.
const FACES: Record<Mood, { open: string; blink: string }> = {
  idle:     { open: '(•‿•)',  blink: '(-‿-)' },
  talking:  { open: '(o‿o)',  blink: '(o‿o)' },
  happy:    { open: '(★‿★)', blink: '(^‿^)' },
  confused: { open: '(•_•)?', blink: '(•_•)?' },
}

const COFFEE_ART = [
  '      ( (',
  '       ) )',
  '    ........',
  '    |      |]',
  '    \\      /',
  '     `----\'',
]

const JOKES = [
  'Why do data scientists prefer dark mode? Because light attracts bugs.',
  'I would tell you a joke about RAG pipelines, but it might hallucinate the punchline.',
  'There are only 10 types of people: those who understand binary and those who don\'t.',
  'My model hit 100% accuracy once. Turned out I was testing on the training set.',
  'A SQL query walks into a bar, walks up to two tables and asks: "Can I join you?"',
  'Why did the neural network break up with the decision tree? It needed someone less black and white.',
]

const HACK_SEQUENCE: [string, number][] = [
  ['Initiating totally-legit hacking sequence...', 0],
  ['Bypassing firewall... [========          ] 42%', 500],
  ['Cracking mainframe... [==============    ] 78%', 900],
  ['Rerouting through the mainframe... [==================] 100%', 700],
  ['ACCESS GRANTED.', 500],
  ['Just kidding. I don\'t hack, I ship. Type \'projects\' to see proof.', 700],
]

export default function InteractiveTerminal() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<Line[]>([
    { text: `Type 'help' to see what this does. Esc to close.`, cls: 'text-white/50' },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState<number | null>(null)
  const [mood, setMood] = useState<Mood>('idle')
  const [blinkOn, setBlinkOn] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const triggerBtnRef = useRef<HTMLButtonElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sequenceTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const router = useRouter()
  const { setTheme } = useTheme()

  const react = useCallback((next: Mood, holdMs = 2200) => {
    setMood(next)
    if (moodTimer.current) clearTimeout(moodTimer.current)
    if (next !== 'idle') {
      moodTimer.current = setTimeout(() => setMood('idle'), holdMs)
    }
  }, [])

  const print = useCallback((text: string, cls?: string) => {
    setLines(prev => [...prev, { text, cls }])
  }, [])

  // Prints a scripted sequence with per-line delays, e.g. for the fake-hacking easter egg.
  const printSequence = useCallback((seq: [string, number][], cls?: string) => {
    let elapsed = 0
    seq.forEach(([text, delay]) => {
      elapsed += delay
      const t = setTimeout(() => print(text, cls), elapsed)
      sequenceTimers.current.push(t)
    })
  }, [print])

  const run = useCallback((raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return
    sequenceTimers.current.forEach(clearTimeout)
    sequenceTimers.current = []
    setLines(prev => [...prev, { text: `${PROMPT}$ ${cmd}`, cls: 'text-white/85 font-medium' }])
    setHistory(prev => [...prev, cmd])
    setHistoryIdx(null)
    react('talking', 900)

    const [name, ...rest] = cmd.toLowerCase().split(/\s+/)
    const arg = rest.join(' ')

    switch (name) {
      case 'help':
        print('Commands: help, whoami, projects, skills, certifications, contact, resume, theme <name>, open <project-id>, pet, coffee, fun, joke, hack, sudo hire me, clear, exit')
        break
      case 'whoami':
        print(portfolio.about ?? portfolio.bio)
        break
      case 'projects':
        projects.filter(p => p.featured).forEach(p => print(`  ${p.id.padEnd(20)} ${p.title}`, 'text-white/70'))
        print(`Type 'open <project-id>' for details, e.g. open insighthub`, 'text-white/40')
        break
      case 'skills':
        resume.skills.forEach(s => print(`  ${s.category}: ${s.skills.join(', ')}`, 'text-white/70'))
        break
      case 'certifications':
      case 'certs':
        resume.certifications?.forEach(c => {
          const cls = c.issuer.toLowerCase().includes('amazon') ? 'text-amber-400' : 'text-white/70'
          print(`  ${c.name}: ${c.issuer} (${c.date})`, cls)
        })
        break
      case 'contact':
        print(`  Email:    ${portfolio.email}`, 'text-white/70')
        portfolio.socials
          .filter(s => s.platform.toLowerCase() !== 'email')
          .forEach(s => print(`  ${s.platform.padEnd(9)} ${s.url}`, 'text-white/70'))
        break
      case 'resume':
        print('  AI/ML resume:  /resume/Phaneendra_Gavara_AI_Resume.pdf', 'text-white/70')
        print('  Data resume:   /resume/Phaneendra_Gavara_Data_Resume.pdf', 'text-white/70')
        break
      case 'theme': {
        const match = THEME_LIST.find(t => t.id === arg || t.name.toLowerCase() === arg)
        if (match && isValidTheme(match.id)) {
          setTheme(match.id)
          print(`Switched theme to ${match.name}.`, 'text-emerald-400')
          react('happy')
        } else {
          print(`Unknown theme "${arg}". Try: ${THEME_LIST.map(t => t.id).join(', ')}`, 'text-rose-400')
          react('confused')
        }
        break
      }
      case 'open': {
        const project = projects.find(p => p.id === arg)
        if (project) {
          print(`Opening ${project.title}...`, 'text-emerald-400')
          setOpen(false)
          setTimeout(() => router.push(`/projects/${project.id}`), 0)
        } else {
          print(`No project "${arg}". Type 'projects' to list them.`, 'text-rose-400')
          react('confused')
        }
        break
      }
      case 'pet':
      case 'mascot':
        print('The little face wiggles happily. (•‿•) → (★‿★)', 'text-emerald-400')
        react('happy')
        break
      case 'coffee':
        COFFEE_ART.forEach(line => print(line, 'text-amber-300'))
        print('Fueled up.', 'text-white/40')
        react('happy')
        break
      case 'fun': {
        const p = portfolio.personal
        if (p) {
          print(`  Favorite movies:  ${p.favoriteMovies.join(', ')}`, 'text-white/70')
          print(`  Favorite actors:  ${p.favoriteActors.join(', ')}`, 'text-white/70')
          print(`  Hobbies:          ${p.hobbies.join(', ')}`, 'text-white/70')
          print(`  Favorite sport:   ${p.favoriteSport}`, 'text-white/70')
          print(`  Favorite color:   ${p.favoriteColor}`, 'text-white/70')
        } else {
          print('No fun facts on file.', 'text-white/40')
        }
        react('happy')
        break
      }
      case 'joke':
        print(JOKES[Math.floor(Math.random() * JOKES.length)], 'text-amber-300')
        react('happy')
        break
      case 'hack':
        printSequence(HACK_SEQUENCE, 'text-emerald-400')
        react('talking', HACK_SEQUENCE.reduce((sum, [, d]) => sum + d, 0) + 200)
        break
      case 'sudo':
        if (arg === 'hire me') {
          print('Permission granted. Initiating hiring sequence...', 'text-emerald-400')
          print(`Reach out: ${portfolio.email}. Response time: fast.`, 'text-emerald-400')
          react('happy', 4000)
        } else {
          print(`guest is not in the sudoers file. This incident will be reported.`, 'text-rose-400')
          react('confused')
        }
        break
      case 'clear':
        setLines([])
        break
      case 'exit':
        setOpen(false)
        break
      default:
        print(`command not found: ${name}, type 'help'`, 'text-rose-400')
        react('confused')
    }
  }, [print, printSequence, react, router, setTheme])

  // Global shortcut: backtick to toggle, ignored while typing elsewhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (e.key === '`' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Opened from CommandPalette or the visible trigger button
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('open-terminal', onOpen)
    return () => window.removeEventListener('open-terminal', onOpen)
  }, [])

  // Focus management: move focus into the dialog on open. On close, send it back to the
  // always-present trigger button rather than whatever was focused before (that element,
  // e.g. a command-palette item, may no longer exist since the terminal can be opened
  // several different ways).
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true
      setTimeout(() => inputRef.current?.focus(), 50)
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false
      setTimeout(() => triggerBtnRef.current?.focus(), 50)
    }
  }, [open])

  // Simple focus trap: Tab/Shift+Tab cycles between the close button and the input only
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const focusables = [closeBtnRef.current, inputRef.current].filter(Boolean) as HTMLElement[]
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  // Idle blink, paused for prefers-reduced-motion
  useEffect(() => {
    if (!open) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setBlinkOn(b => !b), 2600)
    return () => clearInterval(id)
  }, [open])

  useEffect(() => () => {
    if (moodTimer.current) clearTimeout(moodTimer.current)
    sequenceTimers.current.forEach(clearTimeout)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const idx = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(idx)
      setInput(history[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx === null) return
      const idx = historyIdx + 1
      if (idx >= history.length) {
        setHistoryIdx(null)
        setInput('')
      } else {
        setHistoryIdx(idx)
        setInput(history[idx])
      }
    }
  }

  const face = blinkOn && mood === 'idle' ? FACES.idle.blink : FACES[mood].open

  return (
    <>
      {/* Always-visible, keyboard-reachable trigger: the backtick shortcut and command
          palette entry aren't discoverable by tab-only or screen-reader users on their own. */}
      {!open && (
        <button
          ref={triggerBtnRef}
          onClick={() => setOpen(true)}
          aria-label="Open interactive terminal (keyboard shortcut: backtick)"
          title="Interactive terminal (`)"
          className="fixed bottom-24 left-6 z-[9989] flex items-center justify-center w-11 h-11 rounded-full transition-transform hover:scale-105"
          style={{
            background: 'rgba(10,10,18,0.55)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,255,65,0.35)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.35), 0 0 16px rgba(0,255,65,0.2)',
            color: '#00ff41',
          }}
        >
          <TerminalSquare size={17} aria-hidden="true" />
        </button>
      )}

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[999999] flex items-start justify-center p-4 sm:p-8"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Interactive terminal"
            aria-describedby="terminal-instructions"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl mt-8 sm:mt-16 rounded-xl overflow-hidden border border-[#00ff41]/25 shadow-2xl"
            style={{ background: '#0a0a0a', fontFamily: 'Share Tech Mono, monospace' }}
          >
            <span id="terminal-instructions" className="sr-only">
              Type a command and press Enter to run it. Use the up and down arrow keys to
              recall previous commands. Press Escape to close.
            </span>

            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#00ff41]/15" style={{ background: '#111' }}>
              <span className="w-3 h-3 rounded-full bg-red-500 opacity-70" aria-hidden="true" />
              <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" aria-hidden="true" />
              <span className="w-3 h-3 rounded-full bg-green-500 opacity-70" aria-hidden="true" />
              <span className="text-[11px] text-[#00ff41]/60 ml-2">{PROMPT}</span>
              <span
                aria-hidden="true"
                className="ml-3 text-[13px] text-[#00ff41] tabular-nums select-none transition-transform"
                style={{ transform: mood === 'happy' ? 'scale(1.15)' : 'scale(1)' }}
              >
                {face}
              </span>
              <button
                ref={closeBtnRef}
                onClick={() => setOpen(false)}
                aria-label="Close terminal"
                className="ml-auto text-[10px] text-[#00ff41]/40 hover:text-[#00ff41] transition-colors"
              >
                [esc]
              </button>
            </div>

            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="h-[360px] overflow-y-auto px-4 py-3 text-[13px] leading-relaxed"
            >
              {lines.map((l, i) => (
                <div key={i} className={l.cls ?? 'text-[#00ff41]/85'} style={{ whiteSpace: 'pre-wrap' }}>
                  {l.text}
                </div>
              ))}
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[#00ff41]/60 flex-shrink-0">{PROMPT}$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  aria-label="Terminal command input"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent outline-none text-[#00ff41] caret-[#00ff41]"
                />
              </div>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
