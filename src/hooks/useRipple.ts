import { useCallback, useRef, useState } from 'react'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)

  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()

    const size = Math.max(rect.width, rect.height) * 2
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const id = nextId.current++
    setRipples((prev) => [...prev, { id, x, y, size }])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }, [])

  return { ripples, createRipple }
}
