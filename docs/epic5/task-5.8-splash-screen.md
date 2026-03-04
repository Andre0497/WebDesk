# Task 5.8 – Ladeanimation / Splash Screen

> **Epic:** EPIC 5 – Animationen & Visuelles Polish  
> **Priorität:** 🟢 Niedrig  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Beim ersten Laden der App soll ein kurzer, eleganter Splash Screen erscheinen, der das WebDesk-Logo und den App-Namen zeigt und nach ca. 1,5–2 Sekunden sanft in den Desktop übergeht. Der Splash Screen soll nur beim initalen App-Start angezeigt werden, nicht bei jedem Browser-Refresh (via `sessionStorage`).

---

## 📋 Aufgaben

### 1. `SplashScreen` Komponente erstellen

```tsx
// src/components/ui/SplashScreen.tsx
import { motion } from 'framer-motion'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: '#0a0a0f' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onAnimationComplete={onComplete}  // wird beim Exit-Ende aufgerufen
    >
      {/* Logo / Icon */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="mb-6"
      >
        {/* SVG-Logo oder Emoji */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)',
          }}
        >
          🖥️
        </div>
      </motion.div>

      {/* App-Name */}
      <motion.h1
        className="text-3xl font-bold text-white tracking-tight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
      >
        WebDesk
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="mt-2 text-sm text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        Deine Links. Dein Desktop.
      </motion.p>

      {/* Ladeanzeige */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <LoadingDots />
      </motion.div>
    </motion.div>
  )
}

function LoadingDots() {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
```

### 2. Splash Screen State in `App.tsx` verwalten

```tsx
// src/App.tsx
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SplashScreen } from './components/ui/SplashScreen'
import { DesktopCanvas } from './components/desktop/DesktopCanvas'

const SPLASH_SESSION_KEY = 'webdesk-splash-shown'

export default function App() {
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    // Nur beim ersten Tab-Aufruf innerhalb der Session zeigen
    const alreadyShown = sessionStorage.getItem(SPLASH_SESSION_KEY)
    if (!alreadyShown) {
      setShowSplash(true)
    }
  }, [])

  const handleSplashComplete = () => {
    sessionStorage.setItem(SPLASH_SESSION_KEY, 'true')
    setShowSplash(false)
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {/* Desktop wird im Hintergrund bereits aufgebaut */}
      <DesktopCanvas />
    </>
  )
}
```

### 3. Auto-Dismiss nach Timeout

Der Splash Screen soll sich nach einer definierten Zeit selbst schließen, unabhängig vom Animationsstatus:

```tsx
// src/components/ui/SplashScreen.tsx (ergänzen)
const SPLASH_DURATION_MS = 1800  // 1.8 Sekunden

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
    }, SPLASH_DURATION_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      ...
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        if (isExiting) onComplete()
      }}
    >
      ...
    </motion.div>
  )
}
```

### 4. Desktop-Einblendanimation nach Splash

Nach dem Ausblenden des Splash Screens soll der Desktop sanft eingeblendet werden. Das harmoniert mit Task 5.1 (Icon-Stagger):

```tsx
// src/components/desktop/DesktopCanvas.tsx
<motion.div
  className="fixed inset-0"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  {/* Desktop-Inhalt */}
</motion.div>
```

### 5. `prefers-reduced-motion` – Splash Screen überspringen

```tsx
// src/App.tsx (ergänzen)
import { useReducedMotion } from 'framer-motion'

const shouldReduceMotion = useReducedMotion()

useEffect(() => {
  const alreadyShown = sessionStorage.getItem(SPLASH_SESSION_KEY)
  if (!alreadyShown && !shouldReduceMotion) {
    setShowSplash(true)
  }
}, [shouldReduceMotion])
```

### 6. Entwicklungs-Modus: Splash immer anzeigen (optional)

Für schnelles Testing während der Entwicklung:

```typescript
// Splash immer zeigen im Dev-Modus (in App.tsx)
if (import.meta.env.DEV) {
  // sessionStorage.removeItem(SPLASH_SESSION_KEY)  ← auskommentiert lassen, nur bei Bedarf
}
```

---

## ✅ Akzeptanzkriterien

- [ ] Splash Screen erscheint beim ersten Aufruf der App in der Session
- [ ] Logo erscheint mit Spring-Animation (scale + opacity)
- [ ] App-Name erscheint mit Fade-in + leichtem Y-Offset
- [ ] Ladeindikator (3 pulsierende Punkte) ist sichtbar
- [ ] Splash Screen blendet sich nach ca. 1.8 Sekunden sanft aus (opacity 1→0)
- [ ] Desktop startet gleichzeitig mit / direkt nach dem Splash-Fade-out
- [ ] Bei Browser-Refresh innerhalb der Session: kein Splash Screen (sessionStorage-Check)
- [ ] `prefers-reduced-motion`: Splash wird übersprungen
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.4 (Framer Motion installiert)
- **Voraussetzung:** Task 2.1 (`DesktopCanvas` vorhanden, wird im Hintergrund gerendert)
- **Ergänzt:** Task 5.1 (Icon-Einblend-Animationen starten nach Splash-Fade-out)
- **Ergänzt:** Task 6.3 (Initiale Demo-Daten werden geladen, während Splash sichtbar ist)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(ui): Task 5.8 - Splash Screen Ladeanimation beim App-Start"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 5.8 auf `✅ Erledigt` setzen.

