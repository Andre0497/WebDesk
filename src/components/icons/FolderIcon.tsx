import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { FolderIcon as HeroFolderIcon } from '@heroicons/react/24/solid'
import type { FolderItem } from '../../types'
import IconLabel from './IconLabel'
import { IconWrapper } from './IconWrapper'

interface FolderIconProps {
  item: FolderItem
  itemCount?: number
  onDoubleClick?: (id: string) => void
  onContextMenu?: (e: React.MouseEvent, id: string) => void
}

export default function FolderIcon({
  item,
  itemCount = 0,
  onDoubleClick,
  onContextMenu,
}: FolderIconProps) {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: {
      type: 'folder',
      item,
    },
  })

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `folder-drop-${item.id}`,
    data: {
      type: 'folder',
      folderId: item.id,
    },
  })

  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node)
    setDropRef(node)
  }

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const handleDoubleClick = () => {
    if (isDragging) return
    onDoubleClick?.(item.id)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu?.(e, item.id)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      animate={
        isDragging
          ? { scale: 1.1, rotate: 3, opacity: 0.85 }
          : { scale: 1, rotate: 0, opacity: 1 }
      }
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      {...listeners}
      {...attributes}
      className={`w-[88px] cursor-grab active:cursor-grabbing select-none${isOver ? ' drop-shadow-[0_0_14px_rgba(255,255,255,0.7)]' : ''}`}
      title={item.name}
    >
      <IconWrapper
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        isDragging={isDragging || isOver}
      >
        {/* Icon-Container */}
        <div className="relative z-10">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center
                       backdrop-blur-sm transition-all duration-150 ease-out
                       ${isOver ? 'border-2 border-white/60 ring-2 ring-white/60 scale-110' : 'border border-white/20'}`}
            style={{ backgroundColor: `${item.color}33` }}
          >
            {item.emoji ? (
              <span className="text-3xl leading-none select-none">{item.emoji}</span>
            ) : (
              <HeroFolderIcon className="w-9 h-9 drop-shadow-md" style={{ color: item.color }} />
            )}
          </div>

          {/* Item-Count Badge */}
          {itemCount > 0 && (
            <div
              className="absolute -top-1.5 -right-1.5
                         min-w-[20px] h-5 px-1.5 rounded-full
                         bg-gray-900 border border-white/20
                         flex items-center justify-center
                         text-[10px] font-bold text-white/80"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </div>
          )}

          {/* Öffnen-Indikator */}
          {item.isOpen && (
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}
        </div>

        {/* Label */}
        <IconLabel name={item.name} />
      </IconWrapper>
    </motion.div>
  )
}
