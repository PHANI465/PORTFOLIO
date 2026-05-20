'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, LogOut, Settings, Folder, BookOpen, Palette, Bot, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { THEME_LIST } from '@/lib/themes'
import { ThemeId } from '@/types'
import { useTheme } from '@/lib/context/ThemeContext'

type Tab = 'overview' | 'projects' | 'blog' | 'theme' | 'ai'

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState<Tab>('overview')
  const [indexing, setIndexing] = useState(false)
  const [indexResult, setIndexResult] = useState<{ success?: boolean; error?: string; indexed?: number } | null>(null)
  const { theme, setTheme } = useTheme()

  // Check session
  useEffect(() => {
    const auth = sessionStorage.getItem('dashboard-auth')
    if (auth === 'true') setAuthenticated(true)
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/dashboard/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthenticated(true)
      sessionStorage.setItem('dashboard-auth', 'true')
      setAuthError('')
    } else {
      setAuthError('Incorrect password')
    }
  }

  const logout = () => {
    setAuthenticated(false)
    sessionStorage.removeItem('dashboard-auth')
  }

  const reindexContent = async () => {
    setIndexing(true)
    setIndexResult(null)
    try {
      const pass = sessionStorage.getItem('dashboard-pass') || ''
      const res = await fetch('/api/embeddings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${pass}` },
      })
      const data = await res.json()
      setIndexResult(data)
    } catch {
      setIndexResult({ error: 'Failed to connect' })
    } finally {
      setIndexing(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 border border-white/10 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Lock size={18} className="text-purple-400" />
            </div>
            <div>
              <h1 className="font-bold text-white">Dashboard Login</h1>
              <p className="text-xs text-white/40">Portfolio admin panel</p>
            </div>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter dashboard password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-purple-500/50"
              />
            </div>
            {authError && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={11} />{authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
            >
              Login
            </button>
          </form>
          <p className="text-xs text-white/20 mt-4 text-center">
            Set DASHBOARD_PASSWORD in .env.local
          </p>
        </motion.div>
      </div>
    )
  }

  const tabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'ai', label: 'AI Config', icon: Bot },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Portfolio Dashboard</h1>
            <p className="text-sm text-white/40">Manage your portfolio content and settings</p>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all">
            <LogOut size={14} />Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl border border-white/10 w-fit"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
                tab === id ? 'bg-purple-500/20 text-purple-300' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {tab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Active Theme', value: THEME_LIST.find(t => t.id === theme)?.name || theme, icon: Palette },
                { label: 'Projects', value: '6 projects', icon: Folder },
                { label: 'Blog Posts', value: '2 posts', icon: BookOpen },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="p-5 rounded-2xl border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                    <Icon size={12} />{label}
                  </div>
                  <p className="text-lg font-bold text-white">{value}</p>
                </div>
              ))}
              <div className="md:col-span-3 p-5 rounded-2xl border border-white/10"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Bot size={16} className="text-purple-400" />How to edit content
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Edit <code className="text-purple-300 bg-purple-500/10 px-1 rounded">content/portfolio.json</code>,{' '}
                  <code className="text-purple-300 bg-purple-500/10 px-1 rounded">content/projects.json</code>, and{' '}
                  <code className="text-purple-300 bg-purple-500/10 px-1 rounded">content/resume.json</code> directly in your code editor.
                  Add blog posts as Markdown files in <code className="text-purple-300 bg-purple-500/10 px-1 rounded">content/blog/</code>.
                  Changes take effect on next deploy (or instantly in dev mode).
                </p>
              </div>
            </div>
          )}

          {tab === 'theme' && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Select Default Theme</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {THEME_LIST.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeId)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      theme === t.id ? 'border-purple-400/60 bg-purple-500/10' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full mb-2"
                      style={{ background: t.accentColor, boxShadow: `0 0 12px ${t.accentColor}60` }} />
                    <p className="text-sm text-white font-medium">{t.name}</p>
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{t.description}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/30 mt-4">
                Theme is stored in browser. To set the default for all visitors, change{' '}
                <code className="text-purple-300">NEXT_PUBLIC_DEFAULT_THEME</code> in .env.local
              </p>
            </div>
          )}

          {tab === 'ai' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">AI Assistant Configuration</h2>
              <div className="p-5 rounded-2xl border border-white/10"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                  <RefreshCw size={14} className="text-purple-400" />
                  Re-index Portfolio Content (RAG)
                </h3>
                <p className="text-sm text-white/50 mb-4">
                  This sends your portfolio content to Pinecone so the AI assistant can answer questions accurately.
                  Run this after updating your content files.
                </p>
                <button
                  onClick={reindexContent}
                  disabled={indexing}
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-white disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
                >
                  {indexing ? <><RefreshCw size={14} className="animate-spin" />Indexing...</> : <><RefreshCw size={14} />Index Content</>}
                </button>
                {indexResult && (
                  <div className={`mt-3 flex items-center gap-2 text-sm ${indexResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {indexResult.success
                      ? <><CheckCircle size={14} />{indexResult.indexed} documents indexed successfully</>
                      : <><AlertCircle size={14} />{indexResult.error}</>}
                  </div>
                )}
              </div>
              <div className="p-5 rounded-2xl border border-white/10"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <h3 className="font-medium text-white mb-2">Required API Keys</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { key: 'OPENAI_API_KEY', desc: 'Powers GPT-4 responses', required: true },
                    { key: 'PINECONE_API_KEY', desc: 'Vector DB for RAG context retrieval', required: true },
                    { key: 'PINECONE_ENVIRONMENT', desc: 'e.g. us-east-1', required: true },
                    { key: 'PINECONE_INDEX_NAME', desc: 'Default: portfolio', required: false },
                    { key: 'OPENAI_MODEL', desc: 'Default: gpt-4-turbo-preview', required: false },
                  ].map(({ key, desc, required }) => (
                    <div key={key} className="flex items-start gap-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded mt-0.5 ${required ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {required ? 'required' : 'optional'}
                      </span>
                      <div>
                        <code className="text-purple-300">{key}</code>
                        <p className="text-white/40 text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'projects' && (
            <div className="p-5 rounded-2xl border border-white/10"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h3 className="font-medium text-white mb-2">Edit Projects</h3>
              <p className="text-sm text-white/50 mb-3">
                Edit <code className="text-purple-300">content/projects.json</code> in your code editor to add, remove, or update projects.
                Each project has: id, title, description, tech, category, featured, github, demo, highlights, date.
              </p>
              <a href="vscode://file/content/projects.json"
                className="text-sm text-purple-400 hover:text-purple-300 underline">
                Open in VS Code →
              </a>
            </div>
          )}

          {tab === 'blog' && (
            <div className="p-5 rounded-2xl border border-white/10"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h3 className="font-medium text-white mb-2">Write Blog Posts</h3>
              <p className="text-sm text-white/50 mb-3">
                Create <code className="text-purple-300">.md</code> files in{' '}
                <code className="text-purple-300">content/blog/</code>. Include frontmatter:
              </p>
              <pre className="text-xs text-white/60 bg-white/5 p-3 rounded-lg overflow-auto">
{`---
title: "Your Post Title"
excerpt: "A short summary"
date: "2024-01-01"
author: "Phaneendra Gavara"
tags: ["tag1", "tag2"]
category: "Machine Learning"
published: true
---

Your markdown content here...`}
              </pre>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
