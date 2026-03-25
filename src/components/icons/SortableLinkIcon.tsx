import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import type { LinkItem } from '../../types'
import IconLabel from './IconLabel'

interface SortableLinkIconProps {
  item: LinkItem
  onContextMenu?: (e: React.MouseEvent, id: string) => void
}

export default function SortableLinkIcon({ item, onContextMenu }: SortableLinkIconProps) {
  const [faviconError, setFaviconError] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { type: 'link', item },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const handleDoubleClick = () => {
    if (isDragging) return
    if (/^https?:\/\//i.test(item.url)) {
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
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
      title={item.url}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center
                   bg-white/10 backdrop-blur-sm border border-white/20
                   group-hover:bg-white/20 group-hover:scale-110
                   group-active:scale-95
                   transition-all duration-150 ease-out"
      >
        {item.faviconUrl && !faviconError ? (
          <img
            src={item.faviconUrl}
            alt={item.name}
            className="w-8 h-8 rounded-md object-contain"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <GlobeAltIcon className="w-8 h-8 text-white/70" />
        )}
      </div>
      <IconLabel name={item.name} />
    </div>
  )
}
