# Task 3.6 – `AddLinkModal` Komponente

> **Epic:** EPIC 3 – Icon & Ordner-System  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Ein Modal implementieren, über das der Nutzer einen neuen Web-Link anlegen kann. Das Formular enthält Felder für URL, Name und optionale Beschreibung sowie eine Live-Favicon-Vorschau. Der Name wird automatisch aus der URL vorgeschlagen. Bei Bestätigung wird der Link über den Store gespeichert.

---

## 📋 Aufgaben

### 1. `src/components/modals/AddLinkModal.tsx` implementieren

```tsx
// src/components/modals/AddLinkModal.tsx
import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { useFavicon } from '../../hooks/useFavicon'
import { normalizeUrl, isValidUrl, extractHostname } from '../../utils/urlParser'
import { getFaviconUrl } from '../../utils/favicon'
import type { LinkItem } from '../../types'

interface AddLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (link: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  defaultPosition?: { col: number; row: number }
  defaultParentId?: string | null
}

interface FormState {
  url: string
  name: string
  description: string
}

interface FormErrors {
  url?: string
  name?: string
}

export default function AddLinkModal({
  isOpen,
  onClose,
  onAdd,
  defaultPosition = { col: 0, row: 0 },
  defaultParentId = null,
}: AddLinkModalProps) {
  const [form, setForm] = useState<FormState>({ url: '', name: '', description: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const { faviconUrl, isLoading: faviconLoading } = useFavicon(form.url)

  // Name automatisch aus Hostname vorschlagen
  useEffect(() => {
    if (form.url && !form.name && isValidUrl(form.url)) {
      const hostname = extractHostname(form.url)
        .replace(/^www\./, '')
        .split('.')[0]
      setForm(prev => ({
        ...prev,
        name: hostname.charAt(0).toUpperCase() + hostname.slice(1),
      }))
    }
  }, [form.url])

  // Formular zurücksetzen beim Öffnen
  useEffect(() => {
    if (isOpen) {
      setForm({ url: '', name: '', description: '' })
      setErrors({})
    }
  }, [isOpen])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.url.trim()) {
      newErrors.url = 'URL ist erforderlich'
    } else if (!isValidUrl(form.url)) {
      newErrors.url = 'Keine gültige URL'
    }
    if (!form.name.trim()) {
      newErrors.name = 'Name ist erforderlich'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onAdd({
      type: 'link',
      name: form.name.trim(),
      url: normalizeUrl(form.url),
      description: form.description.trim() || undefined,
      faviconUrl: faviconUrl ?? getFaviconUrl(form.url),
      position: defaultPosition,
      parentId: defaultParentId,
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Neuen Link hinzufügen" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* URL-Zeile mit Favicon-Vorschau */}
        <div className="flex gap-3 items-end">
          {/* Favicon-Vorschau */}
          <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20
                          flex items-center justify-center shrink-0 mb-0.5">
            {faviconLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : faviconUrl ? (
              <img
                src={faviconUrl}
                alt=""
                className="w-7 h-7 rounded object-contain"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <GlobeAltIcon className="w-5 h-5 text-white/40" />
            )}
          </div>

          <div className="flex-1">
            <Input
              label="URL"
              type="url"
              placeholder="https://beispiel.de"
              value={form.url}
              onChange={e => setForm(prev => ({ ...prev, url: e.target.value }))}
              error={errors.url}
              autoFocus
            />
          </div>
        </div>

        {/* Name */}
        <Input
          label="Name"
          placeholder="z. B. GitHub"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          maxLength={40}
        />

        {/* Beschreibung (optional) */}
        <Input
          label="Beschreibung (optional)"
          placeholder="Kurze Notiz zum Link"
          value={form.description}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          maxLength={100}
        />

        {/* Buttons */}
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button type="submit" variant="primary">
            Hinzufügen
          </Button>
        </div>
      </form>
    </Modal>
  )
}
```

### 2. Modal über das Kontextmenü öffnen

In `DesktopCanvas.tsx` das Modal verdrahten:

```tsx
// Zustand für das Modal
const [isAddLinkOpen, setIsAddLinkOpen] = useState(false)

// Im Kontextmenü-Item:
{
  label: 'Neuer Link',
  icon: <PlusIcon />,
  onClick: () => setIsAddLinkOpen(true),
}

// Im JSX:
<AddLinkModal
  isOpen={isAddLinkOpen}
  onClose={() => setIsAddLinkOpen(false)}
  onAdd={link => console.log('Link hinzufügen:', link)} // Task 6.1
/>
```

---

## ✅ Akzeptanzkriterien

- [ ] Modal öffnet sich über das Desktop-Kontextmenü
- [ ] Favicon-Vorschau aktualisiert sich beim Eintippen der URL (mit Debounce)
- [ ] Name wird automatisch aus der URL vorgeschlagen
- [ ] URL-Validierung zeigt Fehlermeldung bei ungültiger Eingabe
- [ ] Pflichtfelder URL und Name werden validiert
- [ ] `https://` wird automatisch ergänzt, falls kein Protokoll angegeben
- [ ] Formular wird beim erneuten Öffnen zurückgesetzt
- [ ] „Abbrechen" schließt das Modal ohne Änderungen
- [ ] `Enter` in einem Formularfeld oder Klick auf „Hinzufügen" submittet das Formular
- [ ] `npm run lint` meldet keine Fehler

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Zweck |
|---|---|
| `@heroicons/react` | `GlobeAltIcon` für Favicon-Fallback |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 2.3 (ContextMenu), Task 2.7 (Modal, Button, Input), Task 3.1 (Datenmodell), Task 3.5 (Favicon-Service)
- **Voraussetzung für:** Task 6.1 (Store – `addLink` Action verdrahten)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(modals): Task 3.6 - AddLinkModal mit Favicon-Vorschau und Validierung implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 3.6 auf `✅ Erledigt` setzen.

