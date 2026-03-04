# Task 2.7 – `Modal` Basiskomponente

> **Epic:** EPIC 2 – Core UI & Desktop-Layout  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Eine wiederverwendbare `Modal`-Basiskomponente implementieren, die von allen spezifischen Modals (AddLink, AddFolder, Edit, Confirm, Settings) genutzt wird. Das Modal nutzt Headless UI's `Dialog` für vollständige Accessibility (ARIA, Fokus-Trap, Keyboard-Navigation) und Framer Motion für die Ein-/Ausblend-Animation.

---

## 📋 Aufgaben

### 1. `src/components/ui/Modal.tsx` implementieren

```tsx
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  showCloseButton?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

// Framer Motion Varianten für das Modal
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10 },
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static open={isOpen} onClose={onClose} className="relative z-[9998]">

          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          />

          {/* Zentrierter Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]}
                            bg-gray-800/95 backdrop-blur-md
                            border border-white/10 rounded-2xl shadow-2xl
                            text-white`}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
                  <Dialog.Title className="text-lg font-semibold">
                    {title}
                  </Dialog.Title>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Inhalt */}
                <div className="px-6 py-5">
                  {children}
                </div>
              </Dialog.Panel>
            </motion.div>
          </div>

        </Dialog>
      )}
    </AnimatePresence>
  )
}
```

### 2. `src/components/ui/Button.tsx` implementieren

Wird von allen Modals verwendet:

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variantClasses = {
  primary:   'bg-indigo-600 hover:bg-indigo-500 text-white',
  secondary: 'bg-white/10 hover:bg-white/20 text-white',
  danger:    'bg-red-600/80 hover:bg-red-500 text-white',
  ghost:     'hover:bg-white/10 text-white/70 hover:text-white',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2
                  rounded-lg font-medium transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

### 3. `src/components/ui/Input.tsx` implementieren

Wird in den Formular-Modals (AddLink, AddFolder, Edit) verwendet:

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 rounded-lg text-sm
                    bg-white/10 border border-white/20
                    text-white placeholder-white/40
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition-colors
                    ${error ? 'border-red-500' : ''}
                    ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
```

### 4. Smoke Test – Modal in `App.tsx` testen

```tsx
import { useState } from 'react'
import Modal from './components/ui/Modal'
import Button from './components/ui/Button'
import DesktopCanvas from './components/desktop/DesktopCanvas'

function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <DesktopCanvas />
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Modal testen
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Test-Modal">
        <p className="text-white/70 mb-4">Das Modal funktioniert korrekt.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Abbrechen</Button>
          <Button variant="primary" onClick={() => setIsOpen(false)}>OK</Button>
        </div>
      </Modal>
    </>
  )
}
```

Nach erfolgreichem Test den Smoke-Test-Code wieder entfernen.

---

## ✅ Akzeptanzkriterien

- [ ] Modal öffnet sich mit Fade + Scale-Animation
- [ ] Modal schließt sich mit Ausblendeanimation (`AnimatePresence`)
- [ ] Backdrop ist halb-transparent mit Blur-Effekt
- [ ] Klick auf Backdrop schließt das Modal
- [ ] `Escape`-Taste schließt das Modal
- [ ] Fokus wird beim Öffnen korrekt ins Modal gesetzt (Headless UI Fokus-Trap)
- [ ] `XMarkIcon`-Button schließt das Modal
- [ ] `Button`-Komponente rendert alle vier Varianten korrekt
- [ ] `Input`-Komponente zeigt Label, Fehler-State und Focus-Ring
- [ ] `npm run lint` meldet keine Fehler

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Zweck |
|---|---|
| `@headlessui/react` | `Dialog` für Accessibility & Fokus-Trap |
| `framer-motion` | `AnimatePresence` + `motion.div` für Animationen |
| `@heroicons/react` | `XMarkIcon` für Schließen-Button |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.4 (Framer Motion), Task 1.6 (Headless UI, Heroicons), Task 2.1 (DesktopCanvas)
- **Voraussetzung für:** Task 3.6 (AddLinkModal), Task 3.7 (AddFolderModal), Task 3.8 (EditItemModal), Task 3.9 (ConfirmModal), Task 6.x (SettingsModal)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(ui): Task 2.7 - Modal Basiskomponente, Button und Input implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 2.7 auf `✅ Erledigt` setzen.

