# 🎨 Designplan – WebDesk

> Designprinzip: **„Immersive Glassmorphism Desktop"**  
> Inspiration: macOS Monterey · Windows 11 · Linear App

---

## 1. Design-Philosophie

| Prinzip | Beschreibung |
|---|---|
| **Glassmorphism** | Halbtransparente Elemente mit Backdrop-Blur für Tiefenwirkung |
| **Dark First** | Primär dunkles Theme, optionaler Light Mode |
| **Micro-Interactions** | Jede Aktion gibt visuelles Feedback (Hover, Click, Drag) |
| **Spatial Design** | Icons haben echte Positionen auf einem Raster – wie ein echter Desktop |
| **Minimalismus** | Keine unnötigen Elemente, Fokus auf Inhalt und Klarheit |

---

## 2. Farbpalette

### 🌑 Dark Mode (Standard)

```
Background (Base):      #0a0a0f   ← Fast schwarz, leicht bläulich
Background (Surface):   #12121a   ← Karten/Fenster-Hintergrund
Glass Layer:            rgba(255, 255, 255, 0.06)  ← Glassmorphism
Glass Border:           rgba(255, 255, 255, 0.12)  ← Subtile Ränder

Accent Primary:         #6366f1   ← Indigo 500 (Tailwind)
Accent Secondary:       #8b5cf6   ← Violet 500
Accent Glow:            #6366f1 mit 40% Opacity als Box-Shadow

Text Primary:           #f1f5f9   ← Slate 100
Text Secondary:         #94a3b8   ← Slate 400
Text Muted:             #475569   ← Slate 600

Danger:                 #ef4444   ← Red 500
Success:                #22c55e   ← Green 500
Warning:                #f59e0b   ← Amber 500
```

### ☀️ Light Mode (optional)

```
Background (Base):      #f0f4ff   ← Sehr helles Blaugrau
Background (Surface):   #ffffff
Glass Layer:            rgba(255, 255, 255, 0.70)
Glass Border:           rgba(0, 0, 0, 0.08)

Accent Primary:         #4f46e5   ← Indigo 600
Text Primary:           #0f172a   ← Slate 900
Text Secondary:         #475569   ← Slate 600
```

### 🎨 Ordner-Farben (auswählbar)

```
Indigo:   #6366f1
Violet:   #8b5cf6
Sky:      #0ea5e9
Teal:     #14b8a6
Emerald:  #10b981
Amber:    #f59e0b
Rose:     #f43f5e
```

---

## 3. Typografie

### Font-Stack

```css
--font-sans: 'Inter', 'SF Pro Display', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

> **Inter** von Google Fonts – modern, lesbar, für UI-Interfaces optimiert.

### Schriftgrößen (Tailwind-basiert)

| Token | Größe | Verwendung |
|---|---|---|
| `text-xs` | 11px | Badges, Timestamps |
| `text-sm` | 13px | Icon-Labels, Sekundärtext |
| `text-base` | 15px | Fließtext, Formulare |
| `text-lg` | 18px | Überschriften in Modals |
| `text-xl` | 22px | Fenster-Titel |
| `text-3xl` | 30px | App-Name in Taskbar |

### Schriftstärken

```
Regular (400):  Fließtext
Medium (500):   Labels, Navigationsitems
Semibold (600): Überschriften, Buttons
Bold (700):     App-Titel, Akzente
```

---

## 4. Spacing & Grid

### Desktop-Grid

```
Gap zwischen Icons:   16px (1rem)
Icon-Zellgröße:       96px × 96px
Icon-Symbol-Größe:    48px × 48px
Icon-Label-Breite:    max 88px, text-overflow: ellipsis
```

### Abstände (8px-Basis-System)

```
4px   → xs  (0.25rem)   Winzige Abstände
8px   → sm  (0.5rem)    Innere Padding
16px  → md  (1rem)      Standard-Spacing
24px  → lg  (1.5rem)    Komponent-Trennung
32px  → xl  (2rem)      Abschnitte
48px  → 2xl (3rem)      Große Bereiche
```

---

## 5. Komponenten-Design

### 5.1 Desktop Canvas

```
- Vollbild (100vw × 100vh)
- Animierter Hintergrund: mehrstufiger Radial-Gradient der sich
  langsam bewegt (CSS @keyframes oder Framer Motion)
- Dezente Partikel oder Sterne im Hintergrund (optional, Canvas)
- Desktop-Grid für Icon-Positionierung
```

**Visuell:**
```
┌─────────────────────────────────────────────────────────┐
│  [Hintergrund: dunkler animierter Gradient]              │
│                                                          │
│  🗂 Arbeit    🔗 GitHub    🗂 Tools    🔗 Figma          │
│                                                          │
│  🗂 Lernen    🔗 YouTube   🔗 MDN                        │
│                                                          │
│  [Taskbar]_________________________________________      │
└─────────────────────────────────────────────────────────┘
```

---

### 5.2 Icon (Link & Ordner)

```
Normaler Zustand:
  - 96×96px Zelle
  - Zentriertes Symbol (48px)
  - Label darunter (text-sm, max 2 Zeilen, truncate)
  - Kein Hintergrund

Hover:
  - Glassmorphism-Hintergrund erscheint (backdrop-blur-sm)
  - rgba(255,255,255,0.08) Hintergrund
  - border: 1px solid rgba(255,255,255,0.15)
  - border-radius: 12px
  - Scale: 1.08 (Framer Motion spring)
  - Leichter Glow-Shadow in Accent-Farbe

Click / Active:
  - Scale: 0.95 (kurzer Bounce)
  - Helligkeit kurz erhöht

Drag:
  - Scale: 1.1
  - Opacity: 0.85
  - Rotation: ±3° (leichte Neigung)
  - Stärkerer Glow-Effekt
```

---

### 5.3 Folder Window

```
Stil: Schwebedes Glassmorphism-Fenster

Container:
  - min-width: 380px, max-width: 640px
  - border-radius: 16px
  - background: rgba(18, 18, 26, 0.85)
  - backdrop-filter: blur(20px) saturate(180%)
  - border: 1px solid rgba(255, 255, 255, 0.12)
  - box-shadow: 0 25px 50px rgba(0,0,0,0.5),
                0 0 0 1px rgba(255,255,255,0.05)

Titelleiste:
  - Höhe: 44px
  - Ordner-Emoji/Farbe + Name links
  - 3 Buttons rechts (macOS-Stil): Schließen (Rot), Minimieren (Amber), Maximieren (Grün)
  - Draggable (Fenster verschiebbar)

Inhalt:
  - Padding: 16px
  - Gleiches Grid-Layout wie Desktop
  - Scrollbar styled (thin, accent-colored)
```

**Visuell:**
```
╭─────────────────────────────────────╮
│ 🗂 Arbeit                  ● ● ●    │
├─────────────────────────────────────┤
│                                     │
│  🔗 Jira    🔗 Confluence  🔗 Slack │
│                                     │
│  🔗 Figma   🔗 GitHub               │
│                                     │
╰─────────────────────────────────────╯
```

---

### 5.4 Modals (AddLink, AddFolder, Edit)

```
Overlay:
  - background: rgba(0, 0, 0, 0.6)
  - backdrop-filter: blur(4px)
  - Framer Motion: opacity 0→1

Modal Container:
  - width: 420px
  - border-radius: 16px
  - background: rgba(18, 18, 26, 0.95)
  - border: 1px solid rgba(255,255,255,0.15)
  - Framer Motion: scale(0.9)→scale(1) + opacity

Formularfelder:
  - Input: dunkler Hintergrund (rgba(255,255,255,0.05))
  - border: 1px solid rgba(255,255,255,0.1)
  - focus: border-color: accent-primary + glow
  - border-radius: 8px
  - Übergang: smooth 150ms

Buttons:
  - Primary: Gradient (Accent Primary → Accent Secondary)
  - Secondary: Ghost-Style (border only)
  - border-radius: 8px
  - Hover: leichte Aufhellung + scale(1.02)
```

---

### 5.5 Taskbar

```
Position: fixed bottom-0, left-0, right-0
Höhe: 52px
Hintergrund: rgba(10, 10, 15, 0.85) + backdrop-blur
Border-top: 1px solid rgba(255,255,255,0.08)

Links:  App-Logo + Name "WebDesk"
Mitte:  Suchfeld (Spotlight-Stil, nur sichtbar wenn aktiv)
Rechts: Uhrzeit + Datum | Settings-Icon | Theme-Toggle
```

---

### 5.6 Context Menu

```
Position: absolut an Klick-Position
Container:
  - min-width: 200px
  - border-radius: 12px
  - background: rgba(18, 18, 26, 0.95)
  - backdrop-filter: blur(20px)
  - border: 1px solid rgba(255,255,255,0.12)
  - box-shadow: 0 10px 40px rgba(0,0,0,0.4)
  - Framer Motion: scale(0.95)→1 + opacity, origin: top-left

Einträge:
  - Padding: 8px 4px
  - Jeder Eintrag: 36px hoch, 12px horizontal padding
  - Hover: rgba(255,255,255,0.08) Hintergrund
  - Icon (16px) + Label
  - Separator: 1px rgba(255,255,255,0.08) Linie
  - Danger-Eintrag (Löschen): Text in Rot
```

---

## 6. Animationen & Transitions

### Animations-Bibliothek: Framer Motion

| Animation | Trigger | Beschreibung |
|---|---|---|
| Desktop Icons einblenden | App-Start | Staggered fade-in von links nach rechts, 60ms Delay pro Icon |
| Icon Hover | Mouse Enter | Spring: scale 1→1.08, Glassmorphism-BG erscheint |
| Icon Click | Mouse Down | scale 1.08→0.95, dann zurück zu 1.0 |
| Ordner Öffnen | Click | Scale 0.8→1 + opacity 0→1, Origin: Icon-Position |
| Ordner Schließen | Click X | Scale 1→0.8 + opacity 1→0 |
| Modal Öffnen | Trigger | Backdrop fade-in + Modal scale(0.9)→1 |
| Drag Start | Drag Begin | scale 1→1.1, rotation ±3deg, opacity 0.85 |
| Drop | Drag End | Spring-Animation zurück zu Zielposition |
| Context Menu | Right Click | scale(0.95)→1 + opacity, 120ms |
| Page/App Load | Mount | Splash-Screen fade-out + Desktop fade-in |

### Timing-Definitionen

```javascript
// Spring für Icons (lebendig, nicht linear)
const springConfig = { type: "spring", stiffness: 400, damping: 30 }

// Smooth für Overlays
const smoothConfig = { duration: 0.2, ease: "easeOut" }

// Stagger für Desktop-Grid
const staggerConfig = { staggerChildren: 0.06 }
```

---

## 7. Icons & Assets

### Icon-Quellen

| Typ | Quelle | Verwendung |
|---|---|---|
| UI Icons | Heroicons (24px, Outline/Solid) | Navigation, Buttons, Aktionen |
| Favicons | Google S2 API | Link-Icons (automatisch gefetcht) |
| Ordner-Icons | Emoji (Noto Color Emoji) | Ordner-Darstellung |
| Custom Fallback | Heroicons `LinkIcon` | Wenn Favicon nicht lädt |

### Favicon-Fetch-Pattern

```
https://www.google.com/s2/favicons?sz=64&domain={hostname}
```

---

## 8. Responsive Verhalten

> Die App ist primär für Desktop/Laptop ausgelegt.

| Breakpoint | Verhalten |
|---|---|
| < 768px (Mobile) | Hinweis: „Für beste Erfahrung Desktop nutzen" + vereinfachte Listen-Ansicht |
| 768–1024px (Tablet) | Reduziertes Grid, kleinere Icons |
| > 1024px (Desktop) | Volle Desktop-Erfahrung |
| > 1440px (Large) | Größeres Grid, mehr Icons sichtbar |

---

## 9. Accessibility (a11y)

- Alle Icons haben `aria-label`
- Tastaturnavigation (Tab, Enter, Escape)
- Kontrastverhältnis ≥ 4.5:1 für alle Texte
- Fokus-Styles sichtbar (Accent-farbener Outline)
- Drag & Drop auch per Keyboard möglich (dnd-kit unterstützt das)
- `prefers-reduced-motion` wird respektiert (Animationen deaktivierbar)

---

## 10. Design-Tokens (Tailwind Config Auszug)

```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        base: '#0a0a0f',
        surface: '#12121a',
        accent: {
          DEFAULT: '#6366f1',
          secondary: '#8b5cf6',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.06)',
          border: 'rgba(255, 255, 255, 0.12)',
        }
      },
      backdropBlur: {
        xs: '2px',
        glass: '20px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        icon: '12px',
        window: '16px',
        modal: '16px',
      },
      boxShadow: {
        window: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        glow: '0 0 20px rgba(99, 102, 241, 0.4)',
      }
    }
  }
}
```

