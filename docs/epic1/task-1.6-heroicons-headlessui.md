# Task 1.6 – Heroicons & Headless UI installieren

> **Epic:** EPIC 1 – Projekt-Setup & Infrastruktur  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Heroicons und Headless UI installieren. Heroicons liefert ein konsistentes SVG-Icon-Set direkt als React-Komponenten. Headless UI stellt unstyled, vollständig accessible Basis-Komponenten bereit (Dialog, Menu, Transition), die mit Tailwind CSS gestylt werden.

---

## 📋 Aufgaben

### 1. Pakete installieren

```bash
npm install @heroicons/react @headlessui/react
```

| Paket | Version | Zweck |
|---|---|---|
| `@heroicons/react` | ^2.x | SVG-Icon-Set als React-Komponenten |
| `@headlessui/react` | ^2.x | Accessible Basis-Komponenten (Dialog, Menu, Transition) |

### 2. Heroicons – Smoke Test

Prüfen, ob Icons korrekt importiert und gerendert werden:

```tsx
import { FolderIcon, LinkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

function App() {
  return (
    <div className="flex gap-4 items-center justify-center h-screen bg-gray-900 text-white">
      <FolderIcon className="w-10 h-10 text-blue-400" />
      <LinkIcon className="w-10 h-10 text-green-400" />
      <Cog6ToothIcon className="w-10 h-10 text-gray-400" />
    </div>
  )
}
```

> **Tipp:** Heroicons bietet zwei Varianten:
> - `@heroicons/react/24/outline` – Umriss-Icons (Standard für WebDesk)
> - `@heroicons/react/24/solid` – Ausgefüllte Icons (für aktive Zustände)

### 3. Headless UI – Smoke Test

Prüfen, ob ein Dialog korrekt eingebunden werden kann:

```tsx
import { Dialog } from '@headlessui/react'
import { useState } from 'react'

function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Modal öffnen
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-gray-800 text-white rounded-xl p-6">
            <Dialog.Title className="text-lg font-bold">Test-Modal</Dialog.Title>
            <button onClick={() => setIsOpen(false)} className="mt-4 text-sm text-gray-400">
              Schließen
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
```

### 4. Smoke Tests wieder entfernen

Nach dem Verifizieren die Test-Implementierungen aus `App.tsx` entfernen und zur minimalen Platzhalter-Komponente zurückkehren.

---

## 🧩 Verwendung in WebDesk (Vorschau)

| Komponente | Icon / UI-Element |
|---|---|
| `FolderIcon.tsx` | `FolderIcon` aus Heroicons |
| `LinkIcon.tsx` | `LinkIcon`, `GlobeAltIcon` |
| `Taskbar.tsx` | `Cog6ToothIcon`, `MagnifyingGlassIcon` |
| `ContextMenu.tsx` | `PlusIcon`, `TrashIcon`, `PencilIcon` |
| `Modal.tsx` | `Dialog` aus Headless UI |
| `ContextMenu` | `Menu` aus Headless UI |

---

## ✅ Akzeptanzkriterien

- [ ] `npm install` läuft ohne Fehler durch
- [ ] Beide Pakete erscheinen in `package.json` unter `dependencies`
- [ ] Heroicons werden korrekt als SVG im Browser gerendert
- [ ] Headless UI `Dialog` öffnet und schließt korrekt
- [ ] Keine TypeScript-Fehler beim Import
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Version | Typ |
|---|---|---|
| `@heroicons/react` | ^2.x | dependency |
| `@headlessui/react` | ^2.x | dependency |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.1 und 1.2 (Tailwind) müssen abgeschlossen sein
- **Voraussetzung für:** Task 2.2 (Taskbar), 2.3 (ContextMenu), 2.7 (Modal), EPIC 3 (Icons)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(setup): Task 1.6 - Heroicons und Headless UI installieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 1.6 auf `✅ Erledigt` setzen.

