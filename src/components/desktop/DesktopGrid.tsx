import { useDesktopGrid } from '../../hooks/useDesktopGrid'
import LinkIcon from '../icons/LinkIcon'
import FolderIcon from '../icons/FolderIcon'
import GridCell from './GridCell'
import type { DesktopItem, LinkItem, FolderItem } from '../../types'

interface DesktopGridProps {
  items: DesktopItem[]
  allItems: DesktopItem[]
  onIconContextMenu?: (e: React.MouseEvent, id: string) => void
  onFolderContextMenu?: (e: React.MouseEvent, id: string) => void
  onFolderDoubleClick?: (id: string) => void
}

export default function DesktopGrid({
  items,
  allItems,
  onIconContextMenu,
  onFolderContextMenu,
  onFolderDoubleClick,
}: DesktopGridProps) {
  const { cols, rows, cellSize } = useDesktopGrid(100)

  // Items nach Grid-Position indexieren
  const itemMap = new Map(items.map(i => [`${i.position.col}-${i.position.row}`, i]))

  const getItemCount = (folderId: string) =>
    allItems.filter(item => item.parentId === folderId).length

  return (
    <div
      className="relative w-full h-full"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        padding: '8px',
        gap: '4px',
      }}
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const item = itemMap.get(`${col}-${row}`)
          return (
            <GridCell key={`${col}-${row}`} col={col} row={row}>
              {item && (
                item.type === 'link' ? (
                  <LinkIcon item={item as LinkItem} onContextMenu={onIconContextMenu} />
                ) : (
                  <FolderIcon
                    item={item as FolderItem}
                    itemCount={getItemCount(item.id)}
                    onDoubleClick={onFolderDoubleClick}
                    onContextMenu={onFolderContextMenu}
                  />
                )
              )}
            </GridCell>
          )
        })
      )}
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
