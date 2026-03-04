# 🏗 Architektur – WebDesk

## 1. Ordnerstruktur

```
webdesk/
├── public/
│   ├── favicon.ico
│   └── wallpapers/          ← Statische Wallpaper-Bilder
│       ├── dark-space.jpg
│       ├── aurora.jpg
│       └── abstract.jpg
│
├── src/
│   ├── main.tsx             ← App-Einstiegspunkt
│   ├── App.tsx              ← Root-Komponente, Provider-Setup
│   ├── index.css            ← Tailwind directives + globale Styles
│   │
│   ├── types/               ← TypeScript-Interfaces & Types
│   │   ├── index.ts         ← Re-export aller Types
│   │   ├── desktop.ts       ← DesktopItem, LinkItem, FolderItem
│   │   └── store.ts         ← Store-State-Types
│   │
│   ├── store/               ← Zustand State Management
│   │   ├── desktopStore.ts  ← Hauptstore: Items, Layout, Settings
│   │   └── uiStore.ts       ← UI-State: offene Fenster, Modals, aktiver Kontext
│   │
│   ├── hooks/               ← Custom React Hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useContextMenu.ts
│   │   ├── useFavicon.ts
│   │   └── useDesktopGrid.ts
│   │
│   ├── utils/               ← Pure Hilfsfunktionen
│   │   ├── favicon.ts       ← Favicon-URL-Generierung
│   │   ├── dataTransfer.ts  ← JSON Export/Import
│   │   ├── urlParser.ts     ← URL-Normalisierung
│   │   └── defaultData.ts   ← Demo-Daten für ersten Start
│   │
│   ├── components/
│   │   ├── desktop/
│   │   │   ├── DesktopCanvas.tsx    ← Hauptcontainer + Grid
│   │   │   ├── DesktopGrid.tsx      ← Grid-Layout für Icons
│   │   │   └── AnimatedBackground.tsx
│   │   │
│   │   ├── icons/
│   │   │   ├── LinkIcon.tsx         ← Link-Icon mit Favicon
│   │   │   ├── FolderIcon.tsx       ← Ordner-Icon
│   │   │   └── IconLabel.tsx        ← Wiederverwendbares Label
│   │   │
│   │   ├── windows/
│   │   │   ├── FolderWindow.tsx     ← Ordner-Fenster (Glassmorphism)
│   │   │   ├── WindowTitleBar.tsx   ← Draggable Titelleiste
│   │   │   └── WindowGrid.tsx       ← Grid innerhalb Fenster
│   │   │
│   │   ├── modals/
│   │   │   ├── AddLinkModal.tsx
│   │   │   ├── AddFolderModal.tsx
│   │   │   ├── EditItemModal.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   └── SettingsModal.tsx
│   │   │
│   │   ├── ui/              ← Generische UI-Primitives
│   │   │   ├── Modal.tsx            ← Basis-Modal-Wrapper
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ContextMenu.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   └── Tooltip.tsx
│   │   │
│   │   └── taskbar/
│   │       ├── Taskbar.tsx
│   │       ├── Clock.tsx
│   │       └── SearchBar.tsx
│   │
│   └── assets/              ← Lokale Assets (falls nötig)
│
├── docs/                    ← Diese Dokumentation
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 2. Datenmodell

```typescript
// src/types/desktop.ts

/** Basis für alle Desktop-Items */
interface BaseItem {
  id: string;           // uuid
  name: string;
  createdAt: number;    // Unix timestamp
  updatedAt: number;
  position: {
    col: number;        // Grid-Spalte (0-basiert)
    row: number;        // Grid-Zeile (0-basiert)
  };
  parentId: string | null;  // null = Desktop-Root, sonst FolderId
}

/** Ein Web-Link */
export interface LinkItem extends BaseItem {
  type: 'link';
  url: string;
  faviconUrl?: string;
  description?: string;
}

/** Ein Ordner */
export interface FolderItem extends BaseItem {
  type: 'folder';
  color: string;        // Hex-Farbe für den Ordner
  emoji?: string;       // Optionales Emoji als Icon
  isOpen: boolean;      // Ist das Fenster gerade geöffnet?
  windowPosition?: {    // Position des geöffneten Fensters
    x: number;
    y: number;
  };
}

export type DesktopItem = LinkItem | FolderItem;
```

---

## 3. Store-Struktur (Zustand)

```typescript
// src/store/desktopStore.ts

interface DesktopState {
  // Daten
  items: DesktopItem[];
  settings: {
    wallpaper: string;
    theme: 'dark' | 'light';
    gridSize: number;       // Breite einer Grid-Zelle in px
    showLabels: boolean;
  };

  // Actions
  addLink: (link: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addFolder: (folder: Omit<FolderItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<DesktopItem>) => void;
  deleteItem: (id: string) => void;
  moveItem: (id: string, newPosition: Position, newParentId: string | null) => void;
  openFolder: (id: string) => void;
  closeFolder: (id: string) => void;
  exportData: () => string;          // JSON-String
  importData: (json: string) => void;
  resetToDefaults: () => void;
}

// src/store/uiStore.ts
interface UIState {
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    targetId: string | null;   // null = Desktop-Kontext
  };
  activeModal: 'addLink' | 'addFolder' | 'edit' | 'confirm' | 'settings' | null;
  editingItemId: string | null;
  searchQuery: string;
  isSearchOpen: boolean;
}
```

---

## 4. Komponentenhierarchie

```
App
├── DesktopCanvas            ← DndContext Provider hier
│   ├── AnimatedBackground
│   ├── DesktopGrid
│   │   ├── FolderIcon[]     ← Draggable
│   │   └── LinkIcon[]       ← Draggable
│   └── FolderWindow[]       ← Pro offenem Ordner eines
│       ├── WindowTitleBar   ← Draggable (Fenster verschieben)
│       └── WindowGrid
│           ├── FolderIcon[] ← Draggable (Sortable)
│           └── LinkIcon[]   ← Draggable (Sortable)
├── Taskbar
│   ├── Clock
│   └── SearchBar
├── ContextMenu              ← Portal, absolut positioniert
└── Modals                   ← Portal
    ├── AddLinkModal
    ├── AddFolderModal
    ├── EditItemModal
    ├── ConfirmModal
    └── SettingsModal
```

---

## 5. LocalStorage Schema

```typescript
// Schlüssel: 'webdesk-data'
interface StoredData {
  version: number;       // Schema-Version für Migrations
  items: DesktopItem[];
  settings: Settings;
}
```

Beim App-Start:
1. `localStorage.getItem('webdesk-data')` lesen
2. JSON parsen + Schema-Version prüfen
3. Falls leer → Default-Demo-Daten laden
4. Bei jedem State-Update → `localStorage.setItem(...)` (via Zustand middleware)

---

## 6. Drag & Drop Flow

```
User beginnt Drag auf Icon
  → dnd-kit: onDragStart
     → UIStore: setDraggingItem(id)
     → Icon zeigt Drag-State (framer-motion)
     → DragOverlay rendert Ghost-Preview

User bewegt über Desktop-Zelle
  → dnd-kit: onDragOver
     → Ziel-Zelle wird highlighted

User lässt über Desktop-Zelle los
  → dnd-kit: onDragEnd
     → desktopStore.moveItem(id, newPosition, null)
     → UIStore: setDraggingItem(null)
     → framer-motion layout-animation zur neuen Position

User lässt über Ordner los
  → dnd-kit: onDragEnd, over.id = folderId
     → desktopStore.moveItem(id, {col:0, row:next}, folderId)
     → Ordner öffnet sich kurz um Inhalt zu zeigen
```

