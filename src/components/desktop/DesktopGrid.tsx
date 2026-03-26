import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useDesktopGrid } from '../../hooks/useDesktopGrid'
import LinkIcon from '../icons/LinkIcon'
import FolderIcon from '../icons/FolderIcon'
import GridCell from './GridCell'
import { desktopGridVariants, iconEnterVariants } from '../../utils/animations'
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
  const shouldReduceMotion = useReducedMotion()

  // Capture item IDs present on the initial render (lazy initializer runs once).
  // Items added after mount are identified by absence from this set and will
  // animate independently rather than relying on the parent stagger.
  const [initialItemIds] = useState<Set<string>>(() => new Set(items.map(i => i.id)))

  // Items nach Grid-Position indexieren
  const itemMap = new Map(items.map(i => [`${i.position.col}-${i.position.row}`, i]))

  const getItemCount = (folderId: string) =>
    allItems.filter(item => item.parentId === folderId).length

  return (
    <motion.div
      className="relative w-full h-full"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        padding: '8px',
        gap: '4px',
      }}
      variants={shouldReduceMotion ? undefined : desktopGridVariants}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const item = itemMap.get(`${col}-${row}`)
          return (
            <GridCell key={`${col}-${row}`} col={col} row={row}>
              {item && (
                <motion.div
                  variants={shouldReduceMotion ? undefined : iconEnterVariants}
                  {...(!shouldReduceMotion && !initialItemIds.has(item.id)
                    ? { initial: 'hidden', animate: 'visible' }
                    : {})}
                  layout
                >
                  {item.type === 'link' ? (
                    <LinkIcon item={item as LinkItem} onContextMenu={onIconContextMenu} />
                  ) : (
                    <FolderIcon
                      item={item as FolderItem}
                      itemCount={getItemCount(item.id)}
                      onDoubleClick={onFolderDoubleClick}
                      onContextMenu={onFolderContextMenu}
                    />
                  )}
                </motion.div>
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
    </motion.div>
  )
}
