'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown } from 'lucide-react'

const AI_URL   = '/resume/Phaneendra_Gavara_AI_Resume.pdf'
const DATA_URL = '/resume/Phaneendra_Gavara_Data_Resume.pdf'

interface ResumeDropdownProps {
  label?: string
  triggerCls: string
  triggerStyle?: React.CSSProperties
  menuCls: string
  itemCls: string
}

export default function ResumeDropdown({
  label = 'Download CV',
  triggerCls,
  triggerStyle,
  menuCls,
  itemCls,
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={triggerCls}
        style={triggerStyle}
      >
        <Download size={15} />
        {label}
        <ChevronDown
          size={11}
          className={`ml-0.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className={`absolute top-full mt-1.5 left-0 z-50 min-w-[180px] overflow-hidden ${menuCls}`}>
          <a
            href={AI_URL}
            download="Phaneendra_Gavara_AI_Resume.pdf"
            onClick={() => setOpen(false)}
            className={itemCls}
          >
            AI / ML Resume
          </a>
          <a
            href={DATA_URL}
            download="Phaneendra_Gavara_Data_Resume.pdf"
            onClick={() => setOpen(false)}
            className={itemCls}
          >
            Data Resume
          </a>
        </div>
      )}
    </div>
  )
}
