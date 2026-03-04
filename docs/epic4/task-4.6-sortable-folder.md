# Task 4.6 – Sortierung innerhalb Ordner

> **Epic:** EPIC 4 – Drag & Drop  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Items innerhalb eines geöffneten `FolderWindow` sollen per Drag & Drop umsortiert werden können. Hierfür wird `@dnd-kit/sortable` mit `SortableContext` und dem `useSortable`-Hook verwendet. Die neue Reihenfolge wird im Store persistiert.

---

## 📋 Aufgaben

### 1. `SortableContext` in `WindowGrid.tsx` einbinden

Der `SortableContext` umschließt alle Items innerhalb eines Ordnerfensters und erhält eine geordnete Liste von Item-IDs:

```tsx
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

interface WindowGridProps {
  folderId: string
}

export default function WindowGrid({ folderId }: WindowGridProps) {
  const items = useDesktopStore(s =>
    s.items
      .filter(i => i.parentId === folderId)
      .sort((a, b) => a.position.row - b.position.row || a.position.col - b.position.col)
  )

  const itemIds = items.map(i => i.id)

  return (
    <SortableContext items={itemIds} strategy={rectSortingStrategy}>
      <div className="grid grid-cols-4 gap-4 p-4">
        {items.map(item =>
          item.type === 'link'
            ? <SortableLinkIcon key={item.id} item={item as LinkItem} />
            : <SortableFolderIcon key={item.id} item={item as FolderItem} />
        )}
      </div>
    </SortableContext>
  )
}
```

### 2. `useSortable`-Hook in Ordner-Icon-Varianten nutzen

Für Icons innerhalb von Ordnern wird `useSortable` statt `useDraggable` verwendet (beide sind kombiniert):

```tsx
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SortableLinkIcon({ item }: { item: LinkItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { type: 'link', item },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none"
    >
      <img src={item.faviconUrl} alt={item.name} className="w-10 h-10 rounded-lg" />
      <span className="text-white text-xs truncate max-w-[72px]">{item.name}</span>
    </div>
  )
}
```

> Eine analoge `SortableFolderIcon`-Komponente wird für Ordner-Items innerhalb eines Ordners erstellt.

### 3. `onDragEnd` für Sortierung innerhalb Ordner erweitern

In `FolderWindow.tsx` (oder im umschließenden DndContext) den Sortier-Fall behandeln:

```tsx
import { arrayMove } from '@dnd-kit/sortable'

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event
  if (!over || active.id === over.id) return

  // Reihenfolge der Items im Ordner bestimmen
  const oldIndex = itemIds.indexOf(String(active.id))
  const newIndex = itemIds.indexOf(String(over.id))

  if (oldIndex !== -1 && newIndex !== -1) {
    const reordered = arrayMove(items, oldIndex, newIndex)
    // Neue Positionen speichern
    reordered.forEach((item, index) => {
      updateItem(item.id, { position: { col: index % 4, row: Math.floor(index / 4) } })
    })
  }
}
```

### 4. Entscheidung: Separater DndContext im FolderWindow

Da der äußere `DndContext` auf dem Desktop liegt, wird für die Sortierung innerhalb eines Ordners ein **geschachtelter** `DndContext` in `FolderWindow.tsx` verwendet. dnd-kit unterstützt verschachtelte Contexte – Events werden nicht nach oben propagiert:

```tsx
// FolderWindow.tsx
<DndContext onDragEnd={handleFolderDragEnd} collisionDetection={closestCenter}>
  <WindowGrid folderId={item.id} />
</DndContext>
```

> ⚠️ **Wichtig:** `closestCenter` als Kollisions-Algorithmus für Sortable-Listen verwenden, nicht `rectIntersection`.

### 5. Animations-Strategie mit Framer Motion

Die von `useSortable` gelieferte `transition`-Variable sorgt bereits für eine CSS-Transition beim Umsortieren. Für ein eleganteres Ergebnis kann `layoutId` von Framer Motion zusätzlich genutzt werden:

```tsx
<motion.div layoutId={item.id} ...>
```

---

## ✅ Akzeptanzkriterien

- [ ] Items in `FolderWindow` können per Drag umsortiert werden
- [ ] Die neue Reihenfolge wird im Store gespeichert und überlebt einen Reload
- [ ] `SortableContext` mit `rectSortingStrategy` ist korrekt eingerichtet
- [ ] Geschachtelter `DndContext` in `FolderWindow` verhindert Konflikte mit dem Desktop-DnD
- [ ] `closestCenter` wird als Kollisions-Algorithmus im Ordner-DndContext verwendet
- [ ] Kein TypeScript-Fehler
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 📦 Vorausgesetzte Abhängigkeiten

| Paket | Version | Installiert in |
|---|---|---|
| `@dnd-kit/core` | ^6.x | Task 1.5 |
| `@dnd-kit/sortable` | ^8.x | Task 1.5 |
| `@dnd-kit/utilities` | ^3.x | Task 1.5 |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 4.1 (`DndContext`), Task 4.2 (Draggable Icons), Task 3.4 (`FolderWindow` + `WindowGrid`), Task 6.1 (Store mit `updateItem`)
- **Voraussetzung für:** Task 4.7 (Kollisionsverhalten), Task 5.2 (Ordner-Animationen)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(dnd): Task 4.6 - Sortierung innerhalb Ordner mit dnd-kit/sortable"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 4.6 auf `✅ Erledigt` setzen.

