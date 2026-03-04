# Task 4.4 – Drop in Ordner

> **Epic:** EPIC 4 – Drag & Drop  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Ein `FolderIcon` auf dem Desktop soll als Drop-Target fungieren. Wird ein anderes Icon (Link oder Ordner) auf ein Ordner-Icon gezogen und losgelassen, wird das gezogene Item in den Ordner verschoben (`parentId` wird auf die Ordner-ID gesetzt). Der Ordner soll beim Draggen darüber optisch hervorgehoben werden und sich nach dem Drop kurz öffnen, um den Nutzer zu bestätigen.

---

## 📋 Aufgaben

### 1. `FolderIcon` als Drop-Target einrichten

`FolderIcon.tsx` erhält zusätzlich zu `useDraggable` (aus Task 4.2) auch `useDroppable`. Da dasselbe DOM-Element sowohl Drag-Quelle als auch Drop-Ziel ist, werden beide Refs zusammengeführt:

```tsx
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'

export default function FolderIcon({ item }: FolderIconProps) {
  // Draggable (aus Task 4.2)
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
    data: { type: 'folder', item },
  })

  // Droppable (neu)
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `folder-drop-${item.id}`,
    data: {
      type: 'folder',
      folderId: item.id,
    },
  })

  // Beide Refs auf dasselbe Element setzen
  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node)
    setDropRef(node)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      animate={{
        opacity: isDragging ? 0 : 1,
        scale: isOver ? 1.15 : isDragging ? 0.95 : 1,
      }}
      transition={{ duration: 0.15 }}
      {...listeners}
      {...attributes}
      className={`
        flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none
        ${isOver ? 'drop-shadow-[0_0_14px_rgba(255,255,255,0.7)]' : ''}
      `}
    >
      {/* Ordner-Emoji oder Standard-Icon */}
      <div
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl
          transition-colors duration-150
          ${isOver ? 'ring-2 ring-white/60' : ''}
        `}
        style={{ backgroundColor: item.color }}
      >
        {item.emoji ?? '📁'}
      </div>
      <span className="text-white text-xs text-center max-w-[80px] truncate">
        {item.name}
      </span>
    </motion.div>
  )
}
```

### 2. `onDragEnd` in `DesktopCanvas.tsx` erweitern

Den Drop-in-Ordner-Fall im bestehenden `handleDragEnd`-Handler (aus Task 4.1 / 4.3) ergänzen. Die Priorität ist: **Ordner-Drop vor Grid-Zellen-Drop** (wird in Task 4.7 über den Kollisions-Algorithmus gesteuert).

```tsx
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event
  setActiveItem(null) // DragOverlay zurücksetzen (Task 4.5)

  if (!over) return

  const overData = over.data.current
  const activeId = String(active.id)

  // Kein Drop auf sich selbst (Ordner darf nicht in sich selbst fallen)
  if (activeId === overData?.folderId) return

  if (overData?.type === 'folder') {
    // Nächste freie Position im Zielordner ermitteln
    const itemsInFolder = items.filter(i => i.parentId === overData.folderId)
    const newPos = {
      col: itemsInFolder.length % 4,
      row: Math.floor(itemsInFolder.length / 4),
    }
    moveItem(activeId, newPos, overData.folderId)
    openFolder(overData.folderId) // Ordner kurz aufspringen lassen
    return
  }

  if (overData?.type === 'cell') {
    // Desktop-Grid-Drop (aus Task 4.3)
    moveItem(activeId, { col: overData.col, row: overData.row }, null)
  }
}
```

### 3. Verhindern: Ordner in sich selbst droppen

Doppelte Sicherheitsprüfung – einmal anhand der ID, einmal anhand des Typs:

```tsx
// Früh im handleDragEnd:
const activeItem = items.find(i => i.id === activeId)

// Verhindert sowohl direktes Self-Drop als auch zirkuläre Verschachtelung
if (activeItem?.type === 'folder' && overData?.folderId === activeId) return
```

### 4. `openFolder` im Store verknüpfen

`openFolder` aus dem `desktopStore` wird aufgerufen, um den Ordner nach dem Drop kurz zu öffnen. Falls der Ordner bereits offen ist, hat der Aufruf keinen sichtbaren Effekt:

```typescript
// src/store/desktopStore.ts
openFolder: (id) =>
  set(state => ({
    items: state.items.map(item =>
      item.id === id && item.type === 'folder'
        ? { ...item, isOpen: true }
        : item
    ),
  })),
```

### 5. Visuelles Feedback im Browser testen

Folgende Szenarien manuell prüfen:

| Szenario | Erwartetes Verhalten |
|---|---|
| Link-Icon auf Ordner ziehen | Icon landet im Ordner, Ordner öffnet sich |
| Ordner-Icon auf anderen Ordner ziehen | Ordner wird verschoben, Zielordner öffnet sich |
| Icon auf eigenen Ordner ziehen | Kein Effekt |
| Hover über Ordner während Drag | Ordner leuchtet auf (`isOver`-Zustand) |
| Abbruch des Drags (Escape) | Kein Zustandswechsel im Store |

---

## ✅ Akzeptanzkriterien

- [ ] `FolderIcon` ist gleichzeitig Draggable und Droppable (beide Refs auf dasselbe Element)
- [ ] Beim Draggen über ein `FolderIcon` wird es visuell hervorgehoben (`isOver`)
- [ ] Nach dem Drop wird `moveItem(id, pos, folderId)` mit korrekter `parentId` aufgerufen
- [ ] Das Item erscheint danach im `FolderWindow` des Zielordners
- [ ] Der Zielordner öffnet sich automatisch nach dem Drop
- [ ] Ein Ordner kann nicht in sich selbst gedroppt werden
- [ ] Kein TypeScript-Fehler
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 📦 Vorausgesetzte Abhängigkeiten

| Paket | Version | Installiert in |
|---|---|---|
| `@dnd-kit/core` | ^6.x | Task 1.5 |
| `@dnd-kit/utilities` | ^3.x | Task 1.5 |
| `framer-motion` | ^12.x | Task 1.4 |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 4.1 (`DndContext` + Event-Handler), Task 4.2 (Draggable Icons), Task 4.3 (Droppable Grid), Task 3.3 (`FolderIcon`), Task 3.4 (`FolderWindow`), Task 6.1 (Store mit `moveItem` + `openFolder`)
- **Voraussetzung für:** Task 4.5 (Ghost-Preview), Task 4.6 (Sortierung innerhalb Ordner), Task 4.7 (Kollisionsverhalten)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(dnd): Task 4.4 - Drop in Ordner implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 4.4 auf `✅ Erledigt` setzen.

