# Task 5.5 – Glassmorphism auf Fenstern

> **Epic:** EPIC 5 – Animationen & Visuelles Polish  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Alle schwebenden UI-Elemente (`FolderWindow`, Modals, `ContextMenu`, `Taskbar`) sollen den Glassmorphism-Stil aus `design-plan.md` erhalten: Halbtransparente Hintergründe mit `backdrop-filter: blur()`, subtile Borders und Schatten. Das erzeugt den typischen „Tiefe"-Effekt eines modernen Desktops.

---

## 📋 Aufgaben

### 1. Glassmorphism CSS Custom Properties in `index.css` definieren

```css
/* src/index.css */
:root {
  /* Glassmorphism Layers */
  --glass-bg: rgba(18, 18, 26, 0.85);
  --glass-bg-modal: rgba(18, 18, 26, 0.95);
  --glass-bg-light: rgba(255, 255, 255, 0.06);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-border-light: rgba(255, 255, 255, 0.08);
  --glass-blur: blur(20px);
  --glass-blur-sm: blur(8px);
  --glass-saturate: saturate(180%);
}
```

### 2. Tailwind-Utility-Klassen für Glassmorphism in `tailwind.config.ts` ergänzen

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      // ...bestehende Konfiguration...
      backdropBlur: {
        xs: '2px',
        sm: '8px',
        glass: '20px',
      },
      backgroundColor: {
        'glass-window': 'rgba(18, 18, 26, 0.85)',
        'glass-modal': 'rgba(18, 18, 26, 0.95)',
        'glass-overlay': 'rgba(255, 255, 255, 0.06)',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.12)',
        'glass-light': 'rgba(255, 255, 255, 0.08)',
      },
      boxShadow: {
        window: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        glow: '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-sm': '0 0 10px rgba(99, 102, 241, 0.2)',
        modal: '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
      },
    },
  },
}
```

### 3. `FolderWindow` – Glassmorphism-Styling anwenden

```tsx
// src/components/windows/FolderWindow.tsx
<motion.div
  className="fixed z-50 rounded-window border overflow-hidden"
  style={{
    background: 'rgba(18, 18, 26, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',  // Safari
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
    minWidth: '380px',
    maxWidth: '640px',
  }}
  ...
>
  {/* Window Title Bar */}
  <div
    className="flex items-center justify-between px-4 border-b"
    style={{
      height: '44px',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      background: 'rgba(255, 255, 255, 0.03)',
    }}
  >
    {/* macOS-Stil Buttons + Titel */}
  </div>

  {/* Window Content */}
  <div className="p-4">
    <WindowGrid items={folderItems} />
  </div>
</motion.div>
```

### 4. macOS-Stil Traffic-Light-Buttons für `WindowTitleBar`

```tsx
// src/components/windows/WindowTitleBar.tsx
export function WindowTitleBar({ folder, onClose, onMinimize, onMaximize }: TitleBarProps) {
  return (
    <div className="flex items-center gap-2 px-4" style={{ height: '44px' }}>
      {/* Traffic Light Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onClose}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          aria-label="Schließen"
        />
        <button
          onClick={onMinimize}
          className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors"
          aria-label="Minimieren"
        />
        <button
          onClick={onMaximize}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
          aria-label="Maximieren"
        />
      </div>

      {/* Ordner-Name */}
      <span className="ml-3 text-sm font-medium text-slate-200 flex items-center gap-2">
        {folder.emoji && <span>{folder.emoji}</span>}
        {folder.name}
      </span>
    </div>
  )
}
```

### 5. `Taskbar` – Glassmorphism-Styling

```tsx
// src/components/taskbar/Taskbar.tsx
<div
  className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-6 border-t"
  style={{
    height: '52px',
    background: 'rgba(10, 10, 15, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  }}
>
```

### 6. `ContextMenu` – Glassmorphism-Styling

```tsx
// src/components/ui/ContextMenu.tsx
<motion.div
  className="fixed z-[100] rounded-xl overflow-hidden border"
  style={{
    minWidth: '200px',
    background: 'rgba(18, 18, 26, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
  }}
>
```

### 7. Safari-Kompatibilität sicherstellen

Safari benötigt `-webkit-backdrop-filter`. Sicherstellen, dass alle Glassmorphism-Elemente beide Properties setzen:

```tsx
// Utility-Funktion oder Tailwind-Plugin
const glassStyle = {
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
}
```

### 8. Performance-Check

`backdrop-filter` kann auf schwachen Geräten teuer sein. Prüfen, ob bei vielen gleichzeitig offenen Fenstern die Performance akzeptabel bleibt. Ggf. `will-change: transform` ergänzen.

---

## ✅ Akzeptanzkriterien

- [ ] `FolderWindow`: halbtransparenter Hintergrund + `backdrop-filter: blur(20px) saturate(180%)`
- [ ] `FolderWindow`: subtile Border (`rgba(255,255,255,0.12)`)
- [ ] `FolderWindow`: `box-shadow` gemäß `design-plan.md` (window shadow)
- [ ] `FolderWindow`: macOS-Stil Traffic-Light-Buttons in Titelleiste
- [ ] `Taskbar`: Glassmorphism-Hintergrund + Blur
- [ ] `ContextMenu`: Glassmorphism-Hintergrund + Blur
- [ ] Modals (via `Modal`-Basiskomponente): Blur auf Overlay + dunkler Container
- [ ] Safari (`-webkit-backdrop-filter`) wird unterstützt
- [ ] Optisch konsistentes Glassmorphism-Erscheinungsbild über alle Elemente
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.2 (Tailwind CSS konfiguriert)
- **Voraussetzung:** Task 2.1 (DesktopCanvas als Hintergrundebene vorhanden)
- **Voraussetzung:** Task 2.2 (Taskbar vorhanden)
- **Voraussetzung:** Task 2.3 (ContextMenu vorhanden)
- **Voraussetzung:** Task 2.7 (Modal Basiskomponente vorhanden)
- **Voraussetzung:** Task 3.4 (FolderWindow vorhanden)
- **Ergänzt:** Task 5.2 (Ordner-Animation + Glassmorphism zusammen)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(ui): Task 5.5 - Glassmorphism auf FolderWindow, Modals, Taskbar und ContextMenu"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 5.5 auf `✅ Erledigt` setzen.

