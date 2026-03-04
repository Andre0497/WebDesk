# Task 1.7 – Ordnerstruktur anlegen

> **Epic:** EPIC 1 – Projekt-Setup & Infrastruktur  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Die vollständige Ordner- und Dateistruktur gemäß `architecture.md` anlegen. Alle Verzeichnisse sollen mit leeren Index- bzw. Platzhalter-Dateien versehen werden, damit sie ins Git-Repository aufgenommen werden können und die Struktur für alle Entwickler klar sichtbar ist.

---

## 📋 Aufgaben

### 1. Vollständige Verzeichnisstruktur anlegen

```
src/
├── types/
│   ├── index.ts          ← Re-export aller Types
│   ├── desktop.ts        ← DesktopItem, LinkItem, FolderItem
│   └── store.ts          ← Store-State-Types
│
├── store/
│   ├── desktopStore.ts   ← Hauptstore (Platzhalter)
│   └── uiStore.ts        ← UI-Store (Platzhalter)
│
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useContextMenu.ts
│   ├── useFavicon.ts
│   └── useDesktopGrid.ts
│
├── utils/
│   ├── favicon.ts
│   ├── dataTransfer.ts
│   ├── urlParser.ts
│   └── defaultData.ts
│
├── components/
│   ├── desktop/
│   │   ├── DesktopCanvas.tsx
│   │   ├── DesktopGrid.tsx
│   │   └── AnimatedBackground.tsx
│   │
│   ├── icons/
│   │   ├── LinkIcon.tsx
│   │   ├── FolderIcon.tsx
│   │   └── IconLabel.tsx
│   │
│   ├── windows/
│   │   ├── FolderWindow.tsx
│   │   ├── WindowTitleBar.tsx
│   │   └── WindowGrid.tsx
│   │
│   ├── modals/
│   │   ├── AddLinkModal.tsx
│   │   ├── AddFolderModal.tsx
│   │   ├── EditItemModal.tsx
│   │   ├── ConfirmModal.tsx
│   │   └── SettingsModal.tsx
│   │
│   ├── ui/
│   │   ├── Modal.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── ContextMenu.tsx
│   │   ├── ColorPicker.tsx
│   │   └── Tooltip.tsx
│   │
│   └── taskbar/
│       ├── Taskbar.tsx
│       ├── Clock.tsx
│       └── SearchBar.tsx
│
└── assets/               ← Leer, .gitkeep anlegen

public/
└── wallpapers/           ← Leer, .gitkeep anlegen
```

### 2. Platzhalter-Inhalte für alle Dateien

Jede `.ts`/`.tsx`-Datei erhält einen minimalen Platzhalter-Kommentar, damit sie gültig ist:

**Für TypeScript-Dateien (`*.ts`):**
```typescript
// TODO: Implementierung in Task X.X
export {}
```

**Für React-Komponenten (`*.tsx`):**
```tsx
// TODO: Implementierung in Task X.X
export default function ComponentName() {
  return null
}
```

### 3. `src/types/desktop.ts` – Datenmodell vorbefüllen

Das Datenmodell aus `architecture.md` bereits jetzt als Interface-Gerüst anlegen (wird in Task 3.1 vollständig implementiert):

```typescript
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
```

### 4. `.gitkeep` für leere Verzeichnisse

Leere Verzeichnisse (z. B. `src/assets/`, `public/wallpapers/`) erhalten eine `.gitkeep`-Datei, damit Git sie tracked.

---

## ✅ Akzeptanzkriterien

- [ ] Alle Verzeichnisse aus `architecture.md` sind vorhanden
- [ ] Alle `.tsx`/`.ts`-Platzhalter-Dateien sind angelegt
- [ ] `src/types/desktop.ts` enthält das Interface-Gerüst
- [ ] `src/types/index.ts` re-exportiert alle Types aus `desktop.ts` und `store.ts`
- [ ] `src/assets/` und `public/wallpapers/` enthalten `.gitkeep`
- [ ] `npm run dev` und `npm run build` laufen weiterhin ohne Fehler
- [ ] `npm run lint` meldet keine neuen Fehler durch die Platzhalter-Dateien

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.1 muss abgeschlossen sein  
  *(Task 1.1 hat bereits die Grundstruktur angelegt – dieser Task vervollständigt sie)*
- **Voraussetzung für:** Alle Tasks in EPIC 2–6 (Komponenten, Store, Hooks, Utils)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(setup): Task 1.7 - Vollstaendige Ordnerstruktur und Platzhalter-Dateien anlegen"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 1.7 auf `✅ Erledigt` setzen.

