# Task 2.6 – Globales Theme-System

> **Epic:** EPIC 2 – Core UI & Desktop-Layout  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Ein Light/Dark-Mode-System über CSS Custom Properties und Tailwinds `class`-Strategie einrichten. Der gewählte Theme-Wert wird im `desktopStore` gespeichert und via `localStorage` persistiert. Beim App-Start wird das gespeicherte Theme sofort angewendet, um ein „Flash of wrong theme" zu vermeiden.

---

## 📋 Aufgaben

### 1. CSS Custom Properties in `src/index.css` definieren

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

/* === Light Mode (Standard) === */
:root {
  --color-bg-primary: #f0f4f8;
  --color-bg-secondary: #ffffff;
  --color-bg-overlay: rgba(255, 255, 255, 0.8);
  --color-border: rgba(0, 0, 0, 0.1);
  --color-text-primary: #1a202c;
  --color-text-secondary: #4a5568;
  --color-accent: #6366f1;
  --color-glass: rgba(255, 255, 255, 0.15);
  --color-glass-border: rgba(255, 255, 255, 0.3);
}

/* === Dark Mode === */
.dark {
  --color-bg-primary: #1a1a2e;
  --color-bg-secondary: #16213e;
  --color-bg-overlay: rgba(0, 0, 0, 0.5);
  --color-border: rgba(255, 255, 255, 0.1);
  --color-text-primary: rgba(255, 255, 255, 0.87);
  --color-text-secondary: rgba(255, 255, 255, 0.5);
  --color-accent: #818cf8;
  --color-glass: rgba(255, 255, 255, 0.08);
  --color-glass-border: rgba(255, 255, 255, 0.15);
}
```

### 2. Theme beim App-Start sofort anwenden

In `index.html` ein Inline-Script einfügen, das das gespeicherte Theme **vor dem React-Render** anwendet (verhindert FWRT – Flash of Wrong Theme):

```html
<head>
  <!-- ... -->
  <script>
    (function() {
      try {
        var data = JSON.parse(localStorage.getItem('webdesk-data') || '{}')
        var theme = data?.settings?.theme || 'dark'
        if (theme === 'dark') document.documentElement.classList.add('dark')
      } catch(e) {
        document.documentElement.classList.add('dark')
      }
    })()
  </script>
</head>
```

### 3. `useTheme` Hook in `src/hooks/useDesktopGrid.ts` anlegen

Da die Store-Anbindung erst in Task 6.1 folgt, einen einfachen lokalen Hook erstellen:

Neue Datei `src/hooks/useTheme.ts`:

```typescript
import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

export function useTheme(initialTheme: Theme = 'dark') {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return { theme, setTheme, toggleTheme }
}
```

### 4. `App.tsx` – Theme-Provider einrichten

```tsx
import DesktopCanvas from './components/desktop/DesktopCanvas'
import { useTheme } from './hooks/useTheme'

function App() {
  // Wird in Task 6.1 durch den desktopStore ersetzt
  useTheme('dark')

  return <DesktopCanvas />
}

export default App
```

### 5. Theme-Toggle in der Taskbar verknüpfen

In `Taskbar.tsx` einen Theme-Toggle-Button ergänzen:

```tsx
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

interface TaskbarProps {
  onSettingsClick: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

// Im JSX:
<button onClick={onToggleTheme} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
  {theme === 'dark'
    ? <SunIcon className="w-5 h-5" />
    : <MoonIcon className="w-5 h-5" />
  }
</button>
```

---

## ✅ Akzeptanzkriterien

- [ ] Dark Mode ist standardmäßig aktiv (`.dark`-Klasse auf `<html>`)
- [ ] Theme-Toggle-Button in der Taskbar wechselt zwischen Dark und Light
- [ ] CSS Custom Properties werden korrekt für beide Themes angewendet
- [ ] Kein „Flash of Wrong Theme" beim Seiten-Laden (Inline-Script in `index.html`)
- [ ] `prefers-color-scheme: dark` wird als Fallback berücksichtigt
- [ ] `npm run lint` meldet keine Fehler

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.2 (Tailwind mit `class`-Strategie), Task 2.2 (Taskbar)
- **Voraussetzung für:** Task 5.5 (Glassmorphism-Styles), Task 6.1 (Theme im Store persistieren)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(theme): Task 2.6 - Globales Light/Dark Theme-System implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 2.6 auf `✅ Erledigt` setzen.

