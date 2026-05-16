'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ThemeId } from '@/types'
import { isValidTheme } from '@/lib/themes'

interface ThemeContextType {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'glassmorphism',
  setTheme: () => {},
})

export function ThemeProvider({
  children,
  defaultTheme = 'glassmorphism',
}: {
  children: React.ReactNode
  defaultTheme?: ThemeId
}) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme)

  useEffect(() => {
    const stored = localStorage.getItem('portfolio-theme')
    if (stored && isValidTheme(stored)) {
      setThemeState(stored)
    }
  }, [])

  useEffect(() => {
    // Remove old theme classes
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme)
    localStorage.setItem('portfolio-theme', newTheme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
