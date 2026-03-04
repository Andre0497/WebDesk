# Task 4.5 – Drag-Overlay / Ghost-Preview

> **Epic:** EPIC 4 – Drag & Drop  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Während des Ziehens soll eine semi-transparente Vorschau des gezogenen Icons am Mauszeiger erscheinen (Ghost-Preview). Das Original-Icon an seiner Ausgangsposition wird ausgeblendet (Platzhalter). Umgesetzt wird dies mit der `DragOverlay`-Komponente von `@dnd-kit/core` in Kombination mit Framer Motion.

---

## 📋 Aufgaben

### 1. `DragOverlay` in `DesktopCanvas.tsx` einbinden

`DragOverlay` muss innerhalb des `DndContext` platziert werden, aber außerhalb von Grid und FolderWindows, damit es immer über allem liegt:

```tsx
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { useState } from 'react'

export default function DesktopCanvas() {
  const [activeItem, setActiveItem] = useState<DesktopItem | null>(null)

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as DraggableData
    setActiveItem(data.item)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null)
    // ... bestehende Drop-Logik aus Task 4.3 & 4.4
  }

  function handleDragCancel() {
    setActiveItem(null)
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      ...
    >
      <DesktopGrid />
      {/* FolderWindows */}

      <DragOverlay dropAnimation={null}>
        {activeItem ? <DragPreview item={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
```

### 2. `DragPreview`-Komponente anlegen

Eine neue Komponente `src/components/desktop/DragPreview.tsx` erstellen, die das Icon in einer stilisierten Ghost-Variante darstellt:

```tsx
import { motion } from 'framer-motion'
import type { DesktopItem } from '../../types'

interface DragPreviewProps {
  item: DesktopItem
}

export default function DragPreview({ item }: DragPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.85, scale: 1.05 }}
      className="flex flex-col items-center gap-1 pointer-events-none select-none"
    >
      {item.type === 'link' ? (
        <img
          src={(item as LinkItem).faviconUrl}
          alt={item.name}
          className="w-12 h-12 rounded-lg shadow-2xl ring-2 ring-white/40"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-blue-400/80 shadow-2xl ring-2 ring-white/40 flex items-center justify-center text-2xl">
          {(item as FolderItem).emoji ?? '📁'}
        </div>
      )}
      <span className="text-white text-xs bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
        {item.name}
      </span>
    </motion.div>
  )
}
```

### 3. Original-Icon beim Drag ausblenden

Da `useDraggable` das Original-Icon bereits über `transform` verschiebt, muss beim Drag-Start das Original ausgeblendet werden, damit nur die `DragOverlay`-Preview sichtbar ist:

```tsx
// In LinkIcon.tsx / FolderIcon.tsx:
<motion.div
  animate={{ opacity: isDragging ? 0 : 1 }}  // komplett ausblenden (statt 0.4)
  ...
>
```

> Durch `DragOverlay` übernimmt das Preview die visuelle Darstellung – das Original soll daher unsichtbar sein.

### 4. Drop-Animation deaktivieren

`dropAnimation={null}` auf `DragOverlay` verhindert eine ruckartige Rückspring-Animation nach einem fehlgeschlagenen Drop. Alternativ kann eine sanfte Fade-out-Animation konfiguriert werden:

```tsx
const dropAnimation = {
  duration: 200,
  easing: 'ease-out',
}

<DragOverlay dropAnimation={dropAnimation}>
```

### 5. Cursor-Styling global anpassen

Während des Drags soll der Cursor global auf `grabbing` gesetzt werden (verhindert Flackern beim schnellen Bewegen):

```css
/* in index.css */
body.is-dragging * {
  cursor: grabbing !important;
}
```

```tsx
// handleDragStart:
document.body.classList.add('is-dragging')
// handleDragEnd / handleDragCancel:
document.body.classList.remove('is-dragging')
```

---

## ✅ Akzeptanzkriterien

- [ ] Während des Drags erscheint eine Ghost-Preview am Mauszeiger
- [ ] Das Original-Icon an seiner Ausgangsposition ist während des Drags unsichtbar
- [ ] Die Preview zeigt das richtige Icon (Favicon / Ordner-Emoji) und den Namen
- [ ] Nach dem Drop (oder Abbruch) verschwindet die Preview
- [ ] Kein Ruckeln oder Doppel-Darstellung des Icons
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 📦 Vorausgesetzte Abhängigkeiten

| Paket | Version | Installiert in |
|---|---|---|
| `@dnd-kit/core` | ^6.x | Task 1.5 |
| `framer-motion` | ^12.x | Task 1.4 |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 4.1 (`DndContext`), Task 4.2 (Draggable Icons mit `isDragging`-State)
- **Voraussetzung für:** Task 5.1 (Einblend-Animationen), Task 5.3 (Icon Hover & Click Animationen)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(dnd): Task 4.5 - Drag-Overlay und Ghost-Preview implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 4.5 auf `✅ Erledigt` setzen.

