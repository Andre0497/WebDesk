# Task 5.4 – Modal Animationen

> **Epic:** EPIC 5 – Animationen & Visuelles Polish  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Alle Modals (`AddLinkModal`, `AddFolderModal`, `EditItemModal`, `ConfirmModal`, `SettingsModal`) sollen beim Öffnen und Schließen eine konsistente Fade + Scale Animation erhalten. Das Overlay soll separat eingeblendet werden. Die Animationen werden zentral in der `Modal` Basiskomponente (Task 2.7) definiert, sodass alle Modals automatisch davon profitieren.

---

## 📋 Aufgaben

### 1. Animation Variants für Modal und Overlay definieren

```typescript
// src/utils/animations.ts (ergänzen)
export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
}

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 28,
      mass: 0.8,
      // Overlay soll zuerst erscheinen, dann das Modal
      delay: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 8,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
}
```

### 2. `Modal` Basiskomponente (Task 2.7) mit Animationen erweitern

```tsx
// src/components/ui/Modal.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { overlayVariants, modalVariants } from '../../utils/animations'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  const shouldReduceMotion = useReducedMotion()

  const sizeClasses = {
    sm: 'w-80',
    md: 'w-[420px]',
    lg: 'w-[560px]',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        // Overlay
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
          variants={shouldReduceMotion ? undefined : overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            className={`relative ${sizeClasses[size]} rounded-modal border`}
            style={{
              background: 'rgba(18, 18, 26, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
            }}
            variants={shouldReduceMotion ? undefined : modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
                  {/* Heroicons XMarkIcon */}
                </button>
              </div>
            )}
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 3. Escape-Taste zum Schließen

Modals sollen per `Escape`-Taste schließbar sein:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }
  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown)
  }
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [isOpen, onClose])
```

### 4. Focus-Trap implementieren (a11y)

Innerhalb des Modals soll der Tab-Fokus eingeschlossen bleiben. `@headlessui/react` `Dialog` bietet dies out-of-the-box:

```tsx
// Alternative: @headlessui/react Dialog für automatischen Focus-Trap
import { Dialog } from '@headlessui/react'

// Headless UI Dialog als Basis verwenden, Framer Motion für Animationen
// über den `static` Prop und eigenes AnimatePresence-Wrapping
```

### 5. Alle bestehenden Modals prüfen

Nach der Implementierung der `Modal` Basiskomponente sicherstellen, dass:
- `AddLinkModal` → nutzt `<Modal>`
- `AddFolderModal` → nutzt `<Modal>`
- `EditItemModal` → nutzt `<Modal>`
- `ConfirmModal` → nutzt `<Modal>`
- `SettingsModal` → nutzt `<Modal>`

Alle Modals erhalten die Animationen automatisch durch die Basiskomponente.

### 6. Staggered Formular-Felder (optional)

Für ein besonders poliertes Gefühl können die Formularfelder innerhalb des Modals ebenfalls gestaffelt erscheinen:

```tsx
const formVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const fieldVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
}
```

---

## ✅ Akzeptanzkriterien

- [ ] Overlay: `opacity: 0 → 1` in 200ms beim Öffnen
- [ ] Modal Container: `scale(0.9) + opacity(0) → scale(1) + opacity(1)` mit Spring
- [ ] Exit-Animation: `scale(0.92) + opacity(0)` in 150ms
- [ ] `AnimatePresence` sorgt für Exit-Animation beim Unmounten
- [ ] `Escape`-Taste schließt das Modal mit Animation
- [ ] Click auf Overlay schließt das Modal
- [ ] Focus-Trap ist aktiv (Keyboard-Navigation bleibt im Modal)
- [ ] Alle 5 Modals nutzen die animierte `Modal` Basiskomponente
- [ ] `prefers-reduced-motion` wird respektiert
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.4 (Framer Motion installiert)
- **Voraussetzung:** Task 1.6 (Headless UI installiert, für Focus-Trap)
- **Voraussetzung:** Task 2.7 (`Modal` Basiskomponente vorhanden)
- **Voraussetzung:** Task 3.6 / 3.7 / 3.8 / 3.9 (Modale vorhanden)
- **Ergänzt:** Task 5.2 (Ordner-Animation nutzt ähnliche Variants)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(animations): Task 5.4 - Fade und Scale Animationen fuer alle Modals"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 5.4 auf `✅ Erledigt` setzen.

