'use client'

import { useState, useEffect, useRef } from 'react'

interface UseTypewriterOptions {
  words: string[]
  typeSpeed?: number
  deleteSpeed?: number
  pauseTime?: number
  loop?: boolean
}

export function useTypewriter({
  words,
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseTime = 2000,
  loop = true,
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const currentWord = words[wordIndex % words.length]

    const tick = () => {
      if (isPaused) return

      if (!isDeleting) {
        // Typing
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
          timeoutRef.current = setTimeout(tick, typeSpeed + Math.random() * 30)
        } else {
          // Fully typed — pause then delete
          setIsPaused(true)
          timeoutRef.current = setTimeout(() => {
            setIsPaused(false)
            setIsDeleting(true)
          }, pauseTime)
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1))
          timeoutRef.current = setTimeout(tick, deleteSpeed)
        } else {
          // Fully deleted — move to next word
          setIsDeleting(false)
          if (loop || wordIndex < words.length - 1) {
            setWordIndex(i => (i + 1) % words.length)
          }
          timeoutRef.current = setTimeout(tick, 200)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, typeSpeed)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [displayText, isDeleting, isPaused, wordIndex, words, typeSpeed, deleteSpeed, pauseTime, loop])

  return { displayText, isTyping: !isDeleting && displayText.length < words[wordIndex % words.length].length }
}
