import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import SortableLinkIcon from '../icons/SortableLinkIcon'
import SortableFolderIcon from '../icons/SortableFolderIcon'
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

  const sortedItems = [...items].sort(
    (a, b) => a.position.row - b.position.row || a.position.col - b.position.col,
  )

  const itemIds = sortedItems.map(i => i.id)

  return (
    <SortableContext items={itemIds} strategy={rectSortingStrategy}>
      <div className="grid grid-cols-4 gap-4 p-2">
        {sortedItems.map(item =>
          isLinkItem(item) ? (
            <SortableLinkIcon
              key={item.id}
              item={item as LinkItem}
              onContextMenu={onItemContextMenu}
            />
          ) : isFolderItem(item) ? (
            <SortableFolderIcon
              key={item.id}
              item={item as FolderItem}
              onContextMenu={onItemContextMenu}
            />
          ) : null,
        )}
      </div>
    </SortableContext>
  )
}
