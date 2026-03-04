# Task 2.4 – Animierter Hintergrund

> **Epic:** EPIC 2 – Core UI & Desktop-Layout  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Den `AnimatedBackground` mit einer subtilen, lebendigen Hintergrundanimation ausstatten. Standardmäßig wird ein animierter CSS-Gradient-Effekt verwendet. Optional kann ein statisches Wallpaper-Bild aus `public/wallpapers/` angezeigt werden. Der Hintergrund reagiert auf die in den Settings gespeicherte `wallpaper`-Einstellung.

---

## 📋 Aufgaben

### 1. CSS-Animation in `src/index.css` definieren

Eine sanft animierte Gradient-Animation via `@keyframes`:

```css
@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background: linear-gradient(
    135deg,
    #0f0c29,
    #302b63,
    #24243e,
    #1a1a2e,
    #16213e
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

### 2. `src/components/desktop/AnimatedBackground.tsx` vollständig implementieren

```tsx
interface AnimatedBackgroundProps {
  wallpaper?: string  // z. B. 'dark-space' | 'aurora' | 'abstract' | undefined
}

export default function AnimatedBackground({ wallpaper }: AnimatedBackgroundProps) {
  // Wallpaper-Bild aus public/wallpapers/ laden
  if (wallpaper) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/wallpapers/${wallpaper}.jpg')` }}
      >
        {/* Leichter Overlay für bessere Icon-Lesbarkeit */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
    )
  }

  // Standard: Animierter Gradient
  return (
    <div className="absolute inset-0 animated-gradient">
      {/* Optionale Overlay-Schicht für Tiefe */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  )
}
```

### 3. Wallpaper-Bilder unter `public/wallpapers/` ablegen

Gemäß `architecture.md` sollen folgende Bilder vorhanden sein:
- `public/wallpapers/dark-space.jpg`
- `public/wallpapers/aurora.jpg`
- `public/wallpapers/abstract.jpg`

> **Hinweis:** Für die Entwicklung können zunächst Platzhalterbilder verwendet werden (z. B. von [unsplash.com](https://unsplash.com) heruntergeladen). Die finale Wallpaper-Auswahl erfolgt in Task 5.6.

### 4. `DesktopCanvas.tsx` – Wallpaper-Prop übergeben

```tsx
import AnimatedBackground from './AnimatedBackground'

export default function DesktopCanvas() {
  // Später kommt dieser Wert aus dem desktopStore (Task 6.1)
  const wallpaper = undefined  // undefined = animierter Gradient

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      <AnimatedBackground wallpaper={wallpaper} />
      {/* ... */}
    </div>
  )
}
```

### 5. Performance-Hinweis

Die CSS-Animation läuft auf der GPU (nur `background-position` wird animiert, kein Layout-Reflow). Für schwächere Geräte kann die Animation via `prefers-reduced-motion` deaktiviert werden:

```css
@media (prefers-reduced-motion: reduce) {
  .animated-gradient {
    animation: none;
    background-position: 0% 50%;
  }
}
```

---

## ✅ Akzeptanzkriterien

- [ ] Animierter Gradient ist auf dem Desktop sichtbar
- [ ] Gradient-Animation läuft smooth und endlos
- [ ] Bei gesetztem `wallpaper`-Prop wird das Bild aus `public/wallpapers/` geladen
- [ ] Wallpaper-Modus hat einen leichten dunklen Overlay für Icon-Lesbarkeit
- [ ] `prefers-reduced-motion` stoppt die Animation
- [ ] Keine Performance-Einbußen (GPU-Animation, kein Layout-Reflow)
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.2 (Tailwind), Task 2.1 (DesktopCanvas)
- **Voraussetzung für:** Task 5.6 (Wallpaper-Auswahl in Settings), Task 5.5 (Glassmorphism)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(desktop): Task 2.4 - Animierten Hintergrund mit Gradient und Wallpaper-Support implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 2.4 auf `✅ Erledigt` setzen.

