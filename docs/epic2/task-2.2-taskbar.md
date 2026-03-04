# Task 2.2 – `Taskbar` Komponente

> **Epic:** EPIC 2 – Core UI & Desktop-Layout  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Eine Taskbar am unteren Bildschirmrand implementieren, die eine Uhr, den App-Namen sowie einen Settings-Button enthält. Die Taskbar soll mit Glassmorphism gestylt sein (Backdrop-Blur + semi-transparenter Hintergrund) und immer im Vordergrund liegen.

---

## 📋 Aufgaben

### 1. `src/components/taskbar/Clock.tsx` implementieren

Die Uhr soll jede Sekunde die aktuelle Uhrzeit und das Datum anzeigen:

```tsx
import { useState, useEffect } from 'react'

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeStr = time.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const dateStr = time.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })

  return (
    <div className="flex flex-col items-end text-white text-sm leading-tight">
      <span className="font-semibold">{timeStr}</span>
      <span className="text-xs text-white/70">{dateStr}</span>
    </div>
  )
}
```

### 2. `src/components/taskbar/SearchBar.tsx` – Platzhalter

Vorerst einen einfachen Platzhalter anlegen (wird in Task 3.10 vollständig implementiert):

```tsx
export default function SearchBar() {
  return (
    <div className="hidden">
      {/* Wird in Task 3.10 implementiert */}
    </div>
  )
}
```

### 3. `src/components/taskbar/Taskbar.tsx` implementieren

```tsx
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import Clock from './Clock'
import SearchBar from './SearchBar'

interface TaskbarProps {
  onSettingsClick: () => void
}

export default function Taskbar({ onSettingsClick }: TaskbarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 h-12 px-4
                    flex items-center justify-between
                    bg-white/10 backdrop-blur-md border-t border-white/20
                    text-white">
      {/* Linke Seite: App-Name */}
      <span className="font-bold text-sm tracking-widest uppercase select-none">
        WebDesk
      </span>

      {/* Mitte: Suchleiste (Platzhalter) */}
      <SearchBar />

      {/* Rechte Seite: Settings + Uhr */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSettingsClick}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          title="Einstellungen"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
        <Clock />
      </div>
    </div>
  )
}
```

### 4. `DesktopCanvas.tsx` – Taskbar einbinden

```tsx
import AnimatedBackground from './AnimatedBackground'
import DesktopGrid from './DesktopGrid'
import Taskbar from '../taskbar/Taskbar'

export default function DesktopCanvas() {
  const handleSettingsClick = () => {
    // Wird in Task 3.x (SettingsModal) implementiert
    console.log('Settings öffnen')
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      <AnimatedBackground />

      {/* Desktop-Grid mit Abstand nach unten für die Taskbar */}
      <div className="relative z-10 w-full h-full pb-12">
        <DesktopGrid />
      </div>

      {/* Taskbar */}
      <Taskbar onSettingsClick={handleSettingsClick} />
    </div>
  )
}
```

---

## ✅ Akzeptanzkriterien

- [ ] Taskbar ist am unteren Bildschirmrand fixiert
- [ ] Uhr zeigt aktuelle Uhrzeit an und aktualisiert sich jede Sekunde
- [ ] Datum wird korrekt im deutschen Format angezeigt
- [ ] Settings-Button ist sichtbar und klickbar (Konsolenausgabe als Platzhalter)
- [ ] Glassmorphism-Effekt (Backdrop-Blur) ist sichtbar
- [ ] Taskbar überlappt keine Desktop-Icons (ausreichend `pb-12` auf dem Grid)
- [ ] `npm run lint` meldet keine Fehler

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Zweck |
|---|---|
| `@heroicons/react` | `Cog6ToothIcon` für Settings-Button |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.2 (Tailwind), Task 1.6 (Heroicons), Task 2.1 (DesktopCanvas)
- **Voraussetzung für:** Task 3.10 (SearchBar), Task 6.x (SettingsModal über Taskbar)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(taskbar): Task 2.2 - Taskbar mit Clock und Settings-Button implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 2.2 auf `✅ Erledigt` setzen.

