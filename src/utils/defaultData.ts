import type { DesktopItem, LinkItem, FolderItem } from '../types/desktop'
import type { Settings } from '../types/store'

export const defaultSettings: Settings = {
  wallpaper: 'dark-space',
  theme: 'dark',
  gridSize: 100,
  showLabels: true,
}

export const defaultItems: DesktopItem[] = [
  // --- Ordner ---
  {
    id: 'folder-dev',
    type: 'folder',
    name: 'Entwicklung',
    color: '#6366f1',
    emoji: '💻',
    isOpen: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 0, row: 0 },
    parentId: null,
  } satisfies FolderItem,

  {
    id: 'folder-design',
    type: 'folder',
    name: 'Design',
    color: '#ec4899',
    emoji: '🎨',
    isOpen: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 1, row: 0 },
    parentId: null,
  } satisfies FolderItem,

  // --- Links auf dem Desktop-Root ---
  {
    id: 'link-github',
    type: 'link',
    name: 'GitHub',
    url: 'https://github.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 0, row: 1 },
    parentId: null,
  } satisfies LinkItem,

  {
    id: 'link-mdn',
    type: 'link',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=developer.mozilla.org',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 1, row: 1 },
    parentId: null,
  } satisfies LinkItem,

  {
    id: 'link-vercel',
    type: 'link',
    name: 'Vercel',
    url: 'https://vercel.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=vercel.com',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 2, row: 1 },
    parentId: null,
  } satisfies LinkItem,

  // --- Links im Ordner "Entwicklung" ---
  {
    id: 'link-vite',
    type: 'link',
    name: 'Vite',
    url: 'https://vitejs.dev',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=vitejs.dev',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 0, row: 0 },
    parentId: 'folder-dev',
  } satisfies LinkItem,

  {
    id: 'link-react',
    type: 'link',
    name: 'React Docs',
    url: 'https://react.dev',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=react.dev',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 1, row: 0 },
    parentId: 'folder-dev',
  } satisfies LinkItem,

  {
    id: 'link-tailwind',
    type: 'link',
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=tailwindcss.com',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 2, row: 0 },
    parentId: 'folder-dev',
  } satisfies LinkItem,

  // --- Links im Ordner "Design" ---
  {
    id: 'link-figma',
    type: 'link',
    name: 'Figma',
    url: 'https://figma.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=figma.com',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 0, row: 0 },
    parentId: 'folder-design',
  } satisfies LinkItem,

  {
    id: 'link-coolors',
    type: 'link',
    name: 'Coolors',
    url: 'https://coolors.co',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=coolors.co',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 1, row: 0 },
    parentId: 'folder-design',
  } satisfies LinkItem,
]

export const folderColors = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#64748b', // Slate
]
