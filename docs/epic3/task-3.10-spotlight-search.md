# Task 3.10 – Suche / Schnellzugriff

> **Epic:** EPIC 3 – Icon & Ordner-System  
> **Priorität:** 🟢 Niedrig  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Eine Spotlight-artige Suchleiste implementieren, die über einen Tastatur-Shortcut (`Strg+K` / `Cmd+K`) oder den Taskbar-Button geöffnet wird. Die Suche filtert alle gespeicherten Links und Ordner in Echtzeit und öffnet Treffer per Klick oder `Enter` direkt.

---

## 📋 Aufgaben

### 1. `src/components/taskbar/SearchBar.tsx` vollständig implementieren

Die Suchleiste in der Taskbar öffnet das Spotlight-Modal:

```tsx
// src/components/taskbar/SearchBar.tsx
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  onOpen: () => void
}

export default function SearchBar({ onOpen }: SearchBarProps) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-2 px-3 py-1.5
                 bg-white/10 hover:bg-white/20
                 border border-white/15 rounded-lg
                 text-white/50 hover:text-white/80
                 text-sm transition-colors"
    >
      <MagnifyingGlassIcon className="w-4 h-4 shrink-0" />
      <span className="hidden sm:inline">Suchen …</span>
      <kbd className="hidden sm:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded">
        Strg K
      </kbd>
    </button>
  )
}
```

### 2. Spotlight-Modal-Komponente anlegen

Neue Datei `src/components/ui/SpotlightSearch.tsx`:

```tsx
// src/components/ui/SpotlightSearch.tsx
import { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, LinkIcon, FolderIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { isLinkItem, isFolderItem } from '../../types'
import type { DesktopItem, LinkItem, FolderItem } from '../../types'

interface SpotlightSearchProps {
  isOpen: boolean
  onClose: () => void
  items: DesktopItem[]
  onOpenFolder: (id: string) => void
}

export default function SpotlightSearch({
  isOpen,
  onClose,
  items,
  onOpenFolder,
}: SpotlightSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Suchergebnisse berechnen
  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return items.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(q)
      const urlMatch = isLinkItem(item) && item.url.toLowerCase().includes(q)
      const descMatch = isLinkItem(item) && item.description?.toLowerCase().includes(q)
      return nameMatch || urlMatch || descMatch
    })
  }, [query, items])

  // Auswahl zurücksetzen bei neuem Query
  useEffect(() => setSelectedIndex(0), [query])

  // Fokus beim Öffnen
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Keyboard-Navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        handleSelect(results[selectedIndex])
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  const handleSelect = (item: DesktopItem) => {
    if (isLinkItem(item)) {
      window.open(item.url, '_blank', 'noopener,noreferrer')
    } else if (isFolderItem(item)) {
      onOpenFolder(item.id)
    }
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9997]" onClick={onClose}>

        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Spotlight-Panel */}
        <div className="absolute inset-x-0 top-[15%] flex justify-center px-4">
          <motion.div
            className="w-full max-w-xl bg-gray-800/95 backdrop-blur-md
                       border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sucheingabe */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
              <MagnifyingGlassIcon className="w-5 h-5 text-white/40 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Links und Ordner suchen …"
                className="flex-1 bg-transparent text-white placeholder-white/30
                           text-base outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-white/30 hover:text-white/60">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Ergebnisliste */}
            {results.length > 0 && (
              <ul className="max-h-80 overflow-y-auto py-2">
                {results.map((item, index) => (
                  <li key={item.id}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left
                                  transition-colors
                                  ${index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'}`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        {isLinkItem(item) && item.faviconUrl ? (
                          <img src={item.faviconUrl} alt="" className="w-5 h-5 rounded object-contain" />
                        ) : isLinkItem(item) ? (
                          <LinkIcon className="w-4 h-4 text-white/50" />
                        ) : (
                          <FolderIcon
                            className="w-5 h-5"
                            style={{ color: (item as FolderItem).color }}
                          />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-white truncate">{item.name}</span>
                        {isLinkItem(item) && (
                          <span className="text-xs text-white/40 truncate">{item.url}</span>
                        )}
                      </div>

                      {/* Typ-Badge */}
                      <span className="ml-auto text-[10px] text-white/30 shrink-0">
                        {isLinkItem(item) ? 'Link' : 'Ordner'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Keine Ergebnisse */}
            {query && results.length === 0 && (
              <div className="py-10 text-center text-white/30 text-sm">
                Keine Ergebnisse für „{query}"
              </div>
            )}

            {/* Footer mit Tastaturhinweisen */}
            <div className="px-4 py-2 border-t border-white/10 flex gap-4 text-[10px] text-white/25">
              <span><kbd className="bg-white/10 px-1 rounded">↑↓</kbd> Navigieren</span>
              <span><kbd className="bg-white/10 px-1 rounded">Enter</kbd> Öffnen</span>
              <span><kbd className="bg-white/10 px-1 rounded">Esc</kbd> Schließen</span>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
```

### 3. Tastaturkürzel global registrieren

In `App.tsx` oder `DesktopCanvas.tsx`:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      setIsSearchOpen(prev => !prev)
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

### 4. Taskbar und Spotlight verbinden

In `DesktopCanvas.tsx`:

```tsx
const [isSearchOpen, setIsSearchOpen] = useState(false)

// Taskbar:
<Taskbar
  onSettingsClick={...}
  onSearchClick={() => setIsSearchOpen(true)}
/>

// Spotlight:
<SpotlightSearch
  isOpen={isSearchOpen}
  onClose={() => setIsSearchOpen(false)}
  items={defaultItems}  // Task 6.1: aus Store
  onOpenFolder={id => console.log('Ordner öffnen:', id)}
/>
```

---

## ✅ Akzeptanzkriterien

- [ ] `Strg+K` / `Cmd+K` öffnet die Suche
- [ ] Spotlight-Panel erscheint zentriert mit Framer-Motion-Animation
- [ ] Suchergebnisse filtern in Echtzeit nach Name, URL und Beschreibung
- [ ] Tastaturnavigation mit `↑` / `↓` / `Enter` funktioniert
- [ ] Klick/Enter auf einen Link öffnet ihn in einem neuen Tab
- [ ] Klick/Enter auf einen Ordner öffnet das FolderWindow
- [ ] `Escape` oder Klick auf den Backdrop schließt die Suche
- [ ] „Keine Ergebnisse"-Zustand wird angezeigt
- [ ] Suchleiste in der Taskbar öffnet das Spotlight
- [ ] `npm run lint` meldet keine Fehler

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Zweck |
|---|---|
| `framer-motion` | Spotlight-Animation |
| `@heroicons/react` | `MagnifyingGlassIcon`, `LinkIcon`, `FolderIcon`, `XMarkIcon` |
| `react-dom` | `createPortal` |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 2.2 (Taskbar – SearchBar-Slot), Task 3.1 (Datenmodell + Type-Guards), Task 3.4 (FolderWindow öffnen)
- **Voraussetzung für:** Task 6.1 (Store – echte Items statt Demo-Daten), Task 7.3 (Accessibility-Audit)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(search): Task 3.10 - Spotlight-Suche mit Tastaturnavigation implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 3.10 auf `✅ Erledigt` setzen.

