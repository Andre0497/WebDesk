import { motion } from 'framer-motion'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { FolderIcon as HeroFolderIcon } from '@heroicons/react/24/solid'
import type { DesktopItem, LinkItem, FolderItem } from '../../types'

interface DragPreviewProps {
  item: DesktopItem
}

export default function DragPreview({ item }: DragPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.85, scale: 1.05 }}
      className="flex flex-col items-center gap-1 pointer-events-none select-none"
    >
      {item.type === 'link' ? (
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center
                     bg-white/10 backdrop-blur-sm border border-white/20
                     shadow-2xl ring-2 ring-white/40"
        >
          {(item as LinkItem).faviconUrl ? (
            <img
              src={(item as LinkItem).faviconUrl}
              alt={item.name}
              className="w-8 h-8 rounded-md object-contain"
            />
          ) : (
            <GlobeAltIcon className="w-8 h-8 text-white/70" />
          )}
        </div>
      ) : (
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center
                     backdrop-blur-sm border border-white/20
                     shadow-2xl ring-2 ring-white/40"
          style={{ backgroundColor: `${(item as FolderItem).color}33` }}
        >
          {(item as FolderItem).emoji ? (
            <span className="text-3xl leading-none select-none">{(item as FolderItem).emoji}</span>
          ) : (
            <HeroFolderIcon
              className="w-9 h-9 drop-shadow-md"
              style={{ color: (item as FolderItem).color }}
            />
          )}
        </div>
      )}
      <span className="text-white text-xs bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
        {item.name}
      </span>
    </motion.div>
  )
}
