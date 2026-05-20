'use client'

import { motion } from 'framer-motion'
import { Bot, Cpu } from 'lucide-react'
import { ThemeId } from '@/types'

interface Props {
  size?: number
  theme: ThemeId
  animated?: boolean
}

export default function AssistantAvatar({ size = 32, theme, animated = false }: Props) {
  const isCyber = theme === 'cyberpunk-ai'
  const isTerminal = theme === 'terminal-hacker'

  const color = isCyber ? '#00fff5' : isTerminal ? '#00ff41' : '#8b5cf6'
  const bg = isCyber ? 'rgba(0,255,245,0.1)' : isTerminal ? 'rgba(0,255,65,0.1)' : 'rgba(139,92,246,0.15)'

  const avatarSize = size
  const iconSize = Math.round(size * 0.55)

  const content = (
    <div
      className="rounded-full flex items-center justify-center relative"
      style={{
        width: avatarSize,
        height: avatarSize,
        background: bg,
        border: `1px solid ${color}40`,
        boxShadow: animated ? `0 0 12px ${color}30` : 'none',
      }}
    >
      {isCyber ? (
        <Cpu size={iconSize} style={{ color }} />
      ) : (
        <Bot size={iconSize} style={{ color }} />
      )}
    </div>
  )

  if (!animated) return content

  return (
    <motion.div
      animate={{ boxShadow: [`0 0 8px ${color}20`, `0 0 20px ${color}50`, `0 0 8px ${color}20`] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      {content}
    </motion.div>
  )
}
