# Task 3.7 – `AddFolderModal` Komponente

> **Epic:** EPIC 3 – Icon & Ordner-System  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Ein Modal implementieren, über das der Nutzer einen neuen Ordner anlegen kann. Das Formular enthält Felder für Name, eine Farbauswahl aus einer vordefinierten Palette sowie ein optionales Emoji. Eine Live-Vorschau zeigt das `FolderIcon` mit den aktuell gewählten Einstellungen.

---

## 📋 Aufgaben

### 1. `src/components/ui/ColorPicker.tsx` implementieren

```tsx
// src/components/ui/ColorPicker.tsx
interface ColorPickerProps {
  colors: string[]
  value: string
  onChange: (color: string) => void
  label?: string
}

export default function ColorPicker({ colors, value, onChange, label }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-white/80">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {colors.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded-full transition-all
                        ${value === color
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110'
                          : 'hover:scale-110'
                        }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}
```

### 2. `src/components/modals/AddFolderModal.tsx` implementieren

```tsx
// src/components/modals/AddFolderModal.tsx
import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ColorPicker from '../ui/ColorPicker'
import { FolderIcon as HeroFolderIcon } from '@heroicons/react/24/solid'
import { folderColors } from '../../utils/defaultData'
import type { FolderItem } from '../../types'

interface AddFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (folder: Omit<FolderItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  defaultPosition?: { col: number; row: number }
}

interface FormState {
  name: string
  color: string
  emoji: string
}

interface FormErrors {
  name?: string
}

export default function AddFolderModal({
  isOpen,
  onClose,
  onAdd,
  defaultPosition = { col: 0, row: 0 },
}: AddFolderModalProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    color: folderColors[0],   // Standard: Indigo
    emoji: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Formular beim Öffnen zurücksetzen
  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', color: folderColors[0], emoji: '' })
      setErrors({})
    }
  }, [isOpen])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name ist erforderlich'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onAdd({
      type: 'folder',
      name: form.name.trim(),
      color: form.color,
      emoji: form.emoji.trim() || undefined,
      isOpen: false,
      position: defaultPosition,
      parentId: null,
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Neuen Ordner erstellen" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Live-Vorschau */}
        <div className="flex justify-center py-2">
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center
                         border border-white/20"
              style={{ backgroundColor: `${form.color}33` }}
            >
              {form.emoji ? (
                <span className="text-4xl leading-none">{form.emoji}</span>
              ) : (
                <HeroFolderIcon className="w-10 h-10" style={{ color: form.color }} />
              )}
            </div>
            <span className="text-xs text-white/50">Vorschau</span>
          </div>
        </div>

        {/* Name */}
        <Input
          label="Name"
          placeholder="z. B. Entwicklung"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          maxLength={30}
          autoFocus
        />

        {/* Farbauswahl */}
        <ColorPicker
          label="Farbe"
          colors={folderColors}
          value={form.color}
          onChange={color => setForm(prev => ({ ...prev, color }))}
        />

        {/* Emoji (optional) */}
        <Input
          label="Emoji (optional)"
          placeholder="z. B. 🚀 💻 📁"
          value={form.emoji}
          onChange={e => setForm(prev => ({ ...prev, emoji: e.target.value }))}
          maxLength={2}
        />

        {/* Buttons */}
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button type="submit" variant="primary">
            Erstellen
          </Button>
        </div>
      </form>
    </Modal>
  )
}
```

### 3. Modal über das Kontextmenü öffnen

In `DesktopCanvas.tsx` das Modal verdrahten:

```tsx
const [isAddFolderOpen, setIsAddFolderOpen] = useState(false)

// Im Kontextmenü-Item:
{
  label: 'Neuer Ordner',
  icon: <FolderPlusIcon />,
  onClick: () => setIsAddFolderOpen(true),
}

// Im JSX:
<AddFolderModal
  isOpen={isAddFolderOpen}
  onClose={() => setIsAddFolderOpen(false)}
  onAdd={folder => console.log('Ordner hinzufügen:', folder)} // Task 6.1
/>
```

---

## ✅ Akzeptanzkriterien

- [ ] Modal öffnet sich über das Desktop-Kontextmenü
- [ ] Live-Vorschau aktualisiert sich bei jeder Änderung (Farbe, Emoji, Name)
- [ ] Alle 10 Standardfarben sind in der `ColorPicker`-Komponente auswählbar
- [ ] Ausgewählte Farbe ist mit Ring-Highlight hervorgehoben
- [ ] Emoji-Feld ist optional – ohne Emoji wird `HeroFolderIcon` angezeigt
- [ ] Name-Validierung zeigt Fehlermeldung bei leerem Feld
- [ ] Formular wird beim erneuten Öffnen zurückgesetzt
- [ ] `ColorPicker`-Komponente ist wiederverwendbar (wird auch in Task 3.8 genutzt)
- [ ] `npm run lint` meldet keine Fehler

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Zweck |
|---|---|
| `@heroicons/react/24/solid` | `FolderIcon` für Live-Vorschau |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 2.3 (ContextMenu), Task 2.7 (Modal, Button, Input), Task 3.1 (Datenmodell), Task 3.3 (FolderIcon für Vorschau-Logik)
- **Voraussetzung für:** Task 3.8 (EditItemModal – `ColorPicker` wiederverwenden), Task 6.1 (Store – `addFolder` Action verdrahten)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(modals): Task 3.7 - AddFolderModal mit ColorPicker und Live-Vorschau implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 3.7 auf `✅ Erledigt` setzen.

