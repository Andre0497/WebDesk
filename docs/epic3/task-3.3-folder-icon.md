# Task 3.3 – `FolderIcon` Komponente

> **Epic:** EPIC 3 – Icon & Ordner-System  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Die `FolderIcon`-Komponente implementieren, die einen Ordner auf dem Desktop darstellt. Das Icon zeigt die Ordnerfarbe, ein optionales Emoji sowie ein Badge mit der Anzahl der enthaltenen Items. Per Doppelklick öffnet sich das `FolderWindow`. Per Rechtsklick erscheint ein Kontextmenü mit „Öffnen", „Bearbeiten" und „Löschen".

---

## 📋 Aufgaben

### 1. `src/components/icons/FolderIcon.tsx` implementieren

```tsx
// src/components/icons/FolderIcon.tsx
import { FolderIcon as HeroFolderIcon } from '@heroicons/react/24/solid'
import type { FolderItem } from '../../types'
import IconLabel from './IconLabel'

interface FolderIconProps {
  item: FolderItem
  itemCount?: number
  onDoubleClick?: (id: string) => void
  onContextMenu?: (e: React.MouseEvent, id: string) => void
  // wird in Task 4.2 um Drag-Props erweitert
}

export default function FolderIcon({
  item,
  itemCount = 0,
  onDoubleClick,
  onContextMenu,
}: FolderIconProps) {

  const handleDoubleClick = () => {
    onDoubleClick?.(item.id)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu?.(e, item.id)
  }

  return (
    <div
      className="flex flex-col items-center justify-start w-[88px] cursor-pointer
                 group select-none"
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      title={item.name}
    >
      {/* Icon-Container */}
      <div className="relative">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center
                     backdrop-blur-sm border border-white/20
                     group-hover:scale-110 group-active:scale-95
                     transition-all duration-150 ease-out"
          style={{ backgroundColor: `${item.color}33` }} // 20% Opacity der Ordnerfarbe
        >
          {item.emoji ? (
            <span className="text-3xl leading-none select-none">{item.emoji}</span>
          ) : (
            <HeroFolderIcon
              className="w-9 h-9 drop-shadow-md"
              style={{ color: item.color }}
            />
          )}
        </div>

        {/* Item-Count Badge */}
        {itemCount > 0 && (
          <div
            className="absolute -top-1.5 -right-1.5
                       min-w-[20px] h-5 px-1.5 rounded-full
                       bg-gray-900 border border-white/20
                       flex items-center justify-center
                       text-[10px] font-bold text-white/80"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </div>
        )}

        {/* Öffnen-Indikator */}
        {item.isOpen && (
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2
                       w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
        )}
      </div>

      {/* Label */}
      <IconLabel name={item.name} />
    </div>
  )
}
```

### 2. Ordner-Kontextmenü-Items definieren

```tsx
// In DesktopCanvas.tsx – Ordner-Kontextmenü
import { FolderOpenIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const getFolderMenuItems = (folderId: string, isOpen: boolean) => [
  {
    label: isOpen ? 'Schließen' : 'Öffnen',
    icon: <FolderOpenIcon />,
    onClick: () => console.log('Öffnen/Schließen:', folderId), // Task 3.4
  },
  {
    label: 'Bearbeiten',
    icon: <PencilIcon />,
    onClick: () => console.log('Bearbeiten:', folderId), // Task 3.8
  },
  {
    divider: true,
    label: 'Löschen',
    icon: <TrashIcon />,
    danger: true,
    onClick: () => console.log('Löschen:', folderId), // Task 3.9
  },
]
```

### 3. `FolderIcon` im `DesktopGrid` rendern

```tsx
// In DesktopGrid.tsx – Ordner-Icons positionieren
import FolderIcon from '../icons/FolderIcon'
import type { FolderItem } from '../../types'

const desktopFolders = defaultItems.filter(
  item => item.type === 'folder' && item.parentId === null
) as FolderItem[]

// itemCount pro Ordner berechnen:
const getItemCount = (folderId: string) =>
  defaultItems.filter(item => item.parentId === folderId).length

// Im Grid-JSX:
{desktopFolders.map(folder => (
  <div
    key={folder.id}
    style={{ gridColumn: folder.position.col + 1, gridRow: folder.position.row + 1 }}
    className="flex items-center justify-center"
  >
    <FolderIcon
      item={folder}
      itemCount={getItemCount(folder.id)}
      onDoubleClick={id => console.log('Ordner öffnen:', id)} // Task 3.4
    />
  </div>
))}
```

### 4. Ordner-Farben – Vordefinierte Palette

Für den `AddFolderModal` (Task 3.7) werden folgende Standardfarben angeboten:

```typescript
// src/utils/defaultData.ts – ergänzen
export const folderColors = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#64748b', // Slate
]
```

---

## ✅ Akzeptanzkriterien

- [ ] `FolderIcon` rendert mit der korrekten Ordnerfarbe
- [ ] Emoji wird angezeigt, falls gesetzt; sonst `HeroFolderIcon`
- [ ] Item-Count-Badge zeigt die Anzahl der enthaltenen Items
- [ ] Badge zeigt `99+` bei mehr als 99 Items
- [ ] Öffnen-Indikator (kleiner Punkt) erscheint, wenn `isOpen: true`
- [ ] Hover-Effekt: Icon skaliert auf 110%
- [ ] Doppelklick ruft `onDoubleClick` Callback auf
- [ ] Rechtsklick öffnet Kontextmenü mit „Öffnen", „Bearbeiten", „Löschen"
- [ ] `npm run lint` meldet keine Fehler

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Zweck |
|---|---|
| `@heroicons/react/24/solid` | `FolderIcon` als Standard-Ordner-Icon |
| `@heroicons/react/24/outline` | `FolderOpenIcon`, `PencilIcon`, `TrashIcon` für Kontextmenü |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.2 (Tailwind), Task 1.6 (Heroicons), Task 2.5 (DesktopGrid), Task 3.1 (Datenmodell), Task 3.2 (`IconLabel`)
- **Voraussetzung für:** Task 3.4 (FolderWindow öffnen), Task 3.8 (EditItemModal), Task 4.2 (Draggable), Task 4.4 (Drop in Ordner)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(icons): Task 3.3 - FolderIcon Komponente mit Badge und Kontextmenü implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 3.3 auf `✅ Erledigt` setzen.

