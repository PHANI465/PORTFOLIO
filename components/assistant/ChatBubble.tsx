'use client'

import { motion } from 'framer-motion'
import { ChatMessage, ThemeId } from '@/types'
import ReactMarkdown from 'react-markdown'
import { Bot } from 'lucide-react'

interface Props {
  message: ChatMessage
  theme: ThemeId
}

export default function ChatBubble({ message, theme }: Props) {
  const isCyber    = theme === 'cyberpunk-ai'
  const isTerminal = theme === 'terminal-hacker'
  const isLight    = theme === 'minimal-professional' || theme === 'bright-neon'
  const isDark     = theme === 'dark-professional'
  const isUser     = message.role === 'user'

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

  const ts = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 16, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex justify-end items-end gap-1.5"
      >
        <span className="text-[9px] mb-1" style={{ color: `${accent}40` }}>{ts}</span>
        <div
          className="max-w-[78%] text-sm px-3.5 py-2.5 leading-relaxed"
          style={{
            background: isLight
              ? `linear-gradient(135deg, ${accent}, ${accent2})`
              : `linear-gradient(135deg, ${accent}25, ${accent2}18)`,
            color: isLight ? '#ffffff' : accent,
            fontFamily: isTerminal ? 'Share Tech Mono, monospace' : undefined,
            fontSize: '0.8rem',
            lineHeight: '1.55',
            borderRadius: '16px 16px 4px 16px',
            border: isLight ? 'none' : `1px solid ${accent}35`,
            boxShadow: `0 4px 16px ${accent}20`,
          }}
        >
          {message.content}
        </div>
      </motion.div>
    )
  }

  // Assistant message
  return (
    <motion.div
      initial={{ opacity: 0, x: -16, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex items-end gap-2"
    >
      {/* Mini avatar */}
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mb-0.5"
        style={{ background: `linear-gradient(135deg, ${accent}30, ${accent2}20)`, border: `1px solid ${accent}30` }}
      >
        <Bot size={11} style={{ color: accent }} />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className="max-w-full text-sm px-3.5 py-2.5 leading-relaxed"
          style={{
            background: isLight
              ? '#f8fafc'
              : `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))`,
            color: isLight ? '#334155' : 'rgba(255,255,255,0.82)',
            fontFamily: isTerminal ? 'Share Tech Mono, monospace' : undefined,
            fontSize: '0.8rem',
            lineHeight: '1.6',
            borderRadius: '4px 16px 16px 16px',
            border: isLight ? '1px solid #e2e8f0' : `1px solid ${accent}18`,
            opacity: message.content ? 1 : 0.4,
            boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          {message.content ? (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-none space-y-0.5 mb-1">{children}</ul>,
                li: ({ children }) => (
                  <li className="flex gap-1.5">
                    <span style={{ color: accent }} className="mt-0.5 flex-shrink-0">▸</span>
                    <span>{children}</span>
                  </li>
                ),
                code: ({ children }) => (
                  <code
                    className="px-1 py-0.5 rounded text-[11px]"
                    style={{
                      background: isLight ? '#f1f5f9' : `${accent}12`,
                      color: isLight ? '#0f172a' : accent,
                      border: isLight ? '1px solid #e2e8f0' : `1px solid ${accent}25`,
                    }}
                  >
                    {children}
                  </code>
                ),
                strong: ({ children }) => (
                  <strong style={{ color: isLight ? '#0f172a' : accent, fontWeight: 600 }}>{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener" style={{ color: accent, textDecoration: 'underline' }}>
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <span style={{ color: `${accent}40` }}>●●●</span>
          )}
        </div>
        <span className="text-[9px] ml-1 mt-0.5 block" style={{ color: `${accent}35` }}>{ts}</span>
      </div>
    </motion.div>
  )
}
