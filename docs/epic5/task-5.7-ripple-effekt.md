# Task 5.7 – Ripple-Effekt auf Buttons

> **Epic:** EPIC 5 – Animationen & Visuelles Polish  
> **Priorität:** 🟢 Niedrig  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Alle interaktiven Buttons in der App sollen beim Klicken einen Ripple-Effekt erhalten – ähnlich wie Material Design. Der Ripple startet an der Klick-Position und breitet sich kreisförmig aus. Dies gibt jedem Klick ein greifbares visuelles Feedback und wertet die App optisch auf.

---

## 📋 Aufgaben

### 1. `useRipple` Custom Hook implementieren

```typescript
// src/hooks/useRipple.ts
import { useCallback, useRef, useState } from 'react'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)

  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()

    const size = Math.max(rect.width, rect.height) * 2
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const id = nextId.current++
    setRipples((prev) => [...prev, { id, x, y, size }])

    // Ripple nach Animation entfernen
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }, [])

  return { ripples, createRipple }
}
```

### 2. `Button` Komponente mit Ripple-Effekt implementieren

```tsx
// src/components/ui/Button.tsx
import { useRipple } from '../../hooks/useRipple'
import { useReducedMotion } from 'framer-motion'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400',
  secondary:
    'border border-white/20 text-slate-200 hover:bg-white/8 hover:border-white/30',
  ghost:
    'text-slate-400 hover:text-slate-200 hover:bg-white/5',
  danger:
    'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className = '',
  ...props
}: ButtonProps) {
  const { ripples, createRipple } = useRipple()
  const shouldReduceMotion = useReducedMotion()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!shouldReduceMotion) createRipple(e)
    onClick?.(e)
  }

  return (
    <button
      className={`
        relative overflow-hidden rounded-lg font-medium
        transition-all duration-150 select-none
        focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2
        active:scale-95
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple-Effekte */}
      {!shouldReduceMotion && ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/20 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {/* Button-Inhalt */}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
```

### 3. Ripple CSS-Animation in `index.css` definieren

```css
/* src/index.css */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.4;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

Oder alternativ über Tailwind `extend.animation`:

```typescript
// tailwind.config.ts
extend: {
  animation: {
    ripple: 'ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  },
  keyframes: {
    ripple: {
      '0%': { transform: 'scale(0)', opacity: '0.4' },
      '100%': { transform: 'scale(1)', opacity: '0' },
    },
  },
}
```

### 4. Bestehende Buttons auf neue `Button`-Komponente umstellen

Alle manuell gesetzten `<button>` Elemente in Modals und UI-Bereichen durch die neue `Button`-Komponente ersetzen:

- `AddLinkModal`: Speichern- und Abbrechen-Button
- `AddFolderModal`: Speichern- und Abbrechen-Button
- `EditItemModal`: Speichern- und Abbrechen-Button
- `ConfirmModal`: Bestätigen (danger) und Abbrechen-Button
- `SettingsModal`: Schließen-Button und Aktions-Buttons

### 5. Context Menu Items mit Hover-Feedback

Context Menu Einträge sind keine Buttons, aber brauchen ebenfalls Hover-Feedback (kein Ripple, aber Highlight):

```tsx
// src/components/ui/ContextMenu.tsx
<button
  className="
    w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200
    hover:bg-white/8 rounded-md transition-colors duration-100
    [&.danger]:text-red-400 [&.danger]:hover:bg-red-500/10
  "
>
  <Icon className="w-4 h-4" />
  {label}
</button>
```

---

## ✅ Akzeptanzkriterien

- [ ] Ripple startet exakt an der Klick-Position auf dem Button
- [ ] Ripple breitet sich kreisförmig aus und wird dabei transparent (600ms)
- [ ] `Button`-Komponente unterstützt Varianten: `primary`, `secondary`, `ghost`, `danger`
- [ ] `Button`-Komponente unterstützt Größen: `sm`, `md`, `lg`
- [ ] Primary-Button hat Gradient (Indigo → Violet) gemäß `design-plan.md`
- [ ] `prefers-reduced-motion`: Ripple wird nicht angezeigt
- [ ] Keyboard-Fokus-Styles sind sichtbar (Outline in Accent-Farbe)
- [ ] Bestehende Buttons in allen Modals nutzen die neue `Button`-Komponente
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.2 (Tailwind CSS konfiguriert)
- **Voraussetzung:** Task 2.7 (Modal-Komponente vorhanden, nutzt Buttons)
- **Voraussetzung:** Task 3.6 / 3.7 / 3.8 / 3.9 (Modals mit Buttons vorhanden)
- **Ergänzt:** Task 5.4 (Modal-Animationen + Ripple auf Buttons = poliertes Ergebnis)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(ui): Task 5.7 - Ripple-Effekt auf Buttons und Button-Komponente"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 5.7 auf `✅ Erledigt` setzen.

