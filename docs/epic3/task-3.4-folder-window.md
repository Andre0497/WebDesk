# Task 3.4 – `FolderWindow` Komponente

> **Epic:** EPIC 3 – Icon & Ordner-System  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Ein verschiebbares Fenster implementieren, das beim Doppelklick auf einen Ordner-Icon öffnet und die enthaltenen Links und Unterordner anzeigt. Das Fenster hat eine Titelleiste zum Verschieben (Drag), einen Schließen-Button und ein Grid für die Icons. Die Öffnen/Schließen-Animation läuft via Framer Motion.

---

## 📋 Aufgaben

### 1. `src/components/windows/WindowTitleBar.tsx` implementieren

```tsx
// src/components/windows/WindowTitleBar.tsx
import { XMarkIcon, MinusIcon } from '@heroicons/react/24/outline'

interface WindowTitleBarProps {
  title: string
  color: string
  emoji?: string
  onClose: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> // für Drag-to-Move (Task 4.x)
}

export default function WindowTitleBar({
  title,
  color,
  emoji,
  onClose,
  dragHandleProps,
}: WindowTitleBarProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3
                 border-b border-white/10 cursor-move select-none"
      {...dragHandleProps}
    >
      {/* Linke Seite: Ordner-Farbe + Titel */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        {emoji && <span className="text-base leading-none">{emoji}</span>}
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>

      {/* Rechte Seite: Schließen-Button */}
      <button
        onClick={onClose}
        className="w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500
                   flex items-center justify-center
                   text-red-900 hover:text-white transition-colors group"
        title="Schließen"
      >
        <XMarkIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  )
}
```

### 2. `src/components/windows/WindowGrid.tsx` implementieren

```tsx
// src/components/windows/WindowGrid.tsx
import LinkIcon from '../icons/LinkIcon'
import FolderIcon from '../icons/FolderIcon'
import type { DesktopItem, LinkItem, FolderItem } from '../../types'
import { isLinkItem, isFolderItem } from '../../types'

interface WindowGridProps {
  items: DesktopItem[]
  onItemContextMenu?: (e: React.MouseEvent, id: string) => void
}

export default function WindowGrid({ items, onItemContextMenu }: WindowGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-white/30 text-sm">
        <span className="text-3xl mb-2">📂</span>
        Ordner ist leer
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3 p-2">
      {items.map(item => (
        <div key={item.id}>
          {isLinkItem(item) && (
            <LinkIcon item={item as LinkItem} onContextMenu={onItemContextMenu} />
          )}
          {isFolderItem(item) && (
            <FolderIcon item={item as FolderItem} onContextMenu={onItemContextMenu} />
          )}
        </div>
      ))}
    </div>
  )
}
```

### 3. `src/components/windows/FolderWindow.tsx` implementieren

```tsx
// src/components/windows/FolderWindow.tsx
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WindowTitleBar from './WindowTitleBar'
import WindowGrid from './WindowGrid'
import type { FolderItem, DesktopItem } from '../../types'

interface FolderWindowProps {
  folder: FolderItem
  items: DesktopItem[]        // Items mit parentId === folder.id
  onClose: () => void
  onItemContextMenu?: (e: React.MouseEvent, id: string) => void
}

// Framer Motion Varianten
const windowVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 20,
    transition: { duration: 0.15 },
  },
}

export default function FolderWindow({
  folder,
  items,
  onClose,
  onItemContextMenu,
}: FolderWindowProps) {
  // Fenster-Position (wird in Task 4.x mit Store verbunden)
  const [position, setPosition] = useState(
    folder.windowPosition ?? { x: 200, y: 100 }
  )
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 })

  // Fenster verschieben per Titelleisten-Drag
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: position.x,
      winY: position.y,
    }

    const handleMouseMove = (ev: MouseEvent) => {
      setPosition({
        x: dragStartRef.current.winX + (ev.clientX - dragStartRef.current.mouseX),
        y: dragStartRef.current.winY + (ev.clientY - dragStartRef.current.mouseY),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <AnimatePresence>
      <motion.div
        key={folder.id}
        variants={windowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ left: position.x, top: position.y }}
        className={`fixed z-40 w-80 min-h-40 max-h-[60vh]
                    bg-gray-800/90 backdrop-blur-md
                    border border-white/15 rounded-2xl shadow-2xl
                    flex flex-col overflow-hidden
                    ${isDragging ? 'cursor-grabbing' : ''}`}
      >
        <WindowTitleBar
          title={folder.name}
          color={folder.color}
          emoji={folder.emoji}
          onClose={onClose}
          dragHandleProps={{ onMouseDown: handleTitleMouseDown }}
        />

        {/* Scrollbarer Inhalt */}
        <div className="flex-1 overflow-y-auto p-2">
          <WindowGrid items={items} onItemContextMenu={onItemContextMenu} />
        </div>

        {/* Footer: Item-Anzahl */}
        <div className="px-4 py-2 border-t border-white/10 text-xs text-white/40 text-right">
          {items.length} {items.length === 1 ? 'Element' : 'Elemente'}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
```

### 4. `FolderWindow` in `DesktopCanvas` einbinden

```tsx
// In DesktopCanvas.tsx – offene Fenster rendern
import FolderWindow from '../windows/FolderWindow'
import { defaultItems } from '../../utils/defaultData'
import { isFolderItem } from '../../types'

const openFolders = defaultItems.filter(
  item => isFolderItem(item) && item.isOpen
) as FolderItem[]

// Im JSX – nach DesktopGrid:
{openFolders.map(folder => (
  <FolderWindow
    key={folder.id}
    folder={folder}
    items={defaultItems.filter(item => item.parentId === folder.id)}
    onClose={() => console.log('Fenster schließen:', folder.id)} // Task 6.1
  />
))}
```

---

## ✅ Akzeptanzkriterien

- [ ] Fenster öffnet sich mit Framer-Motion-Animation (scale + fade)
- [ ] Fenster schließt sich mit Austrittsanimation (`AnimatePresence`)
- [ ] Fenster kann per Titelleiste verschoben werden (Mouse-Drag)
- [ ] Schließen-Button schließt das Fenster
- [ ] Leerer Ordner zeigt Platzhalter-Text
- [ ] Links und Ordner werden korrekt im `WindowGrid` dargestellt
- [ ] Item-Anzahl wird im Footer angezeigt
- [ ] Fenster liegt über dem Desktop-Grid (korrektes z-index)
- [ ] Glassmorphism-Effekt ist sichtbar (backdrop-blur)
- [ ] `npm run lint` meldet keine Fehler

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Zweck |
|---|---|
| `framer-motion` | `AnimatePresence`, `motion.div` für Fenster-Animation |
| `@heroicons/react` | `XMarkIcon` in der Titelleiste |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.4 (Framer Motion), Task 3.1 (Datenmodell), Task 3.2 (LinkIcon), Task 3.3 (FolderIcon)
- **Voraussetzung für:** Task 4.6 (Sortierung innerhalb Ordner), Task 5.2 (Fenster-Animation verfeinern), Task 5.5 (Glassmorphism)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(windows): Task 3.4 - FolderWindow mit Titelleiste, Grid und Animations implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 3.4 auf `✅ Erledigt` setzen.

