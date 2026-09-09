'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown, FileText } from 'lucide-react'
import { RESUMES, resumeUrl } from '@/lib/resumes'

interface ResumeDropdownProps {
  label?: string
  triggerCls: string
  triggerStyle?: React.CSSProperties
  menuCls: string
  itemCls: string
  openUp?: boolean
}

export default function ResumeDropdown({
  label = 'Download CV',
  triggerCls,
  triggerStyle,
  menuCls,
  itemCls,
  openUp = false,
}: ResumeDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={triggerCls}
        style={triggerStyle}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Download size={15} />
        {label}
        <ChevronDown
          size={11}
          className={`ml-0.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute ${openUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'} left-0 z-50 w-[290px] max-w-[80vw] max-h-[min(70vh,420px)] overflow-y-auto overscroll-contain ${menuCls}`}
        >
          {RESUMES.map(r => (
            <a
              key={r.id}
              role="menuitem"
              href={resumeUrl(r)}
              download={r.file}
              onClick={() => setOpen(false)}
              className={`${itemCls} flex items-start gap-2.5`}
            >
              <FileText size={14} className="mt-0.5 flex-shrink-0 opacity-60" />
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2">
                  <span className="font-medium truncate">{r.label}</span>
                  <span className="text-[10px] px-1.5 py-px rounded-full border border-current opacity-50 flex-shrink-0">
                    {r.pages}p
                  </span>
                </span>
                <span className="block text-[11px] opacity-60 leading-snug mt-0.5">
                  {r.description}
                </span>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
