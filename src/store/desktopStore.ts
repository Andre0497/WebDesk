import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DesktopState, Settings } from '../types/store'
import type { LinkItem, FolderItem } from '../types/desktop'
import { defaultItems, defaultSettings } from '../utils/defaultData'

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set, get) => ({
      items: defaultItems,
      settings: defaultSettings,

      addLink: (link: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newItem: LinkItem = {
          ...link,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set(state => ({ items: [...state.items, newItem] }))
      },

      addFolder: (folder: Omit<FolderItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newItem: FolderItem = {
          ...folder,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set(state => ({ items: [...state.items, newItem] }))
      },

      updateItem: (id, updates) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? ({ ...item, ...updates, updatedAt: Date.now() } as typeof item) : item,
          ),
        }))
      },

      deleteItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id && item.parentId !== id),
        }))
      },

      moveItem: (id, newPosition, newParentId) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, position: newPosition, parentId: newParentId, updatedAt: Date.now() }
              : item,
          ),
        }))
      },

      openFolder: (id) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id && item.type === 'folder' ? { ...item, isOpen: true } : item,
          ),
        }))
      },

      closeFolder: (id) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id && item.type === 'folder' ? { ...item, isOpen: false } : item,
          ),
        }))
      },

      setFolderWindowPosition: (id, x, y) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id && item.type === 'folder'
              ? { ...item, windowPosition: { x, y } }
              : item,
          ),
        }))
      },

      updateSettings: (updates: Partial<Settings>) => {
        set(state => ({ settings: { ...state.settings, ...updates } }))
      },

      exportData: () => {
        const { items, settings } = get()
        return JSON.stringify({ version: 1, items, settings }, null, 2)
      },

      importData: (json) => {
        try {
          const parsed = JSON.parse(json)
          if (parsed.items && parsed.settings) {
            set({ items: parsed.items, settings: parsed.settings })
          }
        } catch (e) {
          console.error('Import fehlgeschlagen:', e)
        }
      },

      resetToDefaults: () => {
        set({ items: defaultItems, settings: defaultSettings })
      },
    }),
    {
      name: 'webdesk-data',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          const state = persistedState as DesktopState
          return {
            ...state,
            settings: {
              ...state.settings,
              showLabels: true,
            },
          }
        }
        return persistedState as DesktopState
      },
    },
  ),
)

