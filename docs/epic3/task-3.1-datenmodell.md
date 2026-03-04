# Task 3.1 – Datenmodell definieren

> **Epic:** EPIC 3 – Icon & Ordner-System  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Die vollständigen TypeScript-Interfaces für das gesamte Datenmodell von WebDesk definieren. Das Modell beschreibt `LinkItem`, `FolderItem` und `DesktopItem` sowie alle Store- und Settings-Typen. Es bildet die Grundlage für alle weiteren EPIC-3-Tasks und den Store in EPIC 6.

---

## 📋 Aufgaben

### 1. `src/types/desktop.ts` vollständig implementieren

```typescript
// src/types/desktop.ts

/** Gemeinsame Basis für alle Desktop-Elemente */
export interface BaseItem {
  id: string              // UUID (via crypto.randomUUID())
  name: string
  createdAt: number       // Unix-Timestamp (Date.now())
  updatedAt: number
  position: {
    col: number           // Grid-Spalte, 0-basiert
    row: number           // Grid-Zeile, 0-basiert
  }
  parentId: string | null // null = Desktop-Root, sonst FolderId
}

/** Ein Web-Link auf dem Desktop oder in einem Ordner */
export interface LinkItem extends BaseItem {
  type: 'link'
  url: string
  faviconUrl?: string     // Wird via Favicon-Service geladen (Task 3.5)
  description?: string
}

/** Ein Ordner auf dem Desktop */
export interface FolderItem extends BaseItem {
  type: 'folder'
  color: string           // Hex-Farbe, z. B. '#6366f1'
  emoji?: string          // Optionales Emoji als Icon, z. B. '🚀'
  isOpen: boolean         // Ist das FolderWindow gerade geöffnet?
  windowPosition?: {      // Position des geöffneten Fensters
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
```

### 2. `src/types/store.ts` vollständig implementieren

```typescript
// src/types/store.ts

import type { DesktopItem, LinkItem, FolderItem, Position } from './desktop'

/** App-weite Einstellungen */
export interface Settings {
  wallpaper: string       // 'none' | 'dark-space' | 'aurora' | 'abstract'
  theme: 'dark' | 'light'
  gridSize: number        // Breite einer Grid-Zelle in px, Standard: 100
  showLabels: boolean     // Icon-Label anzeigen?
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
    targetId: string | null  // null = Desktop-Kontext, sonst Item-ID
  }
  activeModal: ModalType
  editingItemId: string | null
  confirmAction: (() => void) | null  // Callback für ConfirmModal
  searchQuery: string
  isSearchOpen: boolean
  draggingItemId: string | null
}
```

### 3. `src/types/index.ts` – Re-Exports anlegen

```typescript
// src/types/index.ts
export * from './desktop'
export * from './store'
```

### 4. `src/utils/urlParser.ts` implementieren

URL-Hilfsfunktionen, die in `AddLinkModal` und `LinkIcon` benötigt werden:

```typescript
// src/utils/urlParser.ts

/** Normalisiert eine URL – fügt https:// hinzu falls kein Protokoll vorhanden */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return `https://${trimmed}`
}

/** Extrahiert den Hostnamen aus einer URL für die Favicon-Abfrage */
export function extractHostname(url: string): string {
  try {
    return new URL(normalizeUrl(url)).hostname
  } catch {
    return ''
  }
}

/** Prüft ob ein String eine gültige URL ist */
export function isValidUrl(input: string): boolean {
  try {
    new URL(normalizeUrl(input))
    return true
  } catch {
    return false
  }
}
```

### 5. `src/utils/defaultData.ts` – Demo-Daten anlegen

```typescript
// src/utils/defaultData.ts
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
```

---

## ✅ Akzeptanzkriterien

- [ ] `src/types/desktop.ts` enthält `BaseItem`, `LinkItem`, `FolderItem`, `DesktopItem`, `Position`
- [ ] Type-Guards `isLinkItem` und `isFolderItem` sind implementiert und typsicher
- [ ] `src/types/store.ts` enthält `Settings`, `DesktopState`, `UIState`, `ModalType`
- [ ] `src/types/index.ts` re-exportiert alle Types korrekt
- [ ] `src/utils/urlParser.ts` ist implementiert und Unit-Test-bereit
- [ ] `src/utils/defaultData.ts` enthält sinnvolle Demo-Daten
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build
- [ ] `npm run lint` meldet keine Fehler

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.1 (TypeScript-Setup)
- **Voraussetzung für:** Alle weiteren Tasks in EPIC 3, 4, 6

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(types): Task 3.1 - Datenmodell, Types und Utility-Funktionen definieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 3.1 auf `✅ Erledigt` setzen.

