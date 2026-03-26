import { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DndContext, closestCenter } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import WindowTitleBar from './WindowTitleBar'
import WindowGrid from './WindowGrid'
import type { FolderItem, DesktopItem, Position } from '../../types'
import { folderWindowVariants } from '../../utils/animations'

interface FolderWindowProps {
  folder: FolderItem
  items: DesktopItem[]
  onClose: () => void
  onItemContextMenu?: (e: React.MouseEvent, id: string) => void
  onItemsReorder?: (updates: Array<{ id: string; position: Position }>) => void
}

export default function FolderWindow({
  folder,
  items,
  onClose,
  onItemContextMenu,
  onItemsReorder,
}: FolderWindowProps) {
  const [position, setPosition] = useState(
    folder.windowPosition ?? { x: 200, y: 100 },
  )
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 })
  const prefersReducedMotion = useReducedMotion()

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: position.x,
      winY: position.y,
    }

    const handleMouseMove = (ev: MouseEvent) => {
      setPosition({
        x: dragStartRef.current.winX + (ev.clientX - dragStartRef.current.mouseX),
        y: dragStartRef.current.winY + (ev.clientY - dragStartRef.current.mouseY),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const sortedItems = [...items].sort(
    (a, b) => a.position.row - b.position.row || a.position.col - b.position.col,
  )

  function handleFolderDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sortedItems.findIndex(i => i.id === active.id)
    const newIndex = sortedItems.findIndex(i => i.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(sortedItems, oldIndex, newIndex)
    const updates = reordered.map((item, index) => ({
      id: item.id,
      position: { col: index % 4, row: Math.floor(index / 4) },
    }))
    onItemsReorder?.(updates)
  }

  return (
    <motion.div
      key={folder.id}
      variants={prefersReducedMotion ? undefined : folderWindowVariants}
      initial={prefersReducedMotion ? { opacity: 0 } : 'hidden'}
      animate={prefersReducedMotion ? { opacity: 1 } : 'visible'}
      exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
      style={{
        left: position.x,
        top: position.y,
        transformOrigin: 'center bottom',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderColor: 'var(--glass-border)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        willChange: 'transform',
      }}
      className={`fixed z-40 w-80 min-h-40 max-h-[60vh]
                  border rounded-2xl
                  flex flex-col overflow-hidden
                  ${isDragging ? 'cursor-grabbing' : ''}`}
    >
      <WindowTitleBar
        title={folder.name}
        color={folder.color}
        emoji={folder.emoji}
        onClose={onClose}
        dragHandleProps={{ onMouseDown: handleTitleMouseDown }}
      />

      <div className="flex-1 overflow-y-auto p-2">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleFolderDragEnd}>
          <WindowGrid items={items} onItemContextMenu={onItemContextMenu} />
        </DndContext>
      </div>

      <div
        className="px-4 py-2 border-t text-xs text-white/40 text-right"
        style={{ borderColor: 'var(--glass-border-light)' }}
      >
        {items.length} {items.length === 1 ? 'Element' : 'Elemente'}
      </div>
    </motion.div>
  )
}
