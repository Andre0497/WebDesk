import React, { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import type { LinkItem } from '../../types'
import IconLabel from './IconLabel'
import { IconWrapper } from './IconWrapper'

interface LinkIconProps {
  item: LinkItem
  onContextMenu?: (e: React.MouseEvent, id: string) => void
}

const LinkIcon = React.memo(function LinkIcon({ item, onContextMenu }: LinkIconProps) {
  const [faviconError, setFaviconError] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: {
      type: 'link',
      item,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
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
      className="w-[88px] cursor-grab active:cursor-grabbing select-none"
      title={item.url}
    >
      <IconWrapper
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        isDragging={isDragging}
      >
        {/* Icon-Container */}
        <div
          className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center
                     bg-white/10 backdrop-blur-sm border border-white/20"
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
      </IconWrapper>
    </motion.div>
  )
})

export default LinkIcon
