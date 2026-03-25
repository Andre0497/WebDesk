import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FolderIcon as HeroFolderIcon } from '@heroicons/react/24/solid'
import type { FolderItem } from '../../types'
import IconLabel from './IconLabel'

interface SortableFolderIconProps {
  item: FolderItem
  onDoubleClick?: (id: string) => void
  onContextMenu?: (e: React.MouseEvent, id: string) => void
}

export default function SortableFolderIcon({
  item,
  onDoubleClick,
  onContextMenu,
}: SortableFolderIconProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { type: 'folder', item },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center justify-start w-[88px] cursor-grab active:cursor-grabbing group select-none"
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      title={item.name}
    >
      <div className="relative">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center
                     backdrop-blur-sm border border-white/20
                     group-hover:scale-110 group-active:scale-95
                     transition-all duration-150 ease-out"
          style={{ backgroundColor: `${item.color}33` }}
        >
          {item.emoji ? (
            <span className="text-3xl leading-none select-none">{item.emoji}</span>
          ) : (
            <HeroFolderIcon className="w-9 h-9 drop-shadow-md" style={{ color: item.color }} />
          )}
        </div>
      </div>
      <IconLabel name={item.name} />
    </div>
  )
}
