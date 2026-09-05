import { ImageResponse } from 'next/og'
import portfolioData from '@/content/portfolio.json'
import projectsData from '@/content/projects.json'
import { Portfolio } from '@/types'

// Dynamically generated social-share card (1200x630 PNG). Next.js auto-wires
// this to og:image and twitter:image, so link previews on LinkedIn, Slack,
// iMessage, X, etc. render a branded card that stays in sync with content.
export const runtime = 'edge'
export const alt = 'Phaneendra Gavara — AI/ML Engineer · Data Scientist · Data Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const portfolio = portfolioData as Portfolio

export default function OpengraphImage() {
  const [firstName, ...rest] = portfolio.name.split(' ')
  const lastName = rest.join(' ')
  const pills = [
    'AWS Solutions Architect',
    'AWS AI Practitioner',
    `${projectsData.length}+ projects shipped`,
    'Agentic AI · LLMs · RAG',
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0b1020 0%, #12172b 55%, #1a1140 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* accent glow */}
        <div
          style={{
            position: 'absolute',
            top: '-160px',
            right: '-120px',
            width: '560px',
            height: '560px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.45), transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-180px',
            left: '-120px',
            width: '480px',
            height: '480px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(20,184,166,0.30), transparent 70%)',
            display: 'flex',
          }}
        />

        {/* top row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{ fontSize: '22px', letterSpacing: '6px', color: '#94a3b8', display: 'flex' }}>
            PORTFOLIO
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '9999px', background: '#34d399', display: 'flex' }} />
            <div style={{ fontSize: '22px', color: '#6ee7b7', display: 'flex' }}>Open to work</div>
          </div>
        </div>

        {/* name */}
        <div style={{ display: 'flex', fontSize: '96px', fontWeight: 800, lineHeight: 1.05 }}>
          <span style={{ color: '#ffffff', marginRight: '26px' }}>{firstName}</span>
          <span style={{ color: '#a78bfa' }}>{lastName}</span>
        </div>

        {/* subtitle */}
        <div style={{ display: 'flex', fontSize: '38px', color: '#cbd5e1', marginTop: '18px' }}>
          {portfolio.title}
        </div>

        {/* pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '40px' }}>
          {pills.map((p) => (
            <div
              key={p}
              style={{
                display: 'flex',
                fontSize: '24px',
                color: '#e2e8f0',
                padding: '12px 22px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.06)',
              }}
            >
              {p}
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ display: 'flex', fontSize: '24px', color: '#64748b', marginTop: '48px' }}>
          {portfolio.email}
        </div>
      </div>
    ),
    { ...size }
  )
}
