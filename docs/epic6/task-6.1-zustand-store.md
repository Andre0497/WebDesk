# Task 6.1 – Zustand-Store aufbauen

> **Epic:** EPIC 6 – State-Management & Persistenz  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Einen zentralen State-Store mit `zustand` aufbauen, der alle Desktop-Items und UI-Zustände verwaltet. Der Store bildet die Grundlage für alle weiteren EPIC-6-Tasks und löst ggf. vorhandene lokale `useState`-Zustände in Komponenten ab.

---

## 📋 Aufgaben

### 1. Paket installieren

```bash
npm install zustand
```

### 2. `desktopStore.ts` anlegen

```typescript
// src/store/desktopStore.ts
import { create } from 'zustand';
import { DesktopItem, LinkItem, FolderItem } from '../types/desktop';
import { defaultItems, defaultSettings } from '../utils/defaultData';

interface Settings {
  wallpaper: string;
  theme: 'dark' | 'light';
  gridSize: number;
  showLabels: boolean;
}

interface DesktopState {
  items: DesktopItem[];
  settings: Settings;

  // Item-Actions
  addLink: (link: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addFolder: (folder: Omit<FolderItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<DesktopItem>) => void;
  deleteItem: (id: string) => void;
  moveItem: (id: string, newPosition: { col: number; row: number }, newParentId: string | null) => void;

  // Ordner-Actions
  openFolder: (id: string) => void;
  closeFolder: (id: string) => void;

  // Daten-Actions
  exportData: () => string;
  importData: (json: string) => void;
  resetToDefaults: () => void;
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
  items: defaultItems,
  settings: defaultSettings,

  addLink: (link) => {
    const newItem: LinkItem = {
      ...link,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({ items: [...state.items, newItem] }));
  },

  addFolder: (folder) => {
    const newItem: FolderItem = {
      ...folder,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({ items: [...state.items, newItem] }));
  },

  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: Date.now() } as DesktopItem : item
      ),
    }));
  },

  deleteItem: (id) => {
    set((state) => ({
      // Löscht das Item und alle Children (bei Ordnern)
      items: state.items.filter((item) => item.id !== id && item.parentId !== id),
    }));
  },

  moveItem: (id, newPosition, newParentId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? { ...item, position: newPosition, parentId: newParentId, updatedAt: Date.now() }
          : item
      ),
    }));
  },

  openFolder: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id && item.type === 'folder'
          ? { ...item, isOpen: true }
          : item
      ),
    }));
  },

  closeFolder: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id && item.type === 'folder'
          ? { ...item, isOpen: false }
          : item
      ),
    }));
  },

  exportData: () => {
    const { items, settings } = get();
    return JSON.stringify({ version: 1, items, settings }, null, 2);
  },

  importData: (json) => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.items && parsed.settings) {
        set({ items: parsed.items, settings: parsed.settings });
      }
    } catch (e) {
      console.error('Import fehlgeschlagen:', e);
    }
  },

  resetToDefaults: () => {
    set({ items: defaultItems, settings: defaultSettings });
  },
}));
```

### 3. `uiStore.ts` anlegen

```typescript
// src/store/uiStore.ts
import { create } from 'zustand';

type ModalType = 'addLink' | 'addFolder' | 'edit' | 'confirm' | 'settings' | null;

interface UIState {
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    targetId: string | null;
  };
  activeModal: ModalType;
  editingItemId: string | null;
  searchQuery: string;
  isSearchOpen: boolean;

  // Actions
  openContextMenu: (x: number, y: number, targetId?: string | null) => void;
  closeContextMenu: () => void;
  openModal: (modal: ModalType, editingItemId?: string | null) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  contextMenu: { isOpen: false, x: 0, y: 0, targetId: null },
  activeModal: null,
  editingItemId: null,
  searchQuery: '',
  isSearchOpen: false,

  openContextMenu: (x, y, targetId = null) =>
    set({ contextMenu: { isOpen: true, x, y, targetId } }),

  closeContextMenu: () =>
    set({ contextMenu: { isOpen: false, x: 0, y: 0, targetId: null } }),

  openModal: (modal, editingItemId = null) =>
    set({ activeModal: modal, editingItemId }),

  closeModal: () =>
    set({ activeModal: null, editingItemId: null }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));
```

### 4. `src/store/index.ts` – Re-Export anlegen

```typescript
// src/store/index.ts
export { useDesktopStore } from './desktopStore';
export { useUIStore } from './uiStore';
```

### 5. Bestehende `useState`-Zustände in Komponenten migrieren

Alle Komponenten, die bisher lokalen State für Desktop-Items, Modals oder Context-Menüs verwenden, auf die entsprechenden Store-Hooks umstellen:

```typescript
// Vorher (lokal)
const [items, setItems] = useState<DesktopItem[]>([]);

// Nachher (Store)
const { items, addLink, deleteItem } = useDesktopStore();
```

---

## ✅ Akzeptanzkriterien

- [ ] `zustand` ist installiert und in `package.json` eingetragen
- [ ] `useDesktopStore` stellt alle Item-Actions korrekt bereit
- [ ] `useUIStore` stellt alle UI-Zustände (Modal, ContextMenu, Suche) bereit
- [ ] Alle Actions funktionieren und aktualisieren den Store reaktiv
- [ ] TypeScript zeigt keine Fehler (`npm run build` fehlerfrei)
- [ ] `src/store/index.ts` exportiert beide Stores

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Version | Typ |
|---|---|---|
| `zustand` | ^5.x | dependency |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 3.1 (Datenmodell), Task 1.7 (Ordnerstruktur)
- **Voraussetzung für:** Task 6.2 (localStorage), Task 6.3 (Demo-Daten), alle Komponenten in EPIC 2–5

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(store): Task 6.1 - Zustand-Store fuer Desktop- und UI-State aufbauen"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 6.1 auf `✅ Erledigt` setzen.

