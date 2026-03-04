# Task 5.6 – Wallpaper-Auswahl

> **Epic:** EPIC 5 – Animationen & Visuelles Polish  
> **Priorität:** 🟢 Niedrig  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Der Nutzer soll aus mehreren vordefinierten Hintergrundbildern wählen können. Die Auswahl soll im `SettingsModal` zugänglich sein und in `localStorage` gespeichert werden (via Zustand-Store). Neben statischen Bildern soll auch ein animierter Gradient-Hintergrund als Option verfügbar sein.

---

## 📋 Aufgaben

### 1. Wallpaper-Dateien in `public/wallpapers/` ablegen

Gemäß `architecture.md` folgende Wallpaper bereitstellen:

```
public/
└── wallpapers/
    ├── dark-space.jpg      ← Dunkler Sternenhimmel
    ├── aurora.jpg          ← Nordlichter (grün/lila)
    ├── abstract.jpg        ← Abstrakte geometrische Formen
    ├── mesh-gradient.jpg   ← Sanfter Farbverlauf (purple/blue)
    └── minimal-dark.jpg    ← Minimalistisch dunkel
```

Freie Bilder z. B. von [Unsplash](https://unsplash.com) oder [Pexels](https://pexels.com) verwenden (entsprechende Lizenz beachten). Bildgröße: 1920×1080 px, WebP-Format bevorzugt (kleinere Dateigrößen).

### 2. Wallpaper-Definitionen im Code anlegen

```typescript
// src/utils/wallpapers.ts
export interface Wallpaper {
  id: string
  name: string
  thumbnail: string        // Kleines Vorschaubild (oder identisch mit src)
  src: string              // Pfad zu public/wallpapers/
  type: 'image' | 'gradient' | 'animated'
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'animated-gradient',
    name: 'Animierter Gradient',
    thumbnail: '',           // wird als CSS-Gradient gerendert
    src: '',
    type: 'animated',
  },
  {
    id: 'dark-space',
    name: 'Dark Space',
    thumbnail: '/wallpapers/dark-space.jpg',
    src: '/wallpapers/dark-space.jpg',
    type: 'image',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    thumbnail: '/wallpapers/aurora.jpg',
    src: '/wallpapers/aurora.jpg',
    type: 'image',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    thumbnail: '/wallpapers/abstract.jpg',
    src: '/wallpapers/abstract.jpg',
    type: 'image',
  },
  {
    id: 'mesh-gradient',
    name: 'Mesh Gradient',
    thumbnail: '/wallpapers/mesh-gradient.jpg',
    src: '/wallpapers/mesh-gradient.jpg',
    type: 'image',
  },
]

export const DEFAULT_WALLPAPER_ID = 'animated-gradient'
```

### 3. Zustand-Store um Wallpaper-Setting erweitern

```typescript
// src/store/desktopStore.ts (ergänzen)
interface DesktopState {
  settings: {
    wallpaper: string  // Wallpaper-ID (z. B. 'dark-space')
    // ...weitere Settings
  }
  // Actions
  setWallpaper: (id: string) => void
}

// Implementierung:
setWallpaper: (id) => set((state) => ({
  settings: { ...state.settings, wallpaper: id }
}))
```

### 4. `AnimatedBackground` Komponente für dynamisches Wallpaper-Rendering

```tsx
// src/components/desktop/AnimatedBackground.tsx
import { WALLPAPERS } from '../../utils/wallpapers'
import { useDesktopStore } from '../../store/desktopStore'
import { AnimatedGradient } from './AnimatedGradient'

export function AnimatedBackground() {
  const wallpaperId = useDesktopStore((s) => s.settings.wallpaper)
  const wallpaper = WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0]

  if (wallpaper.type === 'animated') {
    return <AnimatedGradient />
  }

  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${wallpaper.src})` }}
    />
  )
}
```

### 5. Animierter Gradient-Hintergrund (Standard-Wallpaper)

```tsx
// src/components/desktop/AnimatedGradient.tsx
import { motion } from 'framer-motion'

export function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Blob 1 – Indigo */}
      <motion.div
        className="absolute rounded-full opacity-20 blur-3xl"
        style={{
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          top: '-20%',
          left: '-10%',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Blob 2 – Violet */}
      <motion.div
        className="absolute rounded-full opacity-15 blur-3xl"
        style={{
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          bottom: '-10%',
          right: '-10%',
        }}
        animate={{
          x: [0, -40, 20, 0],
          y: [0, -30, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
```

### 6. Wallpaper-Auswahl im `SettingsModal` implementieren

```tsx
// src/components/modals/SettingsModal.tsx (Auszug)
import { WALLPAPERS } from '../../utils/wallpapers'
import { useDesktopStore } from '../../store/desktopStore'

function WallpaperPicker() {
  const { settings, setWallpaper } = useDesktopStore()

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-3">Hintergrund</h3>
      <div className="grid grid-cols-3 gap-2">
        {WALLPAPERS.map((wallpaper) => (
          <button
            key={wallpaper.id}
            onClick={() => setWallpaper(wallpaper.id)}
            className={`
              relative rounded-lg overflow-hidden aspect-video border-2 transition-all
              ${settings.wallpaper === wallpaper.id
                ? 'border-indigo-500 shadow-glow'
                : 'border-transparent hover:border-slate-600'
              }
            `}
          >
            {wallpaper.type === 'animated' ? (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-violet-900" />
            ) : (
              <img
                src={wallpaper.thumbnail}
                alt={wallpaper.name}
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute bottom-0 left-0 right-0 text-xs text-center py-1 bg-black/50 text-white">
              {wallpaper.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

### 7. Übergangsanimation beim Wallpaper-Wechsel

```tsx
// Sanftes Crossfade beim Wechsel
<AnimatePresence mode="wait">
  <motion.div
    key={wallpaperId}
    className="absolute inset-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {/* aktuelles Wallpaper */}
  </motion.div>
</AnimatePresence>
```

---

## ✅ Akzeptanzkriterien

- [ ] Mindestens 4 Wallpaper-Optionen verfügbar (inkl. animierter Gradient als Standard)
- [ ] Wallpaper-Auswahl ist im `SettingsModal` zugänglich
- [ ] Ausgewähltes Wallpaper wird im Zustand-Store und `localStorage` gespeichert
- [ ] Wallpaper überlebt Browser-Refresh (Persistenz via localStorage)
- [ ] Animierter Gradient-Hintergrund läuft performant (keine CPU-Spikes)
- [ ] Beim Wallpaper-Wechsel gibt es eine sanfte Übergangsanimation
- [ ] Statische Wallpaper werden als `<img>` oder CSS `background-image` gerendert
- [ ] Safari-Kompatibilität (`-webkit-backdrop-filter` für Glass-Effekte über Wallpaper)
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 2.1 (`AnimatedBackground` Komponente vorhanden)
- **Voraussetzung:** Task 6.1 (Zustand-Store für `settings.wallpaper`)
- **Voraussetzung:** Task 6.2 (localStorage-Persistenz)
- **Ergänzt:** Task 5.5 (Glassmorphism-Effekte über Wallpaper)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(ui): Task 5.6 - Wallpaper-Auswahl mit animiertem Gradient und statischen Bildern"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 5.6 auf `✅ Erledigt` setzen.

