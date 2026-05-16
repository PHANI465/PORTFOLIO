'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Portfolio } from '@/types'
import MatrixRain from '@/components/effects/MatrixRain'

const bootSequence = [
  'Initializing portfolio kernel v3.0...',
  'Loading user profile: phaneendra_gavara',
  'Mounting data science modules........[OK]',
  'Loading ML pipeline..................[OK]',
  'Connecting to OpenAI API..............[OK]',
  'RAG system online.....................[OK]',
  'Portfolio online. Welcome.',
]

interface HeroProps { portfolio: Portfolio }

export default function TerminalHero({ portfolio }: HeroProps) {
  const [bootLines, setBootLines] = useState<string[]>([])
  const [showMain, setShowMain] = useState(false)
  const [typedBio, setTypedBio] = useState('')
  const [cursor, setCursor] = useState(true)
  const [typedCmd, setTypedCmd] = useState('')
  const cmdRef = useRef(false)

  useEffect(() => {
    let lineIdx = 0
    const addLine = () => {
      if (lineIdx < bootSequence.length) {
        setBootLines(prev => [...prev, bootSequence[lineIdx]])
        lineIdx++
        setTimeout(addLine, 150 + Math.random() * 180)
      } else {
        setTimeout(() => setShowMain(true), 400)
      }
    }
    setTimeout(addLine, 200)
    const cursorInterval = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(cursorInterval)
  }, [])

  // Type the command "cat bio.txt" first, then the bio
  useEffect(() => {
    if (!showMain || cmdRef.current) return
    cmdRef.current = true
    const cmd = 'cat bio.txt'
    let i = 0
    const typeCmd = () => {
      if (i < cmd.length) {
        setTypedCmd(cmd.slice(0, i + 1))
        i++
        setTimeout(typeCmd, 60)
      } else {
        setTimeout(() => {
          let j = 0
          const bio = portfolio.bio
          const typeBio = () => {
            if (j < bio.length) {
              setTypedBio(bio.slice(0, j + 1))
              j++
              setTimeout(typeBio, 12)
            }
          }
          typeBio()
        }, 300)
      }
    }
    setTimeout(typeCmd, 500)
  }, [showMain, portfolio.bio])

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-10 px-4 overflow-hidden"
      style={{ background: '#0d0d0d' }}>

      {/* Matrix rain background */}
      <MatrixRain opacity={0.06} color="#00ff41" fontSize={13} speed={60} />

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto w-full">

        {/* Boot sequence */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-6 space-y-0.5" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
          {bootLines.map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="text-xs text-[#00ff41]/50 flex gap-3">
              <span className="text-[#00ff41]/25 flex-shrink-0">[ {String(i).padStart(2, '0')} ]</span>
              <span className={i === bootSequence.length - 1 ? 'text-[#00ff41]' : ''}>{line}</span>
            </motion.div>
          ))}
        </motion.div>

        {showMain && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

            {/* Separator */}
            <div className="border-t border-[#00ff41]/20 mb-6" />

            {/* whoami */}
            <div className="mb-2" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <span className="text-[#00ff41]/40 text-xs">phaneendra@portfolio:~$</span>
              <span className="text-[#00ff41] text-xs ml-2">whoami</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-[#00ff41] mb-1"
              style={{ fontFamily: 'Share Tech Mono, monospace', textShadow: '0 0 20px rgba(0,255,65,0.4)' }}>
              Phaneendra Gavara
            </h1>

            <div className="flex items-center gap-2 mb-6" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <span className="text-[#ffb000] text-sm">&gt;&gt;</span>
              <span className="text-[#00ff41]/70 text-sm">{portfolio.title}</span>
              <span className="text-[#00ff41]/30 text-xs ml-2">// M.S. Data Science @ ASU</span>
            </div>

            {/* cat bio.txt */}
            <div className="mb-2" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <span className="text-[#00ff41]/40 text-xs">phaneendra@portfolio:~$</span>
              <span className="text-[#00ff41] text-xs ml-2">{typedCmd}</span>
              {!typedBio && <span className={`text-[#00ff41] text-xs ${cursor ? 'opacity-100' : 'opacity-0'}`}>█</span>}
            </div>

            <div className="text-[#00ff41]/70 text-sm leading-relaxed mb-8 max-w-2xl border-l-2 border-[#00ff41]/20 pl-4"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {typedBio}
              {typedBio && typedBio.length < portfolio.bio.length && (
                <span className={`text-[#00ff41] ${cursor ? 'opacity-100' : 'opacity-0'}`}>█</span>
              )}
            </div>

            {/* Stats row */}
            <div className="mb-6 flex flex-wrap gap-4" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {[
                { key: 'GPA', val: '3.9/4.0' },
                { key: 'Projects', val: '6+' },
                { key: 'Status', val: 'Open to work' },
              ].map(({ key, val }) => (
                <div key={key} className="text-xs">
                  <span className="text-[#ffb000]/60">{key}: </span>
                  <span className="text-[#00ff41]">{val}</span>
                </div>
              ))}
            </div>

            {/* Commands */}
            <div style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <div className="mb-2">
                <span className="text-[#00ff41]/40 text-xs">phaneendra@portfolio:~$</span>
                <span className="text-[#00ff41] text-xs ml-2">ls commands/</span>
              </div>
              <div className="flex flex-wrap gap-3 pl-4">
                {[
                  { label: './view-work', href: '/projects' },
                  { label: './download-resume', href: portfolio.resumeUrl, download: true },
                  { label: './contact-me', href: '/contact' },
                ].map(({ label, href, download }) => (
                  <Link key={href} href={href} download={download || undefined}
                    className="text-sm text-[#ffb000] hover:text-[#00ff41] underline transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Blinking cursor at bottom */}
            <div className="mt-6 flex items-center gap-1" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <span className="text-[#00ff41]/40 text-xs">phaneendra@portfolio:~$</span>
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
                className="text-[#00ff41] text-xs">���</motion.span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
