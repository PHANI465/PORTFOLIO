'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { X, Send, Minimize2, Maximize2, Shrink, Sparkles, Bot, ChevronDown, Zap } from 'lucide-react'
import { ChatMessage } from '@/types'
import { useTheme } from '@/lib/context/ThemeContext'
import ChatBubble from './ChatBubble'
import AssistantAvatar from './AssistantAvatar'

const WELCOME = "Hey! I'm Sparky — Phaneendra's AI assistant. He just graduated from ASU (May 2026, GPA 3.90) and is actively seeking Data Science, ML/AI, and LLM Engineer roles. Ask me anything! 🎓"

const IDLE_MESSAGES = [
  "👋 Ask me about Phaneendra's AI projects!",
  '🏆 He placed 3rd at the ASU Social Bias Hackathon — want details?',
  '🤖 Curious about his LLM & RAG work? Ask away!',
  '🎓 Just graduated ASU May 2026 · GPA 3.90 · Top 5%',
  '💼 Open to Data Science & ML roles — OPT until Jun 2029',
]

const QUICK_QUESTIONS = [
  'What are his top projects?',
  'What roles is he open to?',
  'Tell me about his skills',
  'Can he work in the US?',
]

export default function AIAssistant() {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: WELCOME, timestamp: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [idleMsg, setIdleMsg] = useState('')
  const [showIdle, setShowIdle] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idleTimer = useRef<NodeJS.Timeout | null>(null)

  const isCyber    = theme === 'cyberpunk-ai'
  const isTerminal = theme === 'terminal-hacker'
  const isLight    = theme === 'minimal-professional' || theme === 'bright-neon'
  const isDark     = theme === 'dark-professional'

  // Accent colors
  const accent = isCyber ? '#00fff5'
    : isTerminal ? '#00ff41'
    : isLight ? (theme === 'bright-neon' ? '#7c3aed' : '#6366f1')
    : isDark ? '#3b82f6'
    : '#8b5cf6'

  const accent2 = isCyber ? '#7b2fff'
    : isTerminal ? '#ffb000'
    : isLight ? '#818cf8'
    : isDark ? '#60a5fa'
    : '#a78bfa'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) { setShowIdle(false); return }
    idleTimer.current = setTimeout(() => {
      const msg = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)]
      setIdleMsg(msg)
      setShowIdle(true)
      setTimeout(() => setShowIdle(false), 6000)
    }, 10000)
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current) }
  }, [open, messages])

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setShowQuick(false)

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    if (!text) setInput('')
    setLoading(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() }])

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history: messages.slice(-10) }),
      })
      if (!res.ok || !res.body) throw new Error('Failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n').filter(l => l.startsWith('data: '))) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content || ''
            full += delta
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: full } : m))
          } catch {}
        }
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: 'Sorry, something went wrong. Make sure OPENAI_API_KEY is set in .env.local!' }
          : m
      ))
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  // ── Panel dimensions ──────────────────────────────────────────────────────
  const panelDims = fullscreen
    ? { inset: '1rem', width: 'auto', height: 'auto' }
    : { bottom: '1.5rem', right: '1.5rem', width: '380px', maxWidth: 'calc(100vw - 2rem)', height: minimized ? 'auto' : '560px', maxHeight: '85vh' }

  // ── Theme panel style ─────────────────────────────────────────────────────
  const panelBg = isCyber   ? 'rgba(3,3,14,0.98)'
    : isTerminal ? '#080808'
    : isLight    ? '#ffffff'
    : isDark     ? 'rgba(10,12,20,0.98)'
    : 'rgba(10,6,25,0.97)'

  const borderColor = `${accent}35`

  return (
    <>
      {/* ── Idle bubble ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showIdle && !open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.88 }}
            className="fixed bottom-[5.5rem] right-5 z-[9998] max-w-[240px] cursor-pointer"
            onClick={() => { setOpen(true); setShowIdle(false) }}
          >
            <div
              className="relative p-3.5 rounded-2xl rounded-br-sm text-xs shadow-2xl"
              style={{
                background: panelBg,
                border: `1px solid ${borderColor}`,
                boxShadow: `0 8px 32px ${accent}20`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: accent }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="font-semibold text-[10px] tracking-wide" style={{ color: accent }}>
                  SPARKY
                </span>
              </div>
              <p style={{ color: isLight ? '#334155' : 'rgba(255,255,255,0.75)' }}>{idleMsg}</p>
              <div className="absolute -bottom-1.5 right-4 w-3 h-3 rotate-45 rounded-sm"
                style={{ background: panelBg, borderRight: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating button ────────────────────��──────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => { setOpen(true); setShowIdle(false) }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="fixed bottom-6 right-6 z-[9999] w-[3.75rem] h-[3.75rem] rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: isCyber
                ? 'linear-gradient(135deg, #00fff5 0%, #7b2fff 100%)'
                : isTerminal
                ? '#00ff41'
                : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              boxShadow: `0 0 0 0 ${accent}60`,
            }}
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: `${accent}30` }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <AssistantAvatar size={26} theme={theme} />
            {/* AI badge */}
            <motion.div
              className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white"
              style={{ background: isCyber ? '#ff0090' : '#ef4444', minWidth: '22px', textAlign: 'center' }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AI
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed z-[9999] flex flex-col overflow-hidden"
            style={{
              ...panelDims,
              background: panelBg,
              border: `1px solid ${borderColor}`,
              boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px ${accent}10, inset 0 1px 0 ${accent}10`,
              borderRadius: fullscreen ? '16px' : '20px',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* ── Header ───────────────────────────────────────────── */}
            <div
              className="relative flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
              style={{
                background: isCyber
                  ? `linear-gradient(135deg, rgba(0,255,245,0.08) 0%, rgba(123,47,255,0.06) 100%)`
                  : isTerminal
                  ? 'rgba(0,255,65,0.05)'
                  : isLight
                  ? 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
                  : `linear-gradient(135deg, ${accent}10 0%, ${accent2}06 100%)`,
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              {/* Animated gradient bar at top */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}, ${accent2}, transparent)`,
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative flex-shrink-0">
                <AssistantAvatar size={34} theme={theme} animated />
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                  style={{ background: '#22c55e', borderColor: panelBg }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-sm font-bold leading-none"
                    style={{
                      color: accent,
                      fontFamily: isTerminal ? 'Share Tech Mono, monospace' : isCyber ? 'Orbitron, monospace' : undefined,
                    }}
                  >
                    {isTerminal ? 'sparky_ai' : 'Sparky'}
                  </span>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5], rotate: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles size={10} style={{ color: accent2 }} />
                  </motion.div>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px]" style={{ color: `${accent}70` }}>AI Portfolio Assistant</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                    GPT-4
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.12, backgroundColor: `${accent}20` }} whileTap={{ scale: 0.9 }}
                  onClick={() => { setFullscreen(!fullscreen); setMinimized(false) }}
                  className="p-1.5 rounded-lg transition-all"
                  style={{ color: accent, border: `1px solid ${accent}35`, background: `${accent}10` }}
                  title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {fullscreen ? <Shrink size={13} /> : <Maximize2 size={13} />}
                </motion.button>
                {!fullscreen && (
                  <motion.button
                    whileHover={{ scale: 1.12, backgroundColor: `${accent}20` }} whileTap={{ scale: 0.9 }}
                    onClick={() => setMinimized(!minimized)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: accent, border: `1px solid ${accent}35`, background: `${accent}10` }}
                  >
                    <Minimize2 size={13} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.12, backgroundColor: 'rgba(239,68,68,0.2)' }} whileTap={{ scale: 0.9 }}
                  onClick={() => { setOpen(false); setFullscreen(false) }}
                  className="p-1.5 rounded-lg transition-all"
                  style={{ color: '#f87171', border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.1)' }}
                >
                  <X size={13} />
                </motion.button>
              </div>
            </div>

            {/* ── Body ─────────────────────────────────────────────── */}
            <AnimatePresence>
              {!minimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1, flex: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col overflow-hidden"
                  style={{ flex: 1 }}
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: `${accent}30 transparent`,
                    }}
                  >
                    {messages.map((msg, i) => (
                      <ChatBubble key={msg.id} message={msg} theme={theme} />
                    ))}

                    {/* Typing indicator */}
                    {loading && messages[messages.length - 1]?.content === '' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 pl-1"
                      >
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl rounded-bl-sm"
                          style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}>
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: accent }}
                              animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                              transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18 }}
                            />
                          ))}
                        </div>
                        <span className="text-xs" style={{ color: `${accent}50` }}>Sparky is typing…</span>
                      </motion.div>
                    )}

                    {/* Quick questions */}
                    <AnimatePresence>
                      {showQuick && messages.length === 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ delay: 0.5 }}
                          className="pt-1"
                        >
                          <p className="text-[10px] mb-2 font-medium tracking-wide" style={{ color: `${accent}60` }}>
                            QUICK QUESTIONS
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {QUICK_QUESTIONS.map(q => (
                              <motion.button
                                key={q}
                                whileHover={{ scale: 1.04, y: -2, boxShadow: `0 4px 16px ${accent}35` }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => sendMessage(q)}
                                className="text-[11px] px-3 py-1.5 rounded-xl transition-all text-left font-medium"
                                style={{
                                  background: `linear-gradient(135deg, ${accent}22, ${accent2}18)`,
                                  border: `1px solid ${accent}50`,
                                  color: accent,
                                  boxShadow: `0 2px 10px ${accent}20, inset 0 1px 0 ${accent}15`,
                                  textShadow: `0 0 8px ${accent}40`,
                                }}
                              >
                                {q}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* ── Input area ───────────────────────────────────── */}
                  <div
                    className="px-3 pb-3 pt-2 flex-shrink-0"
                    style={{ borderTop: `1px solid ${accent}15` }}
                  >
                    <div
                      className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
                      style={{
                        background: `${accent}08`,
                        border: `1px solid ${accent}20`,
                        boxShadow: `0 0 0 0 ${accent}20`,
                      }}
                    >
                      <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap size={12} style={{ color: accent, flexShrink: 0 }} />
                      </motion.div>
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder={isTerminal ? '> ask anything...' : 'Ask about Phaneendra…'}
                        className="flex-1 bg-transparent text-sm outline-none"
                        style={{
                          color: isLight ? '#1e293b' : 'rgba(255,255,255,0.85)',
                          fontFamily: isTerminal ? 'Share Tech Mono, monospace' : undefined,
                        }}
                      />
                      <motion.button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30 transition-all"
                        style={{
                          background: input.trim() ? `linear-gradient(135deg, ${accent}, ${accent2})` : `${accent}20`,
                          color: isLight && input.trim() ? '#ffffff' : accent,
                          boxShadow: input.trim() ? `0 2px 12px ${accent}40` : 'none',
                        }}
                      >
                        <Send size={12} />
                      </motion.button>
                    </div>

                    <p className="text-[9px] mt-1.5 text-center tracking-wide" style={{ color: `${accent}35` }}>
                      POWERED BY GPT-4o + RAG · PINECONE
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
