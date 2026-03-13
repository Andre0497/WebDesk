import { FolderIcon as HeroFolderIcon } from '@heroicons/react/24/solid'
import type { FolderItem } from '../../types'
import IconLabel from './IconLabel'

interface FolderIconProps {
  item: FolderItem
  itemCount?: number
  onDoubleClick?: (id: string) => void
  onContextMenu?: (e: React.MouseEvent, id: string) => void
  // wird in Task 4.2 um Drag-Props erweitert
}

export default function FolderIcon({
  item,
  itemCount = 0,
  onDoubleClick,
  onContextMenu,
}: FolderIconProps) {
  const handleDoubleClick = () => {
    onDoubleClick?.(item.id)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu?.(e, item.id)
  }

  return (
    <div
      className="flex flex-col items-center justify-start w-[88px] cursor-pointer group select-none"
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      title={item.name}
    >
      {/* Icon-Container */}
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
    </div>
  )
}
