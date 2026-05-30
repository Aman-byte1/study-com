'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * IntersectionObserver hook for scroll-triggered reveals
 * @param options IntersectionObserver options
 * @returns [ref, isVisible]
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return [ref, isVisible]
}

/**
 * Counter animation hook — animates from 0 to target value
 * @param target The target number
 * @param duration Duration in ms
 * @param shouldStart Whether the animation should start
 * @returns Current animated value
 */
export function useCountUp(
  target: number,
  duration: number = 1500,
  shouldStart: boolean = true
): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!shouldStart) return

    let startTime: number | null = null
    let raf: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))

      if (progress < 1) {
        raf = requestAnimationFrame(animate)
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, shouldStart])

  return value
}

/**
 * Staggered animation delay helper
 * @param index Item index
 * @param baseDelay Base delay in ms
 * @returns CSS animation-delay value
 */
export function staggerDelay(index: number, baseDelay: number = 80): string {
  return `${index * baseDelay}ms`
}

/**
 * Typewriter effect hook
 */
export function useTypewriter(
  text: string,
  speed: number = 50,
  shouldStart: boolean = true
): string {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!shouldStart || index >= text.length) return

    const timer = setTimeout(() => {
      setDisplayed(prev => prev + text[index])
      setIndex(prev => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [text, speed, index, shouldStart])

  return displayed
}

/**
 * Generate CSS keyframe for diagonal shimmer
 */
export function shimmerKeyframes(): string {
  return `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `
}

/**
 * Get scroll-reveal animation class based on direction
 */
export function getRevealClass(
  direction: 'up' | 'down' | 'left' | 'right' | 'scale' = 'up',
  visible: boolean
): string {
  if (visible) {
    const map = {
      up: 'animate-fade-in-up',
      down: 'animate-fade-in-down',
      left: 'animate-fade-in-left',
      right: 'animate-slide-in-right',
      scale: 'animate-scale-in',
    }
    return map[direction]
  }
  return 'opacity-0'
}