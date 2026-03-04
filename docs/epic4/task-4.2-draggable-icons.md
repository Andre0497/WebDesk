# Task 4.2 – Draggable Icons

> **Epic:** EPIC 4 – Drag & Drop  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

`LinkIcon` und `FolderIcon` mit dem `useDraggable`-Hook aus `@dnd-kit/core` ausstatten, sodass sie auf dem Desktop und innerhalb von Ordnerfenstern gezogen werden können. Die Icons sollen während des Ziehens visuelles Feedback geben (Transparenz / Skalierung via Framer Motion).

---

## 📋 Aufgaben

### 1. `useDraggable` in `LinkIcon.tsx` integrieren

```tsx
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'

interface LinkIconProps {
  item: LinkItem
}

export default function LinkIcon({ item }: LinkIconProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: {
      type: 'link',
      item,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      animate={{ opacity: isDragging ? 0.4 : 1, scale: isDragging ? 0.95 : 1 }}
      transition={{ duration: 0.15 }}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Favicon-Bild + Label */}
      <img src={item.faviconUrl} alt={item.name} className="w-12 h-12 rounded-lg" />
      <span className="text-white text-xs text-center max-w-[80px] truncate">{item.name}</span>
    </motion.div>
  )
}
```

### 2. `useDraggable` in `FolderIcon.tsx` integrieren

Analog zu `LinkIcon`, jedoch mit `type: 'folder'` im `data`-Objekt:

```tsx
const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
  id: item.id,
  data: {
    type: 'folder',
    item,
  },
})
```

### 3. `data`-Payload definieren

Das `data`-Objekt im `useDraggable`-Aufruf muss immer das vollständige Item enthalten, damit `onDragEnd` im `DndContext` direkt auf den Typ und die Daten zugreifen kann, ohne im Store nachschlagen zu müssen:

```typescript
// src/types/dnd.ts (neu anlegen)
export interface DraggableData {
  type: 'link' | 'folder'
  item: DesktopItem
}
```

### 4. Klick vs. Drag unterscheiden

Da `useDraggable` `listeners` auf das Element legt, könnten Klick-Events (Link öffnen, Ordner öffnen) unterdrückt werden. Das wird durch den `activationConstraint: { distance: 8 }` aus Task 4.1 gelöst – Bewegungen unter 8px gelten als Klick.

Zusätzlich sicherstellen, dass `onClick` **nicht** auf dem `ref`-Element selbst liegt, sondern als separate Handler-Prop übergeben wird:

```tsx
<motion.div
  ref={setNodeRef}
  {...listeners}
  {...attributes}
  onClick={isDragging ? undefined : () => onOpen(item)}
>
```

### 5. Visuellen Drag-State überprüfen

Im Browser testen:
- Icon wird beim Ziehen halbtransparent
- Cursor wechselt zu `grabbing`
- Original-Position bleibt als „Platzhalter" sichtbar (wird in Task 4.5 durch Ghost-Preview ersetzt)

---

## ✅ Akzeptanzkriterien

- [ ] `LinkIcon` kann mit `useDraggable` gezogen werden
- [ ] `FolderIcon` kann mit `useDraggable` gezogen werden
- [ ] `data`-Payload enthält `type` und `item`
- [ ] Icon wird beim Ziehen visuell auf `opacity: 0.4` gesetzt
- [ ] Klick auf Icon öffnet weiterhin den Link / Ordner (kein ungewolltes Unterdrücken)
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

- **Voraussetzung:** Task 4.1 (`DndContext` aktiv), Task 3.2 (`LinkIcon`), Task 3.3 (`FolderIcon`)
- **Voraussetzung für:** Task 4.3 (Droppable Grid), Task 4.4 (Drop in Ordner), Task 4.5 (Ghost-Preview)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(dnd): Task 4.2 - Draggable Icons (LinkIcon & FolderIcon)"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 4.2 auf `✅ Erledigt` setzen.

