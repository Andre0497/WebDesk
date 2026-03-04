# Task 5.1 – Einblend-Animationen für Icons

> **Epic:** EPIC 5 – Animationen & Visuelles Polish  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Beim Laden der App sollen alle Desktop-Icons in einem gestaffelten Fade-in-Effekt (Stagger) erscheinen – von links nach rechts, mit einem Delay von ca. 60 ms pro Icon. Das gibt dem Desktop ein lebendiges, hochwertiges Gefühl wie bei macOS oder modernen Web-Apps.

---

## 📋 Aufgaben

### 1. Framer Motion Variants für das Desktop-Grid definieren

In `src/components/desktop/DesktopGrid.tsx` (oder einer zentralen Animation-Datei unter `src/utils/animations.ts`) folgende Variants anlegen:

```typescript
// src/utils/animations.ts
import type { Variants } from 'framer-motion'

export const desktopGridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06, // 60ms Delay pro Icon
      delayChildren: 0.1,    // kurze Verzögerung nach App-Start
    },
  },
}

export const iconEnterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
}
```

### 2. `DesktopGrid` als `motion.div` wrappen

```tsx
// src/components/desktop/DesktopGrid.tsx
import { motion } from 'framer-motion'
import { desktopGridVariants, iconEnterVariants } from '../../utils/animations'

export function DesktopGrid({ items }: DesktopGridProps) {
  return (
    <motion.div
      className="grid ..."
      variants={desktopGridVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={iconEnterVariants}>
          {item.type === 'link' ? (
            <LinkIcon item={item} />
          ) : (
            <FolderIcon item={item} />
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

### 3. `prefers-reduced-motion` respektieren

Gemäß `design-plan.md` und a11y-Anforderungen:

```tsx
import { useReducedMotion } from 'framer-motion'

export function DesktopGrid({ items }: DesktopGridProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : desktopGridVariants}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      ...
    >
      ...
    </motion.div>
  )
}
```

### 4. Nur beim initialen Mount animieren

Das Grid soll nur beim ersten Rendern animieren, nicht bei jedem State-Update (z. B. wenn ein neues Icon hinzugefügt wird). Neue Icons sollen einzeln erscheinen:

```tsx
// Neues Icon beim Hinzufügen separat animieren
<motion.div
  key={item.id}
  variants={iconEnterVariants}
  // Für neue Items: direkt initial + animate setzen
  initial="hidden"
  animate="visible"
  layout // Layout-Animation bei Repositionierung
>
```

### 5. Visuelle Verifikation

- `npm run dev` starten
- Desktop laden: Icons erscheinen in einem wellenartigen Fade-in von links nach rechts
- Kein Flackern, kein Layout-Shift
- Bei `prefers-reduced-motion: reduce` (im OS oder DevTools) → Icons erscheinen sofort

---

## ✅ Akzeptanzkriterien

- [ ] Icons werden beim App-Start gestaffelt eingeblendet (60 ms Stagger)
- [ ] Animation nutzt Framer Motion `variants` + `staggerChildren`
- [ ] Jedes Icon: `opacity: 0 → 1` + leichtes `y: 16 → 0` + `scale: 0.92 → 1`
- [ ] `prefers-reduced-motion` wird respektiert (Animationen deaktivierbar)
- [ ] Neue Icons, die nach dem initialen Mount hinzugefügt werden, erscheinen einzeln animiert
- [ ] Keine Performance-Einbußen (keine Layout-Thrashing)
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.4 (Framer Motion installiert)
- **Voraussetzung:** Task 2.5 (Desktop-Grid vorhanden)
- **Voraussetzung:** Task 3.2 / 3.3 (`LinkIcon` & `FolderIcon` vorhanden)
- **Voraussetzung für:** Task 5.3 (Icon Hover & Click Animationen)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(animations): Task 5.1 - Staggered Einblend-Animationen fuer Desktop-Icons"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 5.1 auf `✅ Erledigt` setzen.

