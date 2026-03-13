import { useState, useEffect, useCallback } from 'react'

interface ContextMenuState {
  isOpen: boolean
  x: number
  y: number
  targetId: string | null
}

export function useContextMenu() {
  const [state, setState] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    targetId: null,
  })

  const open = useCallback((x: number, y: number, targetId: string | null = null) => {
    setState({ isOpen: true, x, y, targetId })
  }, [])

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  // Schließen bei Klick außerhalb oder Escape
  useEffect(() => {
    if (!state.isOpen) return
    const handleClick = () => close()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [state.isOpen, close])

  return { ...state, open, close }
}
