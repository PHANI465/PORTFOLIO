'use client'

import { useEffect, useState, useCallback, FormEvent } from 'react'
import Link from 'next/link'
import { ChallengeDay, ChallengeConfig } from '@/lib/challenge/types'

/**
 * Admin panel for the 100 day challenge.
 *
 * This UI only ever *reflects* authorization. Every write goes to an API
 * route that re-checks the session cookie server-side, so hiding a button
 * is a convenience, never the security boundary.
 */

type Slot = '1' | '2' | '3'

interface FormState {
  dayNumber: string
  date: string
  weightKg: string
  steps: string
  stepsGoalMet: boolean
  workoutCompleted: boolean
  cardioCompleted: boolean
  waterCompleted: boolean
  foodCompleted: boolean
  researchCompleted: boolean
  applicationsCount: string
  image1Url: string
  image2Url: string
  image3Url: string
  notes: string
}

const todayStr = () => {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
}

const emptyForm = (): FormState => ({
  dayNumber: '', date: todayStr(), weightKg: '', steps: '',
  stepsGoalMet: false, workoutCompleted: false, cardioCompleted: false,
  waterCompleted: false, foodCompleted: false, researchCompleted: false,
  applicationsCount: '', image1Url: '', image2Url: '', image3Url: '', notes: '',
})

const field =
  'w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-base text-white ' +
  'placeholder:text-white/25 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/40'
const label = 'block text-[11px] uppercase tracking-[0.16em] text-white/45 mb-2'

export default function ChallengeAdminPage() {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [configured, setConfigured] = useState(true)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [days, setDays] = useState<ChallengeDay[]>([])
  const [config, setConfig] = useState<ChallengeConfig | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [editing, setEditing] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [uploading, setUploading] = useState<Slot | null>(null)

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  /* ---------- session ---------- */
  useEffect(() => {
    fetch('/api/challenge/session')
      .then(r => r.json())
      .then(d => { setAuthed(!!d.authenticated); setConfigured(!!d.configured) })
      .catch(() => setConfigured(false))
      .finally(() => setChecking(false))
  }, [])

  const loadData = useCallback(async () => {
    try {
      const [dRes, cRes] = await Promise.all([
        fetch('/api/challenge/days'),
        fetch('/api/challenge/config'),
      ])
      const d = await dRes.json()
      const c = await cRes.json()
      setDays(d.days ?? [])
      setConfig(c.config ?? null)
    } catch {
      setMsg({ kind: 'err', text: 'Could not load existing days.' })
    }
  }, [])

  useEffect(() => { if (authed) loadData() }, [authed, loadData])

  const login = async (e: FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)
    try {
      const res = await fetch('/api/challenge/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setAuthed(true)
        setPassword('')
      } else {
        setLoginError(data.error || 'Invalid credentials')
      }
    } catch {
      setLoginError('Network error. Please try again.')
    } finally {
      setLoggingIn(false)
    }
  }

  const logout = async () => {
    await fetch('/api/challenge/logout', { method: 'POST' })
    setAuthed(false)
    setDays([])
  }

  /* ---------- images ---------- */
  const upload = async (slot: Slot, file: File) => {
    if (!form.dayNumber) {
      setMsg({ kind: 'err', text: 'Enter the day number before uploading photos.' })
      return
    }
    setUploading(slot)
    setMsg(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('day', form.dayNumber)
      fd.append('slot', slot)
      const existing = form[`image${slot}Url` as const]
      if (existing) fd.append('replacing', existing)

      const res = await fetch('/api/challenge/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      set(`image${slot}Url` as keyof FormState, data.url as never)
      setMsg({ kind: 'ok', text: `Photo ${slot} uploaded.` })
    } catch (err) {
      setMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Upload failed.' })
    } finally {
      setUploading(null)
    }
  }

  /* ---------- save ---------- */
  const save = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)

    const n = Number(form.dayNumber)
    if (!Number.isInteger(n) || n < 1) {
      setMsg({ kind: 'err', text: 'Day number must be a whole number of 1 or more.' })
      setBusy(false)
      return
    }

    const payload = {
      dayNumber: n,
      date: form.date,
      weightKg: form.weightKg.trim() === '' ? null : Number(form.weightKg),
      steps: form.steps.trim() === '' ? null : Number(form.steps),
      stepsGoalMet: form.stepsGoalMet,
      workoutCompleted: form.workoutCompleted,
      cardioCompleted: form.cardioCompleted,
      waterCompleted: form.waterCompleted,
      foodCompleted: form.foodCompleted,
      researchCompleted: form.researchCompleted,
      applicationsCount: form.applicationsCount.trim() === '' ? 0 : Number(form.applicationsCount),
      image1Url: form.image1Url || null,
      image2Url: form.image2Url || null,
      image3Url: form.image3Url || null,
      notes: form.notes.trim() === '' ? null : form.notes,
      published: true,
    }

    try {
      const editingNow = editing !== null
      const res = await fetch(
        editingNow ? `/api/challenge/days/${editing}` : '/api/challenge/days',
        {
          method: editingNow ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save.')
      setMsg({ kind: 'ok', text: editingNow ? `Day ${editing} updated.` : `Day ${n} published.` })
      setForm(emptyForm())
      setEditing(null)
      await loadData()
    } catch (err) {
      setMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Could not save.' })
    } finally {
      setBusy(false)
    }
  }

  const edit = (d: ChallengeDay) => {
    setEditing(d.dayNumber)
    setForm({
      dayNumber: String(d.dayNumber),
      date: d.date,
      weightKg: d.weightKg === null ? '' : String(d.weightKg),
      steps: d.steps === null ? '' : String(d.steps),
      stepsGoalMet: d.stepsGoalMet,
      workoutCompleted: d.workoutCompleted,
      cardioCompleted: d.cardioCompleted,
      waterCompleted: d.waterCompleted,
      foodCompleted: d.foodCompleted,
      researchCompleted: d.researchCompleted,
      applicationsCount: String(d.applicationsCount),
      image1Url: d.image1Url ?? '',
      image2Url: d.image2Url ?? '',
      image3Url: d.image3Url ?? '',
      notes: d.notes ?? '',
    })
    setMsg(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (dayNumber: number) => {
    if (!window.confirm(`Delete day ${dayNumber}? This also removes its photos and cannot be undone.`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/challenge/days/${dayNumber}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not delete.')
      setMsg({ kind: 'ok', text: `Day ${dayNumber} deleted.` })
      if (editing === dayNumber) { setEditing(null); setForm(emptyForm()) }
      await loadData()
    } catch (err) {
      setMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Could not delete.' })
    } finally {
      setBusy(false)
    }
  }

  const saveConfig = async (patch: Partial<ChallengeConfig>) => {
    setBusy(true)
    try {
      const res = await fetch('/api/challenge/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save settings.')
      setConfig(data.config)
      setMsg({ kind: 'ok', text: 'Challenge settings saved.' })
    } catch (err) {
      setMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Could not save settings.' })
    } finally {
      setBusy(false)
    }
  }

  /* ---------- render ---------- */
  if (checking) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white flex items-center justify-center">
        <p className="text-white/35 text-sm font-mono">checking session…</p>
      </main>
    )
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300/60 mb-3">Restricted</p>
          <h1 className="text-2xl font-semibold mb-8">Challenge admin</h1>

          {!configured && (
            <p className="mb-6 text-sm text-amber-300/90 border border-amber-400/25 bg-amber-400/10 rounded-xl p-3">
              Admin credentials are not configured on the server. Set CHALLENGE_ADMIN_USER,
              CHALLENGE_ADMIN_PASSWORD_HASH and CHALLENGE_SESSION_SECRET.
            </p>
          )}

          <label className={label} htmlFor="u">Username</label>
          <input id="u" className={`${field} mb-5`} value={username} autoComplete="username"
            onChange={e => setUsername(e.target.value)} required />

          <label className={label} htmlFor="p">Password</label>
          <input id="p" type="password" className={`${field} mb-6`} value={password}
            autoComplete="current-password" onChange={e => setPassword(e.target.value)} required />

          {loginError && <p className="text-rose-400 text-sm mb-4" role="alert">{loginError}</p>}

          <button type="submit" disabled={loggingIn || !configured}
            className="w-full bg-emerald-400 text-black font-semibold rounded-xl py-3.5 disabled:opacity-40">
            {loggingIn ? 'Signing in…' : 'Sign in'}
          </button>

          <Link href="/challenge" className="block text-center mt-6 text-[11px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60">
            ← view the challenge
          </Link>
        </form>
      </main>
    )
  }

  const checkboxes: [keyof FormState, string][] = [
    ['stepsGoalMet', '10k steps'],
    ['workoutCompleted', 'Workout'],
    ['cardioCompleted', 'Cardio'],
    ['waterCompleted', 'Water'],
    ['foodCompleted', 'Food on plan'],
    ['researchCompleted', 'Research'],
  ]

  return (
    <main className="min-h-screen bg-[#08090b] text-white pb-24">
      <div className="max-w-xl mx-auto px-5 pt-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold">Challenge admin</h1>
          <button onClick={logout} className="text-[11px] uppercase tracking-[0.16em] text-white/40 hover:text-white/80">
            Sign out
          </button>
        </div>

        {msg && (
          <p role="status" className={`mb-6 text-sm rounded-xl p-3 border ${
            msg.kind === 'ok'
              ? 'text-emerald-300 border-emerald-400/25 bg-emerald-400/10'
              : 'text-rose-300 border-rose-400/25 bg-rose-400/10'}`}>
            {msg.text}
          </p>
        )}

        {/* ---- day form ---- */}
        <form onSubmit={save} className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-white/45">
              {editing !== null ? `Editing day ${editing}` : 'New day'}
            </h2>
            {editing !== null && (
              <button type="button" onClick={() => { setEditing(null); setForm(emptyForm()) }}
                className="text-[11px] text-white/40 hover:text-white/80">cancel edit</button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="day">Day number</label>
              <input id="day" className={field} inputMode="numeric" value={form.dayNumber}
                onChange={e => set('dayNumber', e.target.value)} required
                disabled={editing !== null} placeholder="17" />
            </div>
            <div>
              <label className={label} htmlFor="date">Date</label>
              <input id="date" type="date" className={field} value={form.date}
                onChange={e => set('date', e.target.value)} required />
            </div>
            <div>
              <label className={label} htmlFor="weight">Weight (kg)</label>
              <input id="weight" className={field} inputMode="decimal" value={form.weightKg}
                onChange={e => set('weightKg', e.target.value)} placeholder="leave blank if none" />
            </div>
            <div>
              <label className={label} htmlFor="steps">Steps</label>
              <input id="steps" className={field} inputMode="numeric" value={form.steps}
                onChange={e => set('steps', e.target.value)} placeholder="e.g. 10412" />
            </div>
          </div>

          <div>
            <label className={label} htmlFor="apps">Applications sent</label>
            <input id="apps" className={field} inputMode="numeric" value={form.applicationsCount}
              onChange={e => set('applicationsCount', e.target.value)} placeholder="0" />
          </div>

          <fieldset>
            <legend className={label}>Completed</legend>
            <div className="grid grid-cols-2 gap-2">
              {checkboxes.map(([k, text]) => {
                const on = form[k] as boolean
                return (
                  <button key={k} type="button" onClick={() => set(k, !on as never)}
                    aria-pressed={on}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm transition-colors ${
                      on ? 'border-emerald-400/60 bg-emerald-400/15 text-emerald-200'
                         : 'border-white/15 bg-white/5 text-white/60'}`}>
                    {text}<span className="font-mono">{on ? '✓' : '—'}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className={label}>Photos</legend>
            <div className="space-y-2">
              {(['1', '2', '3'] as Slot[]).map(slot => {
                const url = form[`image${slot}Url` as keyof FormState] as string
                return (
                  <div key={slot} className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 cursor-pointer">
                      <span className="text-sm text-white/60">
                        {uploading === slot ? 'Uploading…' : url ? `Photo ${slot} ready` : `Add photo ${slot}`}
                      </span>
                      <span className="font-mono text-xs text-emerald-300">{url ? '✓' : '+'}</span>
                      <input type="file" accept="image/*" capture="environment" className="sr-only"
                        onChange={e => { const f = e.target.files?.[0]; if (f) upload(slot, f); e.target.value = '' }} />
                    </label>
                    {url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt={`Photo ${slot} preview`} className="w-12 h-12 rounded-lg object-cover border border-white/15" />
                    )}
                  </div>
                )
              })}
            </div>
          </fieldset>

          <div>
            <label className={label} htmlFor="notes">Notes</label>
            <textarea id="notes" rows={5} className={field} value={form.notes}
              onChange={e => set('notes', e.target.value)} placeholder="How the day actually went." />
          </div>

          <button type="submit" disabled={busy}
            className="w-full bg-emerald-400 text-black font-semibold rounded-xl py-4 text-base disabled:opacity-40">
            {busy ? 'Saving…' : editing !== null ? 'Save changes' : 'Publish day'}
          </button>
        </form>

        {/* ---- settings ---- */}
        {config && (
          <section className="mt-14 border-t border-white/10 pt-8">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-white/45 mb-5">Challenge settings</h2>
            <form onSubmit={e => {
              e.preventDefault()
              const f = new FormData(e.currentTarget as HTMLFormElement)
              saveConfig({
                startDate: String(f.get('startDate') || '') || null,
                startingWeightKg: f.get('startingWeight') ? Number(f.get('startingWeight')) : null,
                goalWeightKg: f.get('goalWeight') ? Number(f.get('goalWeight')) : null,
                challengeLength: Number(f.get('length')) || 100,
                stepsGoal: Number(f.get('stepsGoal')) || 10000,
                applicationsGoal: Number(f.get('appsGoal')) || 50,
                intro: String(f.get('intro') || '') || null,
              })
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label} htmlFor="startDate">Start date</label>
                  <input id="startDate" name="startDate" type="date" className={field}
                    defaultValue={config.startDate ?? ''} />
                </div>
                <div>
                  <label className={label} htmlFor="length">Length</label>
                  <input id="length" name="length" className={field} inputMode="numeric"
                    defaultValue={config.challengeLength} />
                </div>
                <div>
                  <label className={label} htmlFor="startingWeight">Starting weight</label>
                  <input id="startingWeight" name="startingWeight" className={field} inputMode="decimal"
                    defaultValue={config.startingWeightKg ?? ''} />
                </div>
                <div>
                  <label className={label} htmlFor="goalWeight">Goal weight</label>
                  <input id="goalWeight" name="goalWeight" className={field} inputMode="decimal"
                    defaultValue={config.goalWeightKg ?? ''} />
                </div>
                <div>
                  <label className={label} htmlFor="stepsGoal">Steps goal</label>
                  <input id="stepsGoal" name="stepsGoal" className={field} inputMode="numeric"
                    defaultValue={config.stepsGoal} />
                </div>
                <div>
                  <label className={label} htmlFor="appsGoal">Applications goal</label>
                  <input id="appsGoal" name="appsGoal" className={field} inputMode="numeric"
                    defaultValue={config.applicationsGoal} />
                </div>
              </div>
              <div>
                <label className={label} htmlFor="intro">Intro</label>
                <textarea id="intro" name="intro" rows={3} className={field}
                  defaultValue={config.intro ?? ''} placeholder="A short, honest introduction." />
              </div>
              <button type="submit" disabled={busy}
                className="w-full border border-white/20 rounded-xl py-3.5 text-sm text-white/80 disabled:opacity-40">
                Save settings
              </button>
            </form>
          </section>
        )}

        {/* ---- existing days ---- */}
        <section className="mt-14 border-t border-white/10 pt-8">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-white/45 mb-5">
            Published days ({days.length})
          </h2>
          {days.length === 0 ? (
            <p className="text-white/30 text-sm">Nothing published yet.</p>
          ) : (
            <ul className="space-y-2">
              {[...days].sort((a, b) => b.dayNumber - a.dayNumber).map(d => (
                <li key={d.id} className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-3">
                  <span className="font-mono text-white/50 text-sm w-10">{String(d.dayNumber).padStart(3, '0')}</span>
                  <span className="flex-1 min-w-0 text-xs text-white/40 truncate">
                    {d.date}{d.weightKg !== null && ` · ${d.weightKg} kg`}
                  </span>
                  <button onClick={() => edit(d)} className="text-xs text-emerald-300 px-2 py-1">Edit</button>
                  <button onClick={() => remove(d.dayNumber)} className="text-xs text-rose-400 px-2 py-1">Delete</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Link href="/challenge" className="block text-center mt-12 text-[11px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60">
          view public challenge →
        </Link>
      </div>
    </main>
  )
}
