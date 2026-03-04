# Task 7.2 – Komponenten-Tests

> **Epic:** EPIC 7 – Testing & Deployment  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Kritische React-Komponenten werden mit React Testing Library getestet. Nach Abschluss dieses Tasks sind die wichtigsten Interaktionen und Render-Ergebnisse automatisiert abgesichert.

---

## 📋 Aufgaben

### 1. React Testing Library installieren

```bash
npm install --save-dev @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

`src/test/setup.ts` – Jest-DOM-Matcher einbinden:

```typescript
import '@testing-library/jest-dom'
```

### 2. Zu testende Komponenten identifizieren

| Komponente | Testpriorität | Gründe |
|---|---|---|
| `TaskBar` | 🔴 Hoch | Uhrzeit, Settings-Button, Interaktion |
| `ContextMenu` | 🔴 Hoch | Erscheint bei Rechtsklick, Menüpunkte |
| `LinkIcon` | 🔴 Hoch | Render mit Props, Klick → Link öffnen |
| `FolderIcon` | 🔴 Hoch | Render, Klick → Ordner öffnen |
| `AddLinkModal` | 🟡 Mittel | Formular-Validierung, Submit |
| `AddFolderModal` | 🟡 Mittel | Formular-Validierung, Submit |
| `Modal` (Basis) | 🟡 Mittel | Öffnen/Schließen, Backdrop-Klick |
| `ConfirmDelete` | 🟡 Mittel | Bestätigen/Abbrechen |

### 3. Test-Datei-Konvention

Tests werden neben den Komponenten abgelegt:

```
src/components/
├── taskbar/
│   ├── TaskBar.tsx
│   └── TaskBar.test.tsx
├── icons/
│   ├── LinkIcon.tsx
│   ├── LinkIcon.test.tsx
│   ├── FolderIcon.tsx
│   └── FolderIcon.test.tsx
├── modals/
│   ├── AddLinkModal.tsx
│   ├── AddLinkModal.test.tsx
│   └── ...
```

### 4. Beispiel-Tests

**`src/components/icons/LinkIcon.test.tsx`:**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LinkIcon } from './LinkIcon'

describe('LinkIcon', () => {
  const defaultProps = {
    id: 'link-1',
    name: 'GitHub',
    url: 'https://github.com',
    position: { col: 1, row: 1 },
  }

  it('zeigt den Link-Namen an', () => {
    render(<LinkIcon {...defaultProps} />)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('öffnet den Link beim Doppelklick', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<LinkIcon {...defaultProps} />)
    fireEvent.dblClick(screen.getByText('GitHub'))
    expect(openSpy).toHaveBeenCalledWith('https://github.com', '_blank')
    openSpy.mockRestore()
  })

  it('zeigt Favicon-Bild mit korrekter src', () => {
    render(<LinkIcon {...defaultProps} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('github.com'))
  })
})
```

**`src/components/modals/AddLinkModal.test.tsx`:**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddLinkModal } from './AddLinkModal'

describe('AddLinkModal', () => {
  it('rendert das Formular wenn isOpen=true', () => {
    render(<AddLinkModal isOpen={true} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByLabelText(/URL/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
  })

  it('ruft onClose bei Abbrechen auf', async () => {
    const onClose = vi.fn()
    render(<AddLinkModal isOpen={true} onClose={onClose} onAdd={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /Abbrechen/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('zeigt Fehler wenn URL leer ist', async () => {
    render(<AddLinkModal isOpen={true} onClose={() => {}} onAdd={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /Hinzufügen/i }))
    expect(screen.getByText(/URL ist erforderlich/i)).toBeInTheDocument()
  })

  it('ruft onAdd mit korrekten Daten auf', async () => {
    const onAdd = vi.fn()
    render(<AddLinkModal isOpen={true} onClose={() => {}} onAdd={onAdd} />)
    await userEvent.type(screen.getByLabelText(/URL/i), 'https://example.com')
    await userEvent.type(screen.getByLabelText(/Name/i), 'Example')
    await userEvent.click(screen.getByRole('button', { name: /Hinzufügen/i }))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://example.com', name: 'Example' })
    )
  })
})
```

**`src/components/ui/Modal.test.tsx`:**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal', () => {
  it('rendert Kinder wenn isOpen=true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Modal-Inhalt</p>
      </Modal>
    )
    expect(screen.getByText('Modal-Inhalt')).toBeInTheDocument()
  })

  it('rendert nichts wenn isOpen=false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <p>Modal-Inhalt</p>
      </Modal>
    )
    expect(screen.queryByText('Modal-Inhalt')).not.toBeInTheDocument()
  })

  it('ruft onClose bei Backdrop-Klick auf', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Inhalt</p>
      </Modal>
    )
    fireEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
```

### 5. Store-Tests mit gemocktem Context

Falls Komponenten auf den globalen Store zugreifen, einen Test-Wrapper anlegen:

```typescript
// src/test/TestWrapper.tsx
import { DesktopProvider } from '../store/DesktopContext'

export const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <DesktopProvider initialState={mockDesktopState}>
    {children}
  </DesktopProvider>
)
```

---

## ✅ Akzeptanzkriterien

- [ ] `@testing-library/react` und `@testing-library/user-event` sind installiert
- [ ] `LinkIcon` rendert korrekt und Doppelklick öffnet URL
- [ ] `FolderIcon` rendert korrekt und Klick öffnet das Fenster
- [ ] `AddLinkModal` validiert leere URL und ruft `onAdd` korrekt auf
- [ ] `Modal` rendert/versteckt Kinder basierend auf `isOpen`
- [ ] `ConfirmDelete` ruft `onConfirm` bzw. `onCancel` korrekt auf
- [ ] Alle Tests laufen mit `npm test` ohne Fehler durch

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Tasks 2.7, 3.2, 3.3, 3.6, 3.9 (Komponenten müssen existieren)
- **Voraussetzung für:** Task 7.5 (Production Build testen)
- **Parallel möglich mit:** Task 7.1 (Unit Tests)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "test(components): Task 7.2 - Komponenten-Tests mit React Testing Library"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 7.2 auf `✅ Erledigt` setzen.

