# Task 4.1 – `DndContext` auf Desktop einrichten

> **Epic:** EPIC 4 – Drag & Drop  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Den `DndContext`-Provider von `@dnd-kit/core` auf der `DesktopCanvas`-Komponente einrichten und alle zentralen Drag-&-Drop-Events (`onDragStart`, `onDragOver`, `onDragEnd`) verdrahten. Dieser Task bildet das Fundament für alle weiteren DnD-Tasks (4.2–4.7). Nach Abschluss soll der Kontext fehlerfrei im Browser laufen und die Event-Handler korrekt in der Konsole ausgeben.

---

## 📋 Aufgaben

### 1. `DndContext` in `DesktopCanvas.tsx` einbinden

Den Provider um alle Desktop-Inhalte wrappen:

```tsx
import {
  DndContext,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

export default function DesktopCanvas() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Mindest-Bewegung in px vor DnD-Start (verhindert Fehl-Clicks)
      },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    console.log('dragStart', event.active.id)
    // UIStore: setDraggingItem(event.active.id)
  }

  function handleDragOver(event: DragOverEvent) {
    console.log('dragOver', event.over?.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    console.log('dragEnd', event.active.id, '→', event.over?.id)
    // UIStore: setDraggingItem(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* DesktopGrid, FolderWindows, etc. */}
    </DndContext>
  )
}
```

### 2. `PointerSensor` konfigurieren

- `distance: 8` als Aktivierungsschwelle setzen – verhindert, dass normales Klicken als Drag interpretiert wird
- Für Touch-Unterstützung zusätzlich `TouchSensor` mit einem `delay` von `250ms` registrieren:

```tsx
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'

const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
)
```

### 3. Kollisions-Algorithmus festlegen

Standard-Kollision für den Desktop ist `rectIntersection` (ausreichend für Grid-Zellen):

```tsx
import { rectIntersection } from '@dnd-kit/core'

<DndContext collisionDetection={rectIntersection} ...>
```

> Für Task 4.4 (Drop in Ordner) wird ggf. auf `closestCenter` oder `pointerWithin` umgestellt.

### 4. UIStore vorbereiten

Im `uiStore.ts` den `draggingItemId`-State anlegen, der später von `handleDragStart` und `handleDragEnd` befüllt wird:

```typescript
// src/store/uiStore.ts (Erweiterung)
interface UIState {
  // ...bestehende Felder...
  draggingItemId: string | null
}
```

### 5. Smoke Test

Im Browser überprüfen:
- Kein Konsolenfehler beim Laden
- `console.log`-Ausgaben erscheinen beim Klicken/Ziehen auf Desktop-Elementen
- Kein visuelles Breaking des Layouts

---

## ✅ Akzeptanzkriterien

- [ ] `DndContext` wrапpt vollständig den gesamten Desktop-Bereich (Grid + FolderWindows)
- [ ] `PointerSensor` mit `distance: 8` ist aktiv
- [ ] `TouchSensor` mit `delay: 250` ist aktiv
- [ ] `onDragStart`, `onDragOver`, `onDragEnd` sind verdrahtet und loggen korrekt
- [ ] `draggingItemId` im UIStore ist angelegt
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 📦 Vorausgesetzte Abhängigkeiten

| Paket | Version | Installiert in |
|---|---|---|
| `@dnd-kit/core` | ^6.x | Task 1.5 |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.5 (dnd-kit installiert), Task 2.1 (`DesktopCanvas` existiert), Task 6.1 (UIStore)
- **Voraussetzung für:** Task 4.2–4.7 (alle weiteren DnD-Tasks)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(dnd): Task 4.1 - DndContext auf DesktopCanvas einrichten"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 4.1 auf `✅ Erledigt` setzen.

