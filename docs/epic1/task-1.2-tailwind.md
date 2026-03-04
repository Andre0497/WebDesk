# Task 1.2 – Tailwind CSS installieren & konfigurieren

> **Epic:** EPIC 1 – Projekt-Setup & Infrastruktur  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Tailwind CSS v4 in das Vite-Projekt integrieren, sodass Utility-Klassen in allen `.tsx`-Dateien genutzt werden können. Das Dark-Mode-System soll über die `class`-Strategie gesteuert werden.

---

## 📋 Aufgaben

### 1. Pakete installieren

Laut `tech-stack.md` wird Tailwind v4 mit dem offiziellen Vite-Plugin verwendet:

```bash
npm install tailwindcss @tailwindcss/vite
```

> ⚠️ **Hinweis:** Tailwind v4 benötigt **kein** `postcss` oder `autoprefixer` mehr – das Vite-Plugin übernimmt alles.

### 2. `vite.config.ts` anpassen

Das Tailwind-Vite-Plugin registrieren:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### 3. `src/index.css` anpassen

Die Tailwind-Direktive eintragen (Tailwind v4 nutzt nur eine einzige Direktive):

```css
@import "tailwindcss";

/* globale Custom Styles darunter */
```

### 4. Dark-Mode konfigurieren

In der CSS-Datei die Dark-Mode-Variante auf `class`-Strategie setzen (Tailwind v4):

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

### 5. Funktionstest in `App.tsx`

Kurz prüfen, ob Tailwind-Klassen funktionieren:

```tsx
function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">WebDesk</h1>
    </div>
  )
}
```

---

## ✅ Akzeptanzkriterien

- [ ] `npm install` läuft ohne Fehler durch
- [ ] `npm run dev` startet ohne Fehler
- [ ] Tailwind-Utility-Klassen werden im Browser korrekt angewendet
- [ ] Dark-Mode-Klassen (`dark:`) funktionieren bei gesetzter `.dark`-Klasse auf `<html>`
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build
- [ ] Kein `postcss.config.js` oder `tailwind.config.ts` nötig (Tailwind v4 ist config-frei)

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Version | Typ |
|---|---|---|
| `tailwindcss` | ^4.x | dependency |
| `@tailwindcss/vite` | ^4.x | devDependency |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.1 muss abgeschlossen sein
- **Voraussetzung für:** Task 2.1 (DesktopCanvas), alle UI-Komponenten in EPIC 2–5

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(setup): Task 1.2 - Tailwind CSS v4 installieren und konfigurieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 1.2 auf `✅ Erledigt` setzen.

