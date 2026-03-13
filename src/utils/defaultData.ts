import type { DesktopItem } from '../types'

export const defaultItems: DesktopItem[] = [
  {
    id: 'folder-1',
    type: 'folder',
    name: 'Entwicklung',
    color: '#6366f1',
    emoji: '💻',
    isOpen: false,
    position: { col: 0, row: 0 },
    parentId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'link-1',
    type: 'link',
    name: 'GitHub',
    url: 'https://github.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
    position: { col: 0, row: 0 },
    parentId: 'folder-1',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'link-2',
    type: 'link',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=developer.mozilla.org',
    position: { col: 1, row: 0 },
    parentId: 'folder-1',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'link-3',
    type: 'link',
    name: 'YouTube',
    url: 'https://youtube.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=youtube.com',
    position: { col: 1, row: 0 },
    parentId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

export const defaultSettings = {
  wallpaper: 'none',
  theme: 'dark' as const,
  gridSize: 100,
  showLabels: true,
}
