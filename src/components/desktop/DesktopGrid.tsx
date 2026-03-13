import { useDesktopGrid } from '../../hooks/useDesktopGrid'

export default function DesktopGrid() {
  const { cols, rows, cellSize } = useDesktopGrid(100)

  return (
    <div
      className="w-full h-full"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        padding: '8px',
        gap: '4px',
      }}
    >
      {/* Grid-Zellen als Drop-Targets (wird in Task 4.3 mit useDroppable ausgestattet) */}
      {Array.from({ length: cols * rows }).map((_, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        return <GridCell key={`${col}-${row}`} col={col} row={row} />
      })}
      {import.meta.env.DEV && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #fff 1px, transparent 1px),
              linear-gradient(to bottom, #fff 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
          }}
        />
      )}
    </div>
  )
}

interface GridCellProps {
  col: number
  row: number
}

function GridCell({ col, row }: GridCellProps) {
  return (
    <div
      data-col={col}
      data-row={row}
      className="w-full h-full rounded-lg hover:bg-white/5 transition-colors duration-150"
      // wird in Task 4.3 mit useDroppable erweitert
    />
  )
}
