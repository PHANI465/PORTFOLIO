'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'
import { Send, Linkedin, Github, Mail, Phone, ChevronDown, Check, Zap, Paperclip, X } from 'lucide-react'

const SUBJECT_OPTIONS = [
  { value: 'job', label: 'Job Opportunity' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'research', label: 'Research Discussion' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'hello', label: 'Just saying hi! 👋' },
  { value: 'freelance', label: 'Freelance / Contract' },
  { value: 'other', label: 'Other (type below)' },
]

const SUBJECT_MAP: Record<string, string> = {
  job: 'Job Opportunity',
  collaboration: 'Collaboration',
  research: 'Research Discussion',
  general: 'General Inquiry',
  hello: 'Just saying hi!',
  freelance: 'Freelance / Contract',
}

const QUICK_MESSAGES = [
  { icon: '💼', label: 'Job offer', text: "Hi Phaneendra! I came across your portfolio and I'd love to discuss a job opportunity that might be a great fit for you. Would you be open to a conversation?" },
  { icon: '🤝', label: 'Collaborate', text: "Hey! I'm working on a project and think your skills in ML and data science would be a great addition. Interested in collaborating?" },
  { icon: '✨', label: 'Impressed', text: "Just wanted to say, your portfolio is really impressive! The projects you've built are super interesting. Would love to connect." },
  { icon: '❓', label: 'Project question', text: "Hi! I was looking at your project work and had a few questions. Would you be available for a quick chat?" },
  { icon: '🌐', label: 'Freelance', text: "Hi Phaneendra, I have a freelance data science / ML project I'd like to discuss with you. Are you available for contract work?" },
]

export default function ContactPage() {
  const { theme } = useTheme()
  const isTerminal = theme === 'terminal-hacker'
  const isLight = theme === 'minimal-professional' || theme === 'bright-neon'

  const [subjectKey, setSubjectKey] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [form, setForm] = useState({ name: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [showPhone, setShowPhone] = useState(false)

  const finalSubject = subjectKey === 'other'
    ? customSubject
    : SUBJECT_MAP[subjectKey] || ''

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File exceeds 10 MB limit')
      return
    }
    setFileError('')
    setAttachedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!finalSubject.trim()) { setDropdownOpen(true); return }
    setStatus('sending')
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('subject', finalSubject)
      fd.append('message', form.message)
      if (attachedFile) fd.append('attachment', attachedFile)

      const res = await fetch('/api/contact', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok || data.saved) {
        setStatus('success')
        setForm({ name: '', message: '' })
        setSubjectKey('')
        setCustomSubject('')
        setAttachedFile(null)
        setFileError('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const applyTemplate = (idx: number, text: string) => {
    setForm(f => ({ ...f, message: text }))
    setCopiedTemplate(idx)
    setTimeout(() => setCopiedTemplate(null), 1500)
  }

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const { accent, accent2: accentPink } = getAccents(theme)

  const inputCls = `w-full px-4 py-2.5 text-sm outline-none transition-colors ${
    isTerminal
      ? 'bg-transparent border border-[#00ff41]/20 text-[#00ff41] placeholder:text-[#00ff41]/20 focus:border-[#00ff41]/50'
      : isLight
      ? 'bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 rounded-lg'
      : 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 rounded-lg'
  }`

  const labelCls = `block text-xs mb-1.5 font-medium ${
    isTerminal ? 'text-[#ffb000]' : isLight ? 'text-slate-600' : 'text-purple-400'
  }`

  const monoFont = isTerminal ? { fontFamily: 'monospace' } : {}

  const cardCls = `p-6 ${
    isTerminal ? 'border border-[#00ff41]/15' :
    isLight ? 'rounded-2xl border border-slate-100 bg-white shadow-sm' :
    'rounded-2xl glass-card'
  }`

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          {isTerminal ? (
            <div style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <p className="text-[#00ff41]/40 text-xs mb-1">$ mail -s "hello" phaneendra</p>
              <h1 className="text-3xl text-[#00ff41] font-bold">Contact</h1>
            </div>
          ) : isLight ? (
            <div>
              <p className="text-indigo-500 text-sm font-medium mb-1">Get in touch</p>
              <h1 className="font-display text-4xl font-bold text-slate-900">Let&apos;s build something</h1>
            </div>
          ) : (
            <div>
              <p className="text-purple-400 text-sm mb-1">Get in touch</p>
              <h1 className="font-display text-4xl font-bold text-white">Let&apos;s build something</h1>
            </div>
          )}
          <p className={`text-sm mt-2 ${isLight ? 'text-slate-500' : 'opacity-60'}`}>
            Open to full-time AI/LLM Engineering, ML Engineering, and Data Science roles, plus collaborations and interesting conversations.
          </p>
          <a
            href="mailto:phaneendra.gavara@gmail.com"
            className="inline-block mt-3 font-mono text-sm transition-colors"
            style={{ color: accent }}
          >
            phaneendra.gavara@gmail.com
          </a>
        </motion.div>

        {/* ── Socials ── */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { href: 'https://www.linkedin.com/in/phaneendra-gavara', Icon: Linkedin, label: 'LinkedIn' },
            { href: 'https://github.com/PHANI465', Icon: Github, label: 'GitHub' },
            { href: 'mailto:phaneendra.gavara@gmail.com', Icon: Mail, label: 'Email' },
          ].map(({ href, Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className={`icon-link flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg ${
                isTerminal ? 'border-[#00ff41]/40 text-[#00ff41] bg-[#00ff41]/5 hover:bg-[#00ff41]/10' :
                isLight ? 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400' :
                'border-white/20 text-white/80 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/40'
              }`}
            >
              <Icon size={13} />{label}
            </a>
          ))}

          {/* Phone: icon only; click reveals the number, second click calls */}
          {showPhone ? (
            <motion.a
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              href="tel:+16233206354"
              className={`icon-link flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg ${
                isTerminal ? 'border-[#00ff41]/40 text-[#00ff41] bg-[#00ff41]/5 hover:bg-[#00ff41]/10' :
                isLight ? 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400' :
                'border-white/20 text-white/80 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/40'
              }`}
            >
              <Phone size={13} />+1 623 320 6354
            </motion.a>
          ) : (
            <button
              type="button"
              onClick={() => setShowPhone(true)}
              aria-label="Show phone number"
              title="Show phone number"
              className={`icon-link flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg ${
                isTerminal ? 'border-[#00ff41]/40 text-[#00ff41] bg-[#00ff41]/5 hover:bg-[#00ff41]/10' :
                isLight ? 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400' :
                'border-white/20 text-white/80 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/40'
              }`}
            >
              <Phone size={13} />
            </button>
          )}
        </div>

        {/* ── Contact Form ── */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className={cardCls}
        >
          {isTerminal && (
            <p className="text-[#00ff41]/30 text-xs mb-4" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              Compose message:
            </p>
          )}

          {/* Name */}
          <div className="mb-4">
            <label className={labelCls} style={monoFont}>Your Name</label>
            <input
              type="text"
              required
              placeholder={isTerminal ? 'enter name...' : 'Your name'}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={inputCls}
              style={monoFont}
            />
          </div>

          {/* Subject Dropdown */}
          <div className="mb-4">
            <label className={labelCls} style={monoFont}>
              {isTerminal ? 'Subject' : 'What\'s this about?'} <span className="opacity-60">(required)</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                className={`${inputCls} flex items-center justify-between text-left ${
                  !subjectKey ? 'opacity-50' : ''
                }`}
                style={monoFont}
              >
                <span>
                  {subjectKey
                    ? SUBJECT_OPTIONS.find(o => o.value === subjectKey)?.label
                    : isTerminal ? 'select subject...' : 'Select a topic...'}
                </span>
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} style={{ color: accent }} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    className={`absolute z-20 w-full mt-1 py-1 ${
                      isTerminal ? 'border border-[#00ff41]/30 bg-[#0d0d0d]' :
                      isLight ? 'border border-slate-200 bg-white rounded-xl shadow-lg' :
                      'border border-white/10 bg-[#0f0a1e] rounded-xl shadow-2xl'
                    }`}
                  >
                    {SUBJECT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setSubjectKey(opt.value); setDropdownOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          subjectKey === opt.value
                            ? isTerminal ? 'bg-[#00ff41]/10 text-[#00ff41]' :
                              isLight ? 'bg-indigo-50 text-indigo-700' :
                              'bg-white/10 text-white'
                            : isTerminal ? 'text-[#00ff41]/60 hover:bg-[#00ff41]/5 hover:text-[#00ff41]' :
                              isLight ? 'text-slate-600 hover:bg-slate-50' :
                              'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                        style={monoFont}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Manual input when "Other" is selected */}
            <AnimatePresence>
              {subjectKey === 'other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 overflow-hidden"
                >
                  <input
                    type="text"
                    required={subjectKey === 'other'}
                    placeholder={isTerminal ? 'type your subject...' : 'Describe your subject...'}
                    value={customSubject}
                    onChange={e => setCustomSubject(e.target.value)}
                    className={inputCls}
                    style={monoFont}
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick message templates */}
          <div className="mb-3">
            <label className={`${labelCls} mb-2`} style={monoFont}>
              {isTerminal ? '# Quick templates:' : 'Quick message starters:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_MESSAGES.map((tmpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyTemplate(i, tmpl.text)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all rounded-lg border ${
                    copiedTemplate === i
                      ? isTerminal ? 'border-[#00ff41] bg-[#00ff41]/20 text-[#00ff41]' :
                        isLight ? 'border-indigo-400 bg-indigo-100 text-indigo-700' :
                        'border-purple-400 bg-purple-500/20 text-purple-300'
                      : isTerminal ? 'border-[#00ff41]/20 text-[#00ff41]/60 hover:border-[#00ff41]/50 hover:text-[#00ff41] hover:bg-[#00ff41]/5' :
                        isLight ? 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50' :
                        'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80 hover:bg-white/5'
                  }`}
                  style={monoFont}
                >
                  {copiedTemplate === i
                    ? <><Check size={10} /> Applied!</>
                    : <>{tmpl.icon} {tmpl.label}</>}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className={labelCls} style={monoFont}>Message</label>
            <textarea
              required
              rows={5}
              placeholder={isTerminal ? '> type your message...' : 'Write your message here...'}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className={`${inputCls} resize-none`}
              style={monoFont}
            />
          </div>

          {/* Attachment */}
          <div className="mb-4">
            <label className={labelCls} style={monoFont}>
              {isTerminal ? '# Attachment (optional):' : 'Attach a file'}{' '}
              <span className="opacity-50 font-normal">(optional · max 10 MB)</span>
            </label>
            {!attachedFile ? (
              <label className={`flex items-center gap-2 px-4 py-3 border border-dashed cursor-pointer transition-colors ${
                isTerminal ? 'border-[#00ff41]/20 text-[#00ff41]/50 hover:border-[#00ff41]/50 hover:text-[#00ff41]' :
                isLight ? 'border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 rounded-lg' :
                'border-white/10 text-white/30 hover:border-white/30 hover:text-white/60 rounded-lg'
              }`}>
                <Paperclip size={14} />
                <span className="text-sm" style={monoFont}>
                  {isTerminal ? 'click to attach file...' : 'Click to attach a file'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.zip,.txt,.csv,.xlsx,.pptx"
                />
              </label>
            ) : (
              <div className={`flex items-center gap-2 px-4 py-2.5 border ${
                isTerminal ? 'border-[#00ff41]/30 text-[#00ff41]' :
                isLight ? 'border-indigo-200 text-indigo-700 bg-indigo-50 rounded-lg' :
                'border-white/20 text-white/80 bg-white/5 rounded-lg'
              }`}>
                <Paperclip size={13} className="flex-shrink-0" />
                <span className="text-sm flex-1 truncate" style={monoFont}>{attachedFile.name}</span>
                <span className={`text-xs flex-shrink-0 ${isLight ? 'text-slate-400' : 'opacity-40'}`} style={monoFont}>
                  {(attachedFile.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <button
                  type="button"
                  onClick={() => { setAttachedFile(null); setFileError('') }}
                  className={`flex-shrink-0 transition-opacity opacity-50 hover:opacity-100`}
                >
                  <X size={13} />
                </button>
              </div>
            )}
            {fileError && (
              <p className="mt-1.5 text-xs text-red-400" style={monoFont}>{fileError}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold transition-all ${
              isTerminal
                ? 'border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black disabled:opacity-40'
                : 'rounded-lg text-white disabled:opacity-40'
            }`}
            style={
              isLight
                ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }
                : !isTerminal
                  ? { background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }
                  : monoFont
            }
          >
            {status === 'sending'
              ? <><Zap size={14} className="animate-pulse" /> {isTerminal ? 'Sending...' : 'Transmitting...'}</>
              : <><Send size={14} /> {isTerminal ? '$ send message' : 'Send Message'}</>
            }
          </button>

          <AnimatePresence>
            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-xs text-green-400"
                style={monoFont}
              >
                {isTerminal
                  ? '> Message sent successfully. Exit code 0.'
                  : '✓ Message sent! I\'ll get back to you soon.'}
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-xs text-red-400"
                style={monoFont}
              >
                {isTerminal
                  ? '> Error: Failed to send. Try email directly.'
                  : 'Something went wrong. Please email directly at phaneendra.gavara@gmail.com'}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </div>
  )
}
