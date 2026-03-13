import type { DesktopItem, LinkItem, FolderItem, Position } from './desktop'

/** App-weite Einstellungen */
export interface Settings {
  wallpaper: string // 'none' | 'dark-space' | 'aurora' | 'abstract'
  theme: 'dark' | 'light'
  gridSize: number // Breite einer Grid-Zelle in px, Standard: 100
  showLabels: boolean // Icon-Label anzeigen?
}

/** Zustand des Haupt-Stores */
export interface DesktopState {
  items: DesktopItem[]
  settings: Settings

  // Item-Actions
  addLink: (link: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  addFolder: (folder: Omit<FolderItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateItem: (id: string, updates: Partial<DesktopItem>) => void
  deleteItem: (id: string) => void
  moveItem: (id: string, newPosition: Position, newParentId: string | null) => void

  // Ordner-Actions
  openFolder: (id: string) => void
  closeFolder: (id: string) => void
  setFolderWindowPosition: (id: string, x: number, y: number) => void

  // Settings-Actions
  updateSettings: (updates: Partial<Settings>) => void

  // Daten-Actions
  exportData: () => string
  importData: (json: string) => void
  resetToDefaults: () => void
}

/** Modaltypes für den UI-Store */
export type ModalType = 'addLink' | 'addFolder' | 'edit' | 'confirm' | 'settings' | null

/** Zustand des UI-Stores */
export interface UIState {
  contextMenu: {
    isOpen: boolean
    x: number
    y: number
    targetId: string | null // null = Desktop-Kontext, sonst Item-ID
  }
  activeModal: ModalType
  editingItemId: string | null
  confirmAction: (() => void) | null // Callback für ConfirmModal
  searchQuery: string
  isSearchOpen: boolean
  draggingItemId: string | null
}
