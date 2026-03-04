# Task 2.3 – `ContextMenu` Komponente

> **Epic:** EPIC 2 – Core UI & Desktop-Layout  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Ein Rechtsklick-Kontextmenü implementieren, das kontextsensitiv auf dem Desktop (Leerbereich) und auf Icons erscheint. Das Menü wird über ein React-Portal direkt in `document.body` gerendert und absolut an der Mausposition positioniert. Es schließt sich automatisch bei Klick außerhalb oder Drücken von `Escape`.

---

## 📋 Aufgaben

### 1. `src/hooks/useContextMenu.ts` implementieren

```typescript
import { useState, useEffect, useCallback } from 'react'

interface ContextMenuState {
  isOpen: boolean
  x: number
  y: number
  targetId: string | null
}

export function useContextMenu() {
  const [state, setState] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    targetId: null,
  })

  const open = useCallback((x: number, y: number, targetId: string | null = null) => {
    setState({ isOpen: true, x, y, targetId })
  }, [])

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  // Schließen bei Klick außerhalb oder Escape
  useEffect(() => {
    if (!state.isOpen) return
    const handleClick = () => close()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [state.isOpen, close])

  return { ...state, open, close }
}
```

### 2. `src/components/ui/ContextMenu.tsx` implementieren

Das Menü wird via `ReactDOM.createPortal` in `document.body` eingehängt. Damit liegt es immer über allen anderen Elementen, unabhängig von CSS-Stacking-Kontexten.

```tsx
import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'

export interface ContextMenuItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  danger?: boolean
  disabled?: boolean
  divider?: boolean
}

interface ContextMenuProps {
  isOpen: boolean
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export default function ContextMenu({ isOpen, x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Menü am Bildschirmrand spiegeln, wenn zu nah am Rand
  useEffect(() => {
    if (!menuRef.current || !isOpen) return
    const menu = menuRef.current
    const rect = menu.getBoundingClientRect()
    if (rect.right > window.innerWidth) {
      menu.style.left = `${x - rect.width}px`
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = `${y - rect.height}px`
    }
  }, [isOpen, x, y])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={menuRef}
      style={{ top: y, left: x }}
      className="fixed z-[9999] min-w-48 py-1
                 bg-gray-800/95 backdrop-blur-sm
                 border border-white/10 rounded-xl shadow-2xl
                 text-white text-sm"
      onClick={e => e.stopPropagation()}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.divider && <div className="my-1 border-t border-white/10" />}
          <button
            disabled={item.disabled}
            onClick={() => {
              item.onClick()
              onClose()
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left
                        transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                        ${item.danger
                          ? 'hover:bg-red-500/20 text-red-400'
                          : 'hover:bg-white/10'
                        }`}
          >
            {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
            {item.label}
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
```

### 3. `DesktopCanvas.tsx` – ContextMenu einbinden

```tsx
import { PlusIcon, FolderPlusIcon } from '@heroicons/react/24/outline'
import { useContextMenu } from '../../hooks/useContextMenu'
import ContextMenu from '../ui/ContextMenu'

export default function DesktopCanvas() {
  const contextMenu = useContextMenu()

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.open(e.clientX, e.clientY, null)
  }

  const desktopMenuItems = [
    {
      label: 'Neuer Link',
      icon: <PlusIcon />,
      onClick: () => console.log('Neuer Link'),  // Task 3.6
    },
    {
      label: 'Neuer Ordner',
      icon: <FolderPlusIcon />,
      onClick: () => console.log('Neuer Ordner'), // Task 3.7
    },
  ]

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      onContextMenu={handleContextMenu}
    >
      {/* ... restliche Komponenten ... */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        items={desktopMenuItems}
        onClose={contextMenu.close}
      />
    </div>
  )
}
```

### 4. Icon-Kontextmenü vorbereiten

`LinkIcon` und `FolderIcon` erhalten später (Task 3.2/3.3) ein eigenes Kontextmenü mit:
- **Öffnen** (nur Ordner)
- **Bearbeiten**
- **Löschen** (danger)

Das `ContextMenu`-Interface (`ContextMenuItem[]`) ist bereits so ausgelegt, dass es beide Kontexte (Desktop + Icon) unterstützt.

---

## ✅ Akzeptanzkriterien

- [ ] Rechtsklick auf den Desktop-Hintergrund öffnet das Kontextmenü
- [ ] Menü erscheint exakt an der Mausposition
- [ ] Menü spiegelt sich, wenn es am rechten/unteren Rand abgeschnitten würde
- [ ] Klick außerhalb des Menüs schließt es
- [ ] `Escape`-Taste schließt das Menü
- [ ] Menü-Einträge „Neuer Link" und „Neuer Ordner" sind sichtbar (Konsolenausgabe als Platzhalter)
- [ ] Menü rendert über allen anderen Elementen (Portal in `document.body`)
- [ ] `npm run lint` meldet keine Fehler

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Zweck |
|---|---|
| `@heroicons/react` | `PlusIcon`, `FolderPlusIcon` für Menü-Icons |
| `react-dom` | `createPortal` für Portal-Rendering |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.6 (Heroicons), Task 2.1 (DesktopCanvas)
- **Voraussetzung für:** Task 3.2 (LinkIcon-Kontextmenü), Task 3.3 (FolderIcon-Kontextmenü), Task 3.6 (AddLinkModal öffnen), Task 3.7 (AddFolderModal öffnen)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(ui): Task 2.3 - ContextMenu Komponente und useContextMenu Hook implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 2.3 auf `✅ Erledigt` setzen.

