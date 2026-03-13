// Vorläufiges Gerüst – vollständige Implementierung in Task 3.1

export interface BaseItem {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  position: { col: number; row: number }
  parentId: string | null
}

export interface LinkItem extends BaseItem {
  type: 'link'
  url: string
  faviconUrl?: string
  description?: string
}

export interface FolderItem extends BaseItem {
  type: 'folder'
  color: string
  emoji?: string
  isOpen: boolean
  windowPosition?: { x: number; y: number }
}

export type DesktopItem = LinkItem | FolderItem
