# Task 2.1 – `DesktopCanvas` Komponente

> **Epic:** EPIC 2 – Core UI & Desktop-Layout  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Den zentralen Vollbild-Container `DesktopCanvas` implementieren, der den gesamten Desktop umschließt. Er bildet die Wurzel für alle Desktop-Elemente (Grid, Icons, Fenster) und stellt später den `DndContext`-Provider bereit. Vorerst rendert er einen einfachen Container mit Hintergrundfarbe und dem Placeholder für `DesktopGrid` sowie `AnimatedBackground`.

---

## 📋 Aufgaben

### 1. `src/components/desktop/DesktopCanvas.tsx` implementieren

```tsx
import AnimatedBackground from './AnimatedBackground'
import DesktopGrid from './DesktopGrid'

export default function DesktopCanvas() {
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* Hintergrund-Layer */}
      <AnimatedBackground />

      {/* Icon-Grid-Layer */}
      <div className="relative z-10 w-full h-full">
        <DesktopGrid />
      </div>
    </div>
  )
}
```

**Wichtige CSS-Eigenschaften:**
- `w-screen h-screen` – nimmt den gesamten Viewport ein
- `overflow-hidden` – verhindert Scrollbalken
- `select-none` – verhindert ungewollte Textauswahl beim Drag & Drop
- `relative` – bildet den Stacking-Context für absolute Kinder

### 2. `src/components/desktop/DesktopGrid.tsx` – Platzhalter anpassen

Vorerst einen leeren Container rendern (wird in Task 2.5 vollständig implementiert):

```tsx
export default function DesktopGrid() {
  return (
    <div className="w-full h-full p-4">
      {/* Wird in Task 2.5 implementiert */}
    </div>
  )
}
```

### 3. `src/components/desktop/AnimatedBackground.tsx` – Platzhalter anpassen

Vorerst einen einfachen Gradient-Hintergrund rendern (wird in Task 2.4 vollständig implementiert):

```tsx
export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900" />
  )
}
```

### 4. `src/App.tsx` aktualisieren

`DesktopCanvas` als Root-Komponente einbinden:

```tsx
import DesktopCanvas from './components/desktop/DesktopCanvas'

function App() {
  return <DesktopCanvas />
}

export default App
```

---

## ✅ Akzeptanzkriterien

- [ ] `DesktopCanvas` füllt den gesamten Viewport aus (kein weißer Rand)
- [ ] Kein Scrollbalken sichtbar
- [ ] Hintergrund zeigt den Gradient-Platzhalter
- [ ] `npm run dev` startet ohne Fehler
- [ ] `npm run lint` meldet keine Fehler
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.1 (Vite + React + TS), Task 1.2 (Tailwind)
- **Voraussetzung für:** Task 2.2 (Taskbar), 2.3 (ContextMenu), 2.4 (AnimatedBackground), 2.5 (DesktopGrid), 4.1 (DndContext)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(desktop): Task 2.1 - DesktopCanvas Komponente implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 2.1 auf `✅ Erledigt` setzen.

