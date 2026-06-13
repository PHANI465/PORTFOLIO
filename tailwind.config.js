/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Cyberpunk theme
        cyber: {
          neon: '#00fff5',
          pink: '#ff0090',
          yellow: '#ffd700',
          dark: '#0a0a1a',
          darker: '#050510',
          purple: '#7b2fff',
        },
        // Terminal theme
        terminal: {
          green: '#00ff41',
          dark: '#0d0d0d',
          amber: '#ffb000',
          comment: '#4a5568',
        },
        // Glass theme
        glass: {
          purple: '#8b5cf6',
          blue: '#3b82f6',
          pink: '#ec4899',
          teal: '#14b8a6',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        body: ['var(--font-body)', 'var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        cyber: ['Orbitron', 'var(--font-sans)'],
        terminal: ['Share Tech Mono', 'var(--font-mono)'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      // Type scale reads from tokens.css — size/leading/tracking triplets
      fontSize: {
        xs:   ['var(--text-xs)',   { lineHeight: 'var(--leading-xs)',   letterSpacing: 'var(--tracking-xs)' }],
        sm:   ['var(--text-sm)',   { lineHeight: 'var(--leading-sm)',   letterSpacing: 'var(--tracking-sm)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-base)', letterSpacing: 'var(--tracking-base)' }],
        lg:   ['var(--text-lg)',   { lineHeight: 'var(--leading-lg)',   letterSpacing: 'var(--tracking-lg)' }],
        xl:   ['var(--text-xl)',   { lineHeight: 'var(--leading-xl)',   letterSpacing: 'var(--tracking-xl)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-2xl)',  letterSpacing: 'var(--tracking-2xl)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-3xl)',  letterSpacing: 'var(--tracking-3xl)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-4xl)',  letterSpacing: 'var(--tracking-4xl)' }],
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-5xl)',  letterSpacing: 'var(--tracking-5xl)' }],
        '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-6xl)',  letterSpacing: 'var(--tracking-6xl)' }],
        '7xl': ['var(--text-7xl)', { lineHeight: 'var(--leading-7xl)',  letterSpacing: 'var(--tracking-7xl)' }],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
        cinematic: 'var(--duration-cinematic)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        spring: 'var(--ease-spring)',
        'in-out': 'var(--ease-in-out)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glitch': 'glitch 0.5s infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'type-cursor': 'type-cursor 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fade-in 0.5s ease-in',
        'slide-up': 'slide-up 0.5s ease-out',
        'matrix-rain': 'matrix-rain 2s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'pulse-neon': {
          '0%, 100%': { textShadow: '0 0 5px #00fff5, 0 0 10px #00fff5, 0 0 20px #00fff5' },
          '50%': { textShadow: '0 0 2px #00fff5, 0 0 5px #00fff5' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'type-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0,255,245,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,245,0.1) 1px, transparent 1px)",
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'neon-gradient': 'linear-gradient(135deg, #00fff5 0%, #ff0090 50%, #7b2fff 100%)',
        'space-gradient': 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
