'use client'

import { motion } from 'framer-motion'
import { Award, ExternalLink } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import { getAccents } from '@/lib/themeTokens'
import resumeData from '@/content/resume.json'
import { Resume } from '@/types'

const resume = resumeData as Resume

const AWS_ORANGE = '#FF9900'

function formatDate(ym: string) {
  const [year, month] = ym.split('-').map(Number)
  if (!year || !month) return ym
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export default function CertificationsSection() {
  const { theme } = useTheme()
  const { accent, light: isLight, mono: isTerminal } = getAccents(theme)

  if (isTerminal) return null
  if (!resume.certifications?.length) return null

  return (
    <section className="py-16 px-4 relative" id="certifications">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-xs tracking-widest mb-2 font-medium" style={{ color: accent }}>
            Verified
          </p>
          <h2
            className="font-display text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            Certifications
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {resume.certifications.map((cert, i) => {
            const isAws = cert.issuer.toLowerCase().includes('amazon')
            const cardAccent = isAws ? AWS_ORANGE : accent
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ y: -3 }}
                className="relative p-5 rounded-2xl border overflow-hidden"
                style={{
                  borderColor: isAws ? `${AWS_ORANGE}45` : isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
                  background: isLight
                    ? isAws ? `${AWS_ORANGE}08` : 'rgba(0,0,0,0.03)'
                    : isAws ? `${AWS_ORANGE}0f` : 'rgba(255,255,255,0.03)',
                }}
              >
                {isAws && (
                  <span
                    className="absolute top-0 right-0 text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-bl-lg"
                    style={{ background: AWS_ORANGE, color: '#0f1117' }}
                  >
                    AWS
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className="p-2.5 rounded-lg flex-shrink-0"
                    style={{ background: `${cardAccent}18`, color: cardAccent }}
                  >
                    <Award size={16} />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className="text-sm font-semibold leading-snug pr-6"
                      style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                    >
                      {cert.name}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: isLight ? '#64748b' : 'rgba(255,255,255,0.5)' }}>
                      {cert.issuer} · {formatDate(cert.date)}
                    </p>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs mt-2 font-medium hover:underline"
                        style={{ color: cardAccent }}
                      >
                        Verify <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
