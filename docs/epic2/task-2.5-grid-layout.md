# Task 2.5 – Responsives Grid-Layout

> **Epic:** EPIC 2 – Core UI & Desktop-Layout  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Ein CSS-Grid implementieren, das den Desktop in gleichmäßige Zellen aufteilt. Jede Zelle kann ein Icon (Link oder Ordner) aufnehmen. Die Anzahl der Spalten und Zeilen berechnet sich dynamisch aus der Fenstergröße und der konfigurierbaren `gridSize` (Breite einer Zelle in px). Das Grid ist die Grundlage für das spätere Drag-&-Drop-System.

---

## 📋 Aufgaben

### 1. `src/hooks/useDesktopGrid.ts` implementieren

Berechnet die Anzahl der Spalten und Zeilen anhand der Fenstergröße:

```typescript
import { useState, useEffect } from 'react'

interface GridDimensions {
  cols: number
  rows: number
  cellSize: number
}

export function useDesktopGrid(cellSize: number = 100): GridDimensions {
  const TASKBAR_HEIGHT = 48  // px – Höhe der Taskbar

  const calculate = (): GridDimensions => ({
    cols: Math.floor(window.innerWidth / cellSize),
    rows: Math.floor((window.innerHeight - TASKBAR_HEIGHT) / cellSize),
    cellSize,
  })

  const [dimensions, setDimensions] = useState<GridDimensions>(calculate)

  useEffect(() => {
    const handleResize = () => setDimensions(calculate())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [cellSize])

  return dimensions
}
```

### 2. `src/components/desktop/DesktopGrid.tsx` vollständig implementieren

```tsx
import { useDesktopGrid } from '../../hooks/useDesktopGrid'

export default function DesktopGrid() {
  const { cols, rows, cellSize } = useDesktopGrid(100)

  return (
    <div
      className="w-full h-full"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        padding: '8px',
        gap: '4px',
      }}
    >
      {/* Grid-Zellen als Drop-Targets (wird in Task 4.3 mit useDroppable ausgestattet) */}
      {Array.from({ length: cols * rows }).map((_, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        return (
          <GridCell key={`${col}-${row}`} col={col} row={row} />
        )
      })}
    </div>
  )
}

interface GridCellProps {
  col: number
  row: number
}

function GridCell({ col, row }: GridCellProps) {
  return (
    <div
      data-col={col}
      data-row={row}
      className="w-full h-full rounded-lg
                 hover:bg-white/5 transition-colors duration-150"
      // wird in Task 4.3 mit useDroppable erweitert
    />
  )
}
```

### 3. Icons auf dem Grid positionieren

Icons werden über ihre `position.col` und `position.row` absolut im Grid platziert. Dazu wird `grid-column` und `grid-row` via `style` gesetzt:

```tsx
// Beispiel – wie Icons später im Grid platziert werden (Task 3.2/3.3):
<div
  style={{
    gridColumn: item.position.col + 1,  // CSS Grid ist 1-basiert
    gridRow: item.position.row + 1,
  }}
>
  <LinkIcon item={item} />
</div>
```

> **Hinweis:** `col + 1` weil CSS Grid 1-basiert ist, das Datenmodell aber 0-basiert.

### 4. Grid-Overlay im Dev-Modus (optional)

Während der Entwicklung kann ein Debug-Grid-Overlay eingeblendet werden:

```tsx
{import.meta.env.DEV && (
  <div
    className="absolute inset-0 pointer-events-none opacity-10"
    style={{
      backgroundImage: `
        linear-gradient(to right, #fff 1px, transparent 1px),
        linear-gradient(to bottom, #fff 1px, transparent 1px)
      `,
      backgroundSize: `${cellSize}px ${cellSize}px`,
    }}
  />
)}
```

---

## ✅ Akzeptanzkriterien

- [ ] Grid füllt den gesamten Bereich oberhalb der Taskbar
- [ ] Grid-Zellen passen sich dynamisch an die Fenstergröße an
- [ ] Bei `window.resize` wird das Grid neu berechnet
- [ ] Hover-Effekt auf Grid-Zellen ist sichtbar
- [ ] Grid-Zellen haben korrekte `data-col` und `data-row` Attribute
- [ ] Kein horizontaler oder vertikaler Scrollbalken entsteht
- [ ] `npm run lint` meldet keine Fehler

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.2 (Tailwind), Task 2.1 (DesktopCanvas)
- **Voraussetzung für:** Task 3.2 (LinkIcon im Grid), Task 3.3 (FolderIcon im Grid), Task 4.3 (Droppable Grid-Zellen)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(desktop): Task 2.5 - Responsives Grid-Layout und useDesktopGrid Hook implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 2.5 auf `✅ Erledigt` setzen.

