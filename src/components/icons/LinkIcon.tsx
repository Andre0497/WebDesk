import { useState } from 'react'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import type { LinkItem } from '../../types'
import IconLabel from './IconLabel'

interface LinkIconProps {
  item: LinkItem
  onContextMenu?: (e: React.MouseEvent, id: string) => void
  // wird in Task 4.2 um Drag-Props erweitert
}

export default function LinkIcon({ item, onContextMenu }: LinkIconProps) {
  const [faviconError, setFaviconError] = useState(false)

  const handleDoubleClick = () => {
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
      className="flex flex-col items-center justify-start w-[88px] cursor-pointer
                 group select-none"
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      title={item.url}
    >
      {/* Icon-Container */}
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

      {/* Label */}
      <IconLabel name={item.name} />
    </div>
  )
}
