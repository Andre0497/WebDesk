# Task 1.4 – Framer Motion installieren

> **Epic:** EPIC 1 – Projekt-Setup & Infrastruktur  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Framer Motion als Animations-Bibliothek installieren und eine einfache Smoke-Test-Animation implementieren, um die korrekte Integration zu bestätigen. Framer Motion wird in WebDesk für Fenster-Animationen, Icon-Hover-Effekte, Modal-Übergänge und Layout-Animationen (Drag & Drop) eingesetzt.

---

## 📋 Aufgaben

### 1. Paket installieren

```bash
npm install framer-motion
```

Laut `tech-stack.md` wird Version `^12.x` eingesetzt.

### 2. Integration prüfen – Smoke Test in `App.tsx`

Kurzen Test einbauen, um sicherzustellen, dass Framer Motion korrekt funktioniert:

```tsx
import { motion } from 'framer-motion'

function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <motion.h1
        className="text-4xl font-bold text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        WebDesk
      </motion.h1>
    </div>
  )
}

export default App
```

### 3. Smoke Test verifizieren

- `npm run dev` starten
- Im Browser prüfen: Der Titel „WebDesk" soll beim Laden von oben eingeblendet werden
- Danach kann der Smoke Test wieder entfernt werden (die `motion.h1` zurück zu `h1`)

### 4. TypeScript-Typen prüfen

Framer Motion bringt eigene TypeScript-Typen mit – kein separates `@types/framer-motion` nötig. Folgende Typen werden später häufig verwendet:

```typescript
import type { Variants, Transition, MotionProps } from 'framer-motion'
```

---

## 🧩 Verwendung in WebDesk (Vorschau)

Framer Motion wird in folgenden Bereichen eingesetzt (laut `project-plan.md`):

| Task | Verwendung |
|---|---|
| 2.7 | Modal Ein-/Ausblenden (fade + scale) |
| 3.4 | FolderWindow slide/scale-in |
| 4.5 | Drag-Overlay Ghost-Preview |
| 5.1 | Staggered Fade-in für Desktop-Icons |
| 5.2 | Ordner Öffnen/Schließen Animation |
| 5.3 | Icon Hover & Click Animationen |

---

## ✅ Akzeptanzkriterien

- [ ] `npm install` läuft ohne Fehler durch
- [ ] `framer-motion` erscheint in `package.json` unter `dependencies`
- [ ] Import von `motion` aus `framer-motion` erzeugt keinen TypeScript-Fehler
- [ ] Smoke-Test-Animation funktioniert im Browser korrekt
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Version | Typ |
|---|---|---|
| `framer-motion` | ^12.x | dependency |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.1 muss abgeschlossen sein
- **Voraussetzung für:** Task 2.7 (Modal), Task 3.4 (FolderWindow), EPIC 5 (Animationen)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(setup): Task 1.4 - Framer Motion installieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 1.4 auf `✅ Erledigt` setzen.

