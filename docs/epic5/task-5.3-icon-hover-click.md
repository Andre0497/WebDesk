# Task 5.3 – Icon Hover & Click Animationen

> **Epic:** EPIC 5 – Animationen & Visuelles Polish  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Desktop-Icons (`LinkIcon` und `FolderIcon`) sollen auf Hover und Click mit Framer Motion animiert reagieren. Gemäß `design-plan.md`:

- **Hover:** Scale auf 1.08, Glassmorphism-Hintergrund erscheint, leichter Glow
- **Click/Active:** Kurzes Scale auf 0.95 (Bounce-Gefühl), dann zurück zu 1.0

Das gibt der App ein lebendiges, responsives Gefühl.

---

## 📋 Aufgaben

### 1. Hover & Tap Animationen in `LinkIcon` und `FolderIcon` einbauen

```tsx
// src/components/icons/LinkIcon.tsx
import { motion } from 'framer-motion'

export function LinkIcon({ item }: LinkIconProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center cursor-pointer select-none"
      whileHover="hover"
      whileTap="tap"
      initial="rest"
      animate="rest"
      variants={iconVariants}
    >
      {/* Glassmorphism Hintergrund – erscheint nur bei Hover */}
      <motion.div
        className="absolute inset-0 rounded-icon"
        variants={iconBgVariants}
      />

      {/* Icon-Symbol */}
      <div className="relative z-10 w-12 h-12">
        <img src={item.faviconUrl} alt={item.name} className="w-full h-full" />
      </div>

      {/* Label */}
      <span className="relative z-10 mt-1 text-sm text-slate-100 truncate max-w-[88px] text-center">
        {item.name}
      </span>
    </motion.div>
  )
}
```

### 2. Icon Variants definieren

```typescript
// src/utils/animations.ts (ergänzen)
export const iconVariants: Variants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.08,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 20,
    },
  },
}

export const iconBgVariants: Variants = {
  rest: {
    opacity: 0,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  hover: {
    opacity: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)',
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
}
```

### 3. Drag-State Animation einbauen

Wenn ein Icon gerade gezogen wird, soll es eine spezielle Animation erhalten (gemäß `design-plan.md`):

```tsx
// Drag-State: wird von dnd-kit gesteuert
const { isDragging } = useDraggable({ id: item.id })

<motion.div
  animate={
    isDragging
      ? { scale: 1.1, rotate: 3, opacity: 0.85 }
      : { scale: 1, rotate: 0, opacity: 1 }
  }
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
>
```

### 4. Doppelklick-Handler für Links (öffnet URL)

```tsx
<motion.div
  onDoubleClick={() => window.open(item.url, '_blank')}
  whileTap="tap"
  ...
>
```

### 5. Glow-Effekt mit Tailwind-CSS erweitern

In `tailwind.config.ts` den glow-Shadow ergänzen (falls noch nicht aus Task 1.2 vorhanden):

```typescript
boxShadow: {
  'glow-accent': '0 0 20px rgba(99, 102, 241, 0.4)',
  'glow-sm': '0 0 10px rgba(99, 102, 241, 0.2)',
}
```

### 6. Wiederverwendbarkeit durch `IconWrapper`

Da `LinkIcon` und `FolderIcon` dieselben Animations-Variants benötigen, kann ein gemeinsamer `IconWrapper` extrahiert werden:

```tsx
// src/components/icons/IconWrapper.tsx
export function IconWrapper({ children, onDoubleClick }: IconWrapperProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="relative flex flex-col items-center p-2 rounded-icon cursor-pointer select-none"
      whileHover={shouldReduceMotion ? undefined : 'hover'}
      whileTap={shouldReduceMotion ? undefined : 'tap'}
      initial="rest"
      animate="rest"
      variants={iconVariants}
      onDoubleClick={onDoubleClick}
    >
      <motion.div
        className="absolute inset-0 rounded-icon"
        variants={iconBgVariants}
      />
      {children}
    </motion.div>
  )
}
```

---

## ✅ Akzeptanzkriterien

- [ ] Hover auf Icon: Scale 1→1.08 (Spring), Glassmorphism-BG erscheint
- [ ] Click auf Icon: kurzer Scale-Bounce 1.08→0.95→1
- [ ] Drag-State: Scale 1.1, Rotation ±3°, Opacity 0.85
- [ ] Glassmorphism-BG entspricht `design-plan.md` (rgba(255,255,255,0.08), border, blur)
- [ ] Sowohl `LinkIcon` als auch `FolderIcon` nutzen dieselben Animations-Variants
- [ ] `prefers-reduced-motion` wird respektiert
- [ ] Doppelklick auf `LinkIcon` öffnet die URL in einem neuen Tab
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.4 (Framer Motion installiert)
- **Voraussetzung:** Task 3.2 (`LinkIcon` Komponente vorhanden)
- **Voraussetzung:** Task 3.3 (`FolderIcon` Komponente vorhanden)
- **Voraussetzung für:** Task 5.1 (Stagger-Animationen bauen darauf auf)
- **Voraussetzung für:** Task 4.2 (Draggable Icons nutzen Drag-State)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(animations): Task 5.3 - Icon Hover und Click Animationen"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 5.3 auf `✅ Erledigt` setzen.

