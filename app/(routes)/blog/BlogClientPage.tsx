'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Clock, Tag, ArrowRight, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useTheme } from '@/lib/context/ThemeContext'
import { BlogPost } from '@/types'

interface Props {
  posts: BlogPost[]
  tags: string[]
  categories: string[]
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 16 } },
}

export default function BlogClientPage({ posts, tags, categories }: Props) {
  const { theme } = useTheme()
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const isCyber    = theme === 'cyberpunk-ai'
  const isTerminal = theme === 'terminal-hacker'
  const isLight    = theme === 'minimal-professional' || theme === 'bright-neon'

  const accent  = isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#4f46e5' : '#a78bfa'
  const accent2 = isCyber ? '#ff0090' : isTerminal ? '#ffb000' : isLight ? '#6366f1' : '#7c3aed'

  const filtered = activeTag ? posts.filter(p => p.tags.includes(activeTag)) : posts

  return (
    <div className="min-h-screen pt-24 pb-28 px-4 relative overflow-hidden">
      {!isLight && (
        <motion.div
          className="fixed top-40 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent}06 0%, transparent 70%)`, filter: 'blur(70px)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs tracking-widest mb-2 font-medium"
            style={{ color: accent, fontFamily: isCyber || isTerminal ? 'monospace' : undefined }}
          >
            {isTerminal ? '$ cat ./blog/*.md' : isCyber ? '>> TRANSMISSIONS' : '— Writing'}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
            className="text-5xl font-bold tracking-tight mb-3"
            style={{
              color: isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#0f172a' : '#ffffff',
              fontFamily: isCyber ? 'Orbitron, monospace' : isTerminal ? 'Share Tech Mono, monospace' : undefined,
              textShadow: isCyber ? '0 0 30px rgba(0,255,245,0.4)' : undefined,
            }}
          >
            {isCyber ? 'BLOG' : 'Blog'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm"
            style={{ color: `${accent}70` }}
          >
            Thoughts on machine learning, data science, and building things.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className="mt-5 h-px origin-left"
            style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
          />
        </motion.div>

        {/* Tags filter */}
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTag(null)}
              className="text-xs px-3 py-1 transition-all rounded-full border"
              style={{
                borderColor: !activeTag ? accent : `${accent}30`,
                color: !activeTag ? accent : `${accent}60`,
                background: !activeTag ? `${accent}12` : 'transparent',
              }}
            >
              All
            </motion.button>
            {tags.map(tag => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className="text-xs px-3 py-1 transition-all rounded-full border flex items-center gap-1"
                style={{
                  borderColor: activeTag === tag ? accent : `${accent}30`,
                  color: activeTag === tag ? accent : `${accent}60`,
                  background: activeTag === tag ? `${accent}12` : 'transparent',
                }}
              >
                <Tag size={9} />{tag}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Posts */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeTag ?? 'all'}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="space-y-4"
            >
              {filtered.map((post) => (
                <motion.div key={post.slug} variants={itemVariants}>
                  <Link href={`/blog/${post.slug}`}>
                    <motion.div
                      className={`group block p-6 transition-all cursor-pointer relative overflow-hidden ${
                        isCyber
                          ? 'border border-[#00fff5]/15 hover:border-[#00fff5]/50 bg-black/30'
                          : isTerminal
                          ? 'border border-[#00ff41]/15 hover:border-[#00ff41]/40 bg-black/40'
                          : isLight
                          ? 'border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg rounded-2xl'
                          : 'border border-white/10 glass-card hover:border-white/20 rounded-2xl'
                      }`}
                      whileHover={{ y: -3, boxShadow: `0 12px 40px ${accent}12` }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                      <motion.div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `radial-gradient(circle at 50% 0%, ${accent}06 0%, transparent 60%)` }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: `${accent}60` }}>
                          <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
                          <span>·</span>
                          <Clock size={10} />
                          <span>{post.readingTime} min read</span>
                          <span>·</span>
                          <span className="px-2 py-0.5 rounded-full text-xs"
                            style={{ background: `${accent2}15`, color: accent2, border: `1px solid ${accent2}30` }}>
                            {post.category}
                          </span>
                        </div>

                        <h2 className="text-lg font-semibold mb-2 transition-colors"
                          style={{
                            color: isCyber ? '#00fff5' : isTerminal ? '#00ff41' : isLight ? '#0f172a' : '#ffffff',
                            fontFamily: isCyber || isTerminal ? 'monospace' : undefined,
                          }}>
                          {post.title}
                        </h2>

                        <p className="text-sm leading-relaxed mb-4" style={{ color: `${accent}70` }}>
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {post.tags.map(tag => (
                              <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border"
                                style={{ borderColor: `${accent}25`, color: `${accent}60` }}>
                                <Tag size={9} />{tag}
                              </span>
                            ))}
                          </div>
                          <motion.div className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: accent }} whileHover={{ x: 4 }}>
                            Read more <ArrowRight size={12} />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="flex justify-center mb-4">
                <BookOpen size={36} style={{ color: accent }} />
              </div>
              <p className="text-sm" style={{ color: `${accent}60` }}>
                {posts.length === 0 ? 'No posts yet. Check back soon.' : 'No posts match that tag.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
