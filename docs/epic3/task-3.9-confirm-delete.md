# Task 3.9 – Löschen mit Bestätigung

> **Epic:** EPIC 3 – Icon & Ordner-System  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Einen Bestätigungs-Dialog (`ConfirmModal`) implementieren, der vor dem Löschen eines Items erscheint. Das Modal zeigt den Namen des zu löschenden Items und warnt bei Ordnern, dass alle enthaltenen Links ebenfalls gelöscht werden. Der Lösch-Button ist rot hervorgehoben, um die destruktive Aktion zu kennzeichnen.

---

## 📋 Aufgaben

### 1. `src/components/modals/ConfirmModal.tsx` implementieren

```tsx
// src/components/modals/ConfirmModal.tsx
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  isDangerous?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Bestätigen',
  isDangerous = false,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" showCloseButton={false}>
      <div className="flex flex-col gap-4">

        {/* Icon + Nachricht */}
        <div className="flex gap-3 items-start">
          {isDangerous && (
            <div className="shrink-0 w-10 h-10 rounded-full bg-red-500/20
                            flex items-center justify-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            </div>
          )}
          <p className="text-sm text-white/70 leading-relaxed pt-1.5">
            {message}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end pt-1">
          <Button variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
```

### 2. Lösch-Logik in `DesktopCanvas.tsx` verdrahten

```tsx
const [confirmState, setConfirmState] = useState<{
  isOpen: boolean
  itemId: string | null
  itemName: string
  isFolder: boolean
} | null>(null)

// Im Kontextmenü – Löschen-Item:
{
  label: 'Löschen',
  icon: <TrashIcon />,
  danger: true,
  onClick: () => {
    const item = items.find(i => i.id === targetId)
    if (!item) return
    setConfirmState({
      isOpen: true,
      itemId: item.id,
      itemName: item.name,
      isFolder: item.type === 'folder',
    })
  },
}

// Anzahl der enthaltenen Items ermitteln (für Warntext):
const getChildCount = (folderId: string) =>
  items.filter(item => item.parentId === folderId).length

// Im JSX:
<ConfirmModal
  isOpen={confirmState?.isOpen ?? false}
  onClose={() => setConfirmState(null)}
  onConfirm={() => {
    if (confirmState?.itemId) {
      console.log('Löschen:', confirmState.itemId) // Task 6.1
    }
  }}
  title={`„${confirmState?.itemName}" löschen?`}
  message={
    confirmState?.isFolder
      ? `Der Ordner „${confirmState.itemName}" und alle ${getChildCount(confirmState.itemId ?? '')} enthaltenen Elemente werden unwiderruflich gelöscht.`
      : `Der Link „${confirmState?.itemName}" wird unwiderruflich gelöscht.`
  }
  confirmLabel="Löschen"
  isDangerous={true}
/>
```

### 3. Kaskadierende Löschung vorbereiten

Wenn ein Ordner gelöscht wird, müssen auch alle enthaltenen Items gelöscht werden. Dies passiert in der `deleteItem`-Action im Store (Task 6.1):

```typescript
// Pseudocode für den Store (Task 6.1):
deleteItem: (id) => {
  set(state => ({
    items: state.items.filter(
      item => item.id !== id && item.parentId !== id
      // Kaskade: alle direkten Kinder des Ordners ebenfalls entfernen
    )
  }))
}
```

> **Hinweis:** Verschachtelte Ordner (Ordner in Ordnern) sind laut Architektur nicht vorgesehen. Die Kaskade geht daher nur eine Ebene tief.

---

## ✅ Akzeptanzkriterien

- [ ] Rechtsklick auf ein Icon → „Löschen" öffnet den Bestätigungs-Dialog
- [ ] Dialog zeigt den Namen des zu löschenden Items
- [ ] Bei Ordnern wird die Anzahl der enthaltenen Elemente in der Warnmeldung angezeigt
- [ ] Lösch-Button ist rot hervorgehoben (`variant="danger"`)
- [ ] Warnsymbol (`ExclamationTriangleIcon`) ist sichtbar
- [ ] „Abbrechen" schließt den Dialog ohne Aktion
- [ ] `ConfirmModal` ist generisch und wiederverwendbar (z. B. für Reset in Task 6.6)
- [ ] `npm run lint` meldet keine Fehler

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Zweck |
|---|---|
| `@heroicons/react` | `ExclamationTriangleIcon`, `TrashIcon` |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 2.3 (ContextMenu), Task 2.7 (Modal, Button)
- **Voraussetzung für:** Task 6.1 (Store – `deleteItem` mit Kaskade), Task 6.6 (Reset – `ConfirmModal` wiederverwenden)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(modals): Task 3.9 - ConfirmModal fuer Loeschbestaetigung implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 3.9 auf `✅ Erledigt` setzen.

