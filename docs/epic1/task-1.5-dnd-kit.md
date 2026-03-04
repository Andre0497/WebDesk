# Task 1.5 – dnd-kit installieren

> **Epic:** EPIC 1 – Projekt-Setup & Infrastruktur  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Die dnd-kit-Bibliothek installieren, die das komplette Drag-&-Drop-System von WebDesk antreibt. Dazu gehören das Verschieben von Icons auf dem Desktop, das Ablegen in Ordner und das Sortieren innerhalb eines Ordnerfensters. Nach diesem Task sollen alle drei dnd-kit-Pakete verfügbar sein und ein einfacher Funktionstest bestätigen, dass der `DndContext` korrekt eingebunden werden kann.

---

## 📋 Aufgaben

### 1. Pakete installieren

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

| Paket | Zweck |
|---|---|
| `@dnd-kit/core` | Basis-DnD: `DndContext`, `useDraggable`, `useDroppable`, Events |
| `@dnd-kit/sortable` | Sortierbare Listen in `FolderWindow` (`SortableContext`, `useSortable`) |
| `@dnd-kit/utilities` | CSS-Transform-Hilfsfunktionen (`CSS.Transform.toString()`) |

### 2. Smoke Test in `App.tsx`

Prüfen, ob der `DndContext` ohne Fehler eingebunden werden kann:

```tsx
import { DndContext } from '@dnd-kit/core'

function App() {
  return (
    <DndContext>
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">WebDesk</h1>
      </div>
    </DndContext>
  )
}

export default App
```

### 3. TypeScript-Typen verifizieren

Wichtige Typen aus `@dnd-kit/core` die später verwendet werden:

```typescript
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core'
```

> dnd-kit liefert alle Typen integriert mit – kein separates `@types/`-Paket nötig.

---

## 🧩 Verwendung in WebDesk (Vorschau)

Die Pakete werden laut `architecture.md` und `project-plan.md` wie folgt eingesetzt:

| Task | Paket | Verwendung |
|---|---|---|
| 4.1 | `@dnd-kit/core` | `DndContext` auf `DesktopCanvas` |
| 4.2 | `@dnd-kit/core` | `useDraggable` auf `LinkIcon` & `FolderIcon` |
| 4.3 | `@dnd-kit/core` | `useDroppable` für Desktop-Grid-Zellen |
| 4.4 | `@dnd-kit/core` | Ordner als Drop-Target |
| 4.5 | `@dnd-kit/core` | `DragOverlay` für Ghost-Preview |
| 4.6 | `@dnd-kit/sortable` | `SortableContext` innerhalb `FolderWindow` |
| 4.6 | `@dnd-kit/utilities` | `CSS.Transform.toString()` für Drag-Transforms |

---

## ✅ Akzeptanzkriterien

- [ ] `npm install` läuft ohne Fehler durch
- [ ] Alle drei Pakete erscheinen in `package.json` unter `dependencies`
- [ ] Import von `DndContext` aus `@dnd-kit/core` erzeugt keinen TypeScript-Fehler
- [ ] `DndContext` in `App.tsx` eingebunden – kein Konsolenfehler im Browser
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Version | Typ |
|---|---|---|
| `@dnd-kit/core` | ^6.x | dependency |
| `@dnd-kit/sortable` | ^8.x | dependency |
| `@dnd-kit/utilities` | ^3.x | dependency |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.1 muss abgeschlossen sein
- **Voraussetzung für:** Task 4.1–4.7 (gesamtes EPIC 4 – Drag & Drop)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(setup): Task 1.5 - dnd-kit installieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 1.5 auf `✅ Erledigt` setzen.

