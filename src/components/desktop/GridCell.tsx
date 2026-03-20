import { useDroppable } from '@dnd-kit/core'

interface GridCellProps {
  col: number
  row: number
  children?: React.ReactNode
}

export default function GridCell({ col, row, children }: GridCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${col}-${row}`,
    data: {
      type: 'cell',
      col,
      row,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        relative flex items-center justify-center w-full h-full
        transition-colors duration-150
        ${isOver ? 'bg-white/10 rounded-xl ring-2 ring-white/30' : ''}
      `}
    >
      {children}
    </div>
  )
}
