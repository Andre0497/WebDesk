import { useState, useEffect, useCallback } from 'react'

interface GridDimensions {
  cols: number
  rows: number
  cellSize: number
}

export function useDesktopGrid(cellSize: number = 100): GridDimensions {
  const TASKBAR_HEIGHT = 48 // px – Höhe der Taskbar

  const calculate = useCallback(
    (): GridDimensions => ({
      cols: Math.floor(window.innerWidth / cellSize),
      rows: Math.floor((window.innerHeight - TASKBAR_HEIGHT) / cellSize),
      cellSize,
    }),
    [cellSize]
  )

  const [dimensions, setDimensions] = useState<GridDimensions>(calculate)

  useEffect(() => {
    const handleResize = () => setDimensions(calculate())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculate])

  return dimensions
}
