# Task 5.2 – Ordner Öffnen/Schließen Animation

> **Epic:** EPIC 5 – Animationen & Visuelles Polish  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Das `FolderWindow` soll beim Öffnen und Schließen eine flüssige Scale-/Slide-Animation erhalten. Das Fenster soll vom Ort des angeklickten Ordner-Icons „aufspringen" und beim Schließen dorthin zurückschrumpfen (Origin: Icon-Position). Das schafft räumliche Kohärenz und ein hochwertiges macOS/iOS-ähnliches Gefühl.

---

## 📋 Aufgaben

### 1. Animation Variants für `FolderWindow` definieren

```typescript
// src/utils/animations.ts (ergänzen)
export const folderWindowVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
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
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 10,
    transition: {
      duration: 0.18,
      ease: 'easeIn',
    },
  },
}
```

### 2. `FolderWindow` mit `AnimatePresence` wrappen

```tsx
// src/components/desktop/DesktopCanvas.tsx
import { AnimatePresence } from 'framer-motion'

// Alle offenen FolderWindows rendern
<AnimatePresence>
  {openFolders.map((folder) => (
    <FolderWindow key={folder.id} folder={folder} />
  ))}
</AnimatePresence>
```

### 3. `FolderWindow` als `motion.div` implementieren

```tsx
// src/components/windows/FolderWindow.tsx
import { motion } from 'framer-motion'
import { folderWindowVariants } from '../../utils/animations'

export function FolderWindow({ folder }: FolderWindowProps) {
  return (
    <motion.div
      className="folder-window fixed z-50 ..."
      variants={folderWindowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        // Origin-Point: Mitte des Ordner-Icons (wenn bekannt)
        transformOrigin: 'center bottom',
      }}
    >
      <WindowTitleBar folder={folder} />
      <WindowGrid items={folderItems} />
    </motion.div>
  )
}
```

### 4. `transformOrigin` dynamisch setzen (optional, für fortgeschrittene UX)

Wenn die Position des auslösenden Ordner-Icons bekannt ist, kann `transformOrigin` dynamisch gesetzt werden:

```tsx
// Icon-Position aus dem DOM auslesen
const iconRef = useRef<HTMLDivElement>(null)

const handleOpenFolder = () => {
  if (iconRef.current) {
    const rect = iconRef.current.getBoundingClientRect()
    const originX = rect.left + rect.width / 2
    const originY = rect.top + rect.height / 2
    openFolder(folder.id, { originX, originY })
  }
}

// Im FolderWindow:
<motion.div
  style={{
    transformOrigin: `${originX}px ${originY}px`,
  }}
  ...
>
```

### 5. Minimieren-Animation (optionaler Bonus)

Bei Klick auf den Minimieren-Button soll das Fenster in die Taskbar-Mitte schrumpfen:

```tsx
const minimizeVariants: Variants = {
  minimized: {
    opacity: 0,
    scale: 0.1,
    y: '80vh',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}
```

### 6. Visuelle Verifikation

- Ordner anklicken → Fenster springt mit Federdynamik auf
- Schließen-Button (X) klicken → Fenster schrumpft sanft weg
- Mehrere Ordner öffnen und schließen → jedes animiert unabhängig

---

## ✅ Akzeptanzkriterien

- [ ] Öffnen: `scale(0.8) + opacity(0) → scale(1) + opacity(1)` mit Spring-Animation
- [ ] Schließen: `scale(1) + opacity(1) → scale(0.85) + opacity(0)` (180ms ease-in)
- [ ] `AnimatePresence` sorgt für korrekte Exit-Animation beim Unmounten
- [ ] Mehrere Fenster animieren unabhängig voneinander
- [ ] `prefers-reduced-motion` wird respektiert
- [ ] Keine Ruckler oder Layout-Jumps während der Animation
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.4 (Framer Motion installiert)
- **Voraussetzung:** Task 3.4 (`FolderWindow` Komponente vorhanden)
- **Voraussetzung für:** Task 5.5 (Glassmorphism, visuell aufeinander aufbauend)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(animations): Task 5.2 - Ordner Oeffnen/Schliessen Animation mit Framer Motion"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 5.2 auf `✅ Erledigt` setzen.

