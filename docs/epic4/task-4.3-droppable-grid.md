# Task 4.3 – Droppable Desktop-Grid-Zellen

> **Epic:** EPIC 4 – Drag & Drop  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Jede freie Zelle im Desktop-Grid als Drop-Target einrichten, sodass gezogene Icons in eine neue Grid-Position abgelegt werden können. Beim Loslassen eines Icons wird `desktopStore.moveItem()` mit der neuen Grid-Position aufgerufen. Besetzte Zellen sollen ebenfalls als Drop-Target agieren (Tausch-Logik).

---

## 📋 Aufgaben

### 1. `GridCell`-Komponente anlegen

Eine neue Komponente `src/components/desktop/GridCell.tsx` erstellen, die `useDroppable` nutzt:

```tsx
import { useDroppable } from '@dnd-kit/core'

interface GridCellProps {
  col: number
  row: number
  children?: React.ReactNode
}

export default function GridCell({ col, row, children }: GridCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${col}-${row}`,
    data: {
      type: 'cell',
      col,
      row,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        relative flex items-center justify-center
        transition-colors duration-150
        ${isOver ? 'bg-white/10 rounded-xl ring-2 ring-white/30' : ''}
      `}
    >
      {children}
    </div>
  )
}
```

### 2. `DesktopGrid.tsx` mit `GridCell` aufbauen

Das Grid rendert für jede Grid-Position eine `GridCell`. Items werden ihrer `position.col` / `position.row` zugeordnet:

```tsx
const COLS = 12
const ROWS = 8

export default function DesktopGrid() {
  const items = useDesktopStore(s => s.items).filter(i => i.parentId === null)

  // Items nach Position indexieren
  const itemMap = new Map(items.map(i => [`${i.position.col}-${i.position.row}`, i]))

  return (
    <div
      className="grid w-full h-full p-4"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
    >
      {Array.from({ length: ROWS }, (_, row) =>
        Array.from({ length: COLS }, (_, col) => {
          const item = itemMap.get(`${col}-${row}`)
          return (
            <GridCell key={`${col}-${row}`} col={col} row={row}>
              {item && (item.type === 'link'
                ? <LinkIcon item={item as LinkItem} />
                : <FolderIcon item={item as FolderItem} />
              )}
            </GridCell>
          )
        })
      )}
    </div>
  )
}
```

### 3. `onDragEnd` in `DesktopCanvas.tsx` erweitern

Den Handler aus Task 4.1 so erweitern, dass er bei einem gültigen Drop auf eine Grid-Zelle `moveItem` aufruft:

```tsx
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event

  if (!over) return

  const overData = over.data.current
  if (overData?.type === 'cell') {
    moveItem(String(active.id), { col: overData.col, row: overData.row }, null)
  }
}
```

### 4. Tausch-Logik (Swap) bei besetzten Zellen

Wenn die Zielzelle bereits ein Item enthält, sollen beide Items ihre Position tauschen:

```tsx
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event
  if (!over) return

  const overData = over.data.current
  if (overData?.type === 'cell') {
    const newPos = { col: overData.col, row: overData.row }
    const existingItem = items.find(
      i => i.position.col === newPos.col && i.position.row === newPos.row && i.parentId === null
    )

    if (existingItem && existingItem.id !== active.id) {
      // Tausch: aktives Item zur neuen Position, bestehendes Item zur alten Position
      const activeItem = items.find(i => i.id === active.id)!
      moveItem(existingItem.id, activeItem.position, null)
    }
    moveItem(String(active.id), newPos, null)
  }
}
```

### 5. Hover-Highlighting

Drop-Zellen sollen beim Überfahren mit einem Icon visuell hervorgehoben werden (bereits in Schritt 1 über `isOver` + Tailwind-Klassen umgesetzt).

---

## ✅ Akzeptanzkriterien

- [ ] Jede Grid-Zelle ist ein `useDroppable`-Target mit eindeutiger ID (`cell-{col}-{row}`)
- [ ] Beim Draggen über eine Zelle wird diese visuell hervorgehoben (`isOver`)
- [ ] Nach dem Loslassen wird `moveItem` mit der neuen Grid-Position aufgerufen
- [ ] Die Icon-Position im Store und im UI wird korrekt aktualisiert
- [ ] Tausch-Logik funktioniert bei bereits besetzten Zellen
- [ ] Kein TypeScript-Fehler
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 📦 Vorausgesetzte Abhängigkeiten

| Paket | Version | Installiert in |
|---|---|---|
| `@dnd-kit/core` | ^6.x | Task 1.5 |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 4.1 (`DndContext`), Task 4.2 (Draggable Icons), Task 2.5 (Grid-Layout), Task 6.1 (Store mit `moveItem`)
- **Voraussetzung für:** Task 4.4 (Drop in Ordner), Task 4.7 (Kollisionsverhalten)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(dnd): Task 4.3 - Droppable Desktop-Grid-Zellen einrichten"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 4.3 auf `✅ Erledigt` setzen.

