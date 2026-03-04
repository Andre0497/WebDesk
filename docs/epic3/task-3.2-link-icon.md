# Task 3.2 – `LinkIcon` Komponente

> **Epic:** EPIC 3 – Icon & Ordner-System  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Die `LinkIcon`-Komponente implementieren, die einen Web-Link als Icon auf dem Desktop darstellt. Das Icon zeigt das Favicon der Ziel-URL, einen Namen als Label darunter sowie einen Hover-Effekt. Per Doppelklick wird der Link in einem neuen Tab geöffnet. Per Rechtsklick erscheint ein Kontextmenü mit „Bearbeiten" und „Löschen".

---

## 📋 Aufgaben

### 1. `src/components/icons/IconLabel.tsx` implementieren

Wiederverwendbares Label für Link- und Folder-Icons:

```tsx
// src/components/icons/IconLabel.tsx
interface IconLabelProps {
  name: string
  selected?: boolean
}

export default function IconLabel({ name, selected = false }: IconLabelProps) {
  return (
    <span
      className={`mt-1.5 px-1 py-0.5 rounded text-xs text-center leading-tight
                  max-w-[88px] line-clamp-2 break-words
                  ${selected
                    ? 'bg-indigo-600 text-white'
                    : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                  }`}
    >
      {name}
    </span>
  )
}
```

### 2. `src/components/icons/LinkIcon.tsx` implementieren

```tsx
// src/components/icons/LinkIcon.tsx
import { useState } from 'react'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import type { LinkItem } from '../../types'
import IconLabel from './IconLabel'

interface LinkIconProps {
  item: LinkItem
  onContextMenu?: (e: React.MouseEvent, id: string) => void
  // wird in Task 4.2 um Drag-Props erweitert
}

export default function LinkIcon({ item, onContextMenu }: LinkIconProps) {
  const [faviconError, setFaviconError] = useState(false)

  const handleDoubleClick = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer')
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
      title={item.url}
    >
      {/* Icon-Container */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center
                   bg-white/10 backdrop-blur-sm border border-white/20
                   group-hover:bg-white/20 group-hover:scale-110
                   group-active:scale-95
                   transition-all duration-150 ease-out"
      >
        {item.faviconUrl && !faviconError ? (
          <img
            src={item.faviconUrl}
            alt={item.name}
            className="w-8 h-8 rounded-md object-contain"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <GlobeAltIcon className="w-8 h-8 text-white/70" />
        )}
      </div>

      {/* Label */}
      <IconLabel name={item.name} />
    </div>
  )
}
```

### 3. Icon-Kontextmenü in `DesktopCanvas` verdrahten

```tsx
// In DesktopCanvas.tsx – Icon-Kontextmenü-Items
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const getIconMenuItems = (itemId: string) => [
  {
    label: 'Bearbeiten',
    icon: <PencilIcon />,
    onClick: () => console.log('Bearbeiten:', itemId), // Task 3.8
  },
  {
    label: 'Löschen',
    icon: <TrashIcon />,
    danger: true,
    onClick: () => console.log('Löschen:', itemId),   // Task 3.9
  },
]
```

### 4. Icons im `DesktopGrid` rendern

In `DesktopGrid.tsx` die Items aus dem Store lesen und positionieren (Platzhalter bis Task 6.1):

```tsx
import LinkIcon from '../icons/LinkIcon'
import type { LinkItem } from '../../types'

// Temporäre Demo-Items (wird in Task 6.1 durch Store ersetzt)
import { defaultItems } from '../../utils/defaultData'

export default function DesktopGrid() {
  const { cols, rows, cellSize } = useDesktopGrid(100)
  const desktopLinks = defaultItems.filter(
    item => item.type === 'link' && item.parentId === null
  ) as LinkItem[]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, ... }}>
      {/* Grid-Zellen ... */}

      {/* Icons über dem Grid */}
      {desktopLinks.map(item => (
        <div
          key={item.id}
          style={{ gridColumn: item.position.col + 1, gridRow: item.position.row + 1 }}
          className="flex items-center justify-center"
        >
          <LinkIcon item={item} />
        </div>
      ))}
    </div>
  )
}
```

---

## ✅ Akzeptanzkriterien

- [ ] `LinkIcon` rendert das Favicon korrekt
- [ ] Bei Favicon-Fehler wird `GlobeAltIcon` als Fallback angezeigt
- [ ] Doppelklick öffnet die URL in einem neuen Tab (`noopener,noreferrer`)
- [ ] Hover-Effekt: Icon skaliert auf 110%
- [ ] Click-Effekt: Icon skaliert auf 95% (aktiv)
- [ ] Rechtsklick öffnet Kontextmenü mit „Bearbeiten" und „Löschen"
- [ ] Icon-Label ist auf max. 2 Zeilen begrenzt und bricht korrekt um
- [ ] Icons werden korrekt im Desktop-Grid positioniert
- [ ] `npm run lint` meldet keine Fehler

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Zweck |
|---|---|
| `@heroicons/react` | `GlobeAltIcon` als Favicon-Fallback, `PencilIcon`, `TrashIcon` |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.2 (Tailwind), Task 1.6 (Heroicons), Task 2.5 (DesktopGrid), Task 3.1 (Datenmodell)
- **Voraussetzung für:** Task 3.5 (Favicon-Service), Task 3.8 (EditItemModal), Task 4.2 (Draggable)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(icons): Task 3.2 - LinkIcon Komponente mit Favicon und Kontextmenü implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 3.2 auf `✅ Erledigt` setzen.

