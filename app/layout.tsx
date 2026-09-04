import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './tokens.css'
import './globals.css'
import { ThemeProvider } from '@/lib/context/ThemeContext'
import ThemedLayout from '@/components/shared/ThemedLayout'
import { getPortfolio } from '@/lib/config'
import { THEME_LIST } from '@/lib/themes'
import { ThemeId } from '@/types'

const portfolio = getPortfolio()

export const metadata: Metadata = {
  title: portfolio.seo.title,
  description: portfolio.seo.description,
  keywords: portfolio.seo.keywords,
  authors: [{ name: portfolio.name }],
  openGraph: {
    title: portfolio.seo.title,
    description: portfolio.seo.description,
    url: process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://phaneendra.vercel.app',
    siteName: portfolio.name,
    images: [{ url: portfolio.seo.ogImage, width: 1200, height: 630, alt: portfolio.seo.title }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: portfolio.seo.title,
    description: portfolio.seo.description,
    images: [portfolio.seo.ogImage],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://phaneendra.vercel.app'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const defaultTheme = (process.env.NEXT_PUBLIC_DEFAULT_THEME || portfolio.defaultTheme) as ThemeId

  // Inline, blocking script runs BEFORE first paint so the correct
  // theme is applied immediately (no flash on navigation or first load).
  // Validates the stored value against the current theme list so a stale
  // id from a since-removed theme (e.g. from before a theme was retired)
  // can't apply CSS tokens that no longer have matching React components.
  const validThemeIds = THEME_LIST.map(t => t.id)
  const noFlashScript = `
(function(){try{
  var valid = ${JSON.stringify(validThemeIds)};
  var t = localStorage.getItem('portfolio-theme');
  if (!t || valid.indexOf(t) === -1) t = ${JSON.stringify(defaultTheme)};
  document.documentElement.setAttribute('data-theme', t);
}catch(e){
  document.documentElement.setAttribute('data-theme', ${JSON.stringify(defaultTheme)});
}})();`

  return (
    <html lang="en" data-theme={defaultTheme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        {/* Graceful degradation: Framer Motion inlines the pre-animation state
            (opacity:0, transforms) during SSR and reveals it with JS. If JS
            never runs — crawlers, a failed bundle, reduced-motion edge cases —
            this ensures the content is still visible rather than blank. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important}
[style*="translate"],[style*="scale"]{transform:none!important}`}</style>
        </noscript>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider defaultTheme={defaultTheme}>
          <ThemedLayout>
            {children}
          </ThemedLayout>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
