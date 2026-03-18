import LinkIcon from '../icons/LinkIcon'
import FolderIcon from '../icons/FolderIcon'
import type { DesktopItem, LinkItem, FolderItem } from '../../types'
import { isLinkItem, isFolderItem } from '../../types'

interface WindowGridProps {
  items: DesktopItem[]
  onItemContextMenu?: (e: React.MouseEvent, id: string) => void
}

export default function WindowGrid({ items, onItemContextMenu }: WindowGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-white/30 text-sm">
        <span className="text-3xl mb-2">📂</span>
        Ordner ist leer
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3 p-2">
      {items.map(item => (
        <div key={item.id}>
          {isLinkItem(item) && (
            <LinkIcon item={item as LinkItem} onContextMenu={onItemContextMenu} />
          )}
          {isFolderItem(item) && (
            <FolderIcon item={item as FolderItem} onContextMenu={onItemContextMenu} />
          )}
        </div>
      ))}
    </div>
  )
}
