/** Gemeinsame Basis für alle Desktop-Elemente */
export interface BaseItem {
  id: string // UUID (via crypto.randomUUID())
  name: string
  createdAt: number // Unix-Timestamp (Date.now())
  updatedAt: number
  position: {
    col: number // Grid-Spalte, 0-basiert
    row: number // Grid-Zeile, 0-basiert
  }
  parentId: string | null // null = Desktop-Root, sonst FolderId
}

/** Ein Web-Link auf dem Desktop oder in einem Ordner */
export interface LinkItem extends BaseItem {
  type: 'link'
  url: string
  faviconUrl?: string // Wird via Favicon-Service geladen (Task 3.5)
  description?: string
}

/** Ein Ordner auf dem Desktop */
export interface FolderItem extends BaseItem {
  type: 'folder'
  color: string // Hex-Farbe, z. B. '#6366f1'
  emoji?: string // Optionales Emoji als Icon, z. B. '🚀'
  isOpen: boolean // Ist das FolderWindow gerade geöffnet?
  windowPosition?: {
    // Position des geöffneten Fensters
    x: number
    y: number
  }
}

/** Union-Type für alle Desktop-Elemente */
export type DesktopItem = LinkItem | FolderItem

/** Position im Grid */
export type Position = { col: number; row: number }

/** Type-Guards */
export function isLinkItem(item: DesktopItem): item is LinkItem {
  return item.type === 'link'
}

export function isFolderItem(item: DesktopItem): item is FolderItem {
  return item.type === 'folder'
}
