# 🗂 Projektplan – WebDesk

> **Stack:** React 18 + TypeScript · Vite · Tailwind CSS · Framer Motion · dnd-kit · localStorage  
> **Ziel:** Statische Desktop-Web-App zur Link-Organisation  
> **Stand:** 2026-03-04

---

## 📌 Epics & Tasks

---

### 🟦 EPIC 1 – Projekt-Setup & Infrastruktur

**Ziel:** Lauffähiges Grundgerüst mit allen Abhängigkeiten, Linting und CI.

| # | Task | Beschreibung | Priorität | Status |
|---|---|---|---|---|
| 1.1 | Vite + React + TS Projekt anlegen | `npm create vite@latest webdesk -- --template react-ts` | 🔴 Hoch | ✅ Erledigt |
| 1.2 | Tailwind CSS installieren & konfigurieren | `tailwindcss`, `postcss`, `autoprefixer` einrichten | 🔴 Hoch | ✅ Erledigt |
| 1.3 | ESLint + Prettier konfigurieren | `.eslintrc`, `.prettierrc` anlegen, Regeln definieren | 🟡 Mittel | ✅ Erledigt |
| 1.4 | Framer Motion installieren | `npm install framer-motion` | 🔴 Hoch | ✅ Erledigt |
| 1.5 | dnd-kit installieren | `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` | 🔴 Hoch | ✅ Erledigt |
| 1.6 | Heroicons & Headless UI installieren | `npm install @heroicons/react @headlessui/react` | 🟡 Mittel | ✅ Erledigt |
| 1.7 | Ordnerstruktur anlegen | `src/components`, `src/hooks`, `src/store`, `src/types`, `src/utils` | 🔴 Hoch | ✅ Erledigt |
| 1.8 | GitHub Repository & GitHub Pages CI anlegen | `gh-pages` Branch + GitHub Actions Workflow | 🟢 Niedrig | ✅ Erledigt |

**Meilenstein M1:** `npm run dev` zeigt leere App ohne Fehler ✅

---

### 🟦 EPIC 2 – Core UI & Desktop-Layout

**Ziel:** Grundlegendes Desktop-Interface mit Hintergrund, Taskbar und Hauptbereich.

| # | Task | Beschreibung | Priorität | Status |
|---|---|---|---|---|
| 2.1 | `DesktopCanvas` Komponente | Vollbild-Container mit animiertem Hintergrund (Gradient/Wallpaper) | 🔴 Hoch | ✅ Erledigt |
| 2.2 | `Taskbar` Komponente | Untere Leiste mit App-Name, Uhrzeit und Settings-Button | 🟡 Mittel | ✅ Erledigt |
| 2.3 | `ContextMenu` Komponente | Rechtsklick-Kontextmenü (Neuer Ordner, Neuer Link, etc.) | 🔴 Hoch | ✅ Erledigt |
| 2.4 | Animierter Hintergrund | Particle-Effekt oder subtile CSS-Gradient-Animation | 🟡 Mittel | ✅ Erledigt |
| 2.5 | Responsives Grid-Layout | CSS Grid für Icon-Placement auf dem Desktop | 🔴 Hoch | ✅ Erledigt |
| 2.6 | Globales Theme-System | CSS Custom Properties für Light/Dark Mode | 🟡 Mittel | ✅ Erledigt |
| 2.7 | `Modal` Basiskomponente | Wiederverwendbares Modal mit Framer Motion Ein-/Ausblenden | 🔴 Hoch | ✅ Erledigt |

**Meilenstein M2:** Desktop-Grundlayout mit Taskbar ist sichtbar ✅

---

### 🟦 EPIC 3 – Icon & Ordner-System

**Ziel:** Links und Ordner können erstellt, angezeigt, bearbeitet und gelöscht werden.

| # | Task | Beschreibung | Priorität | Status |
|---|---|---|---|---|
| 3.1 | Datenmodell definieren | TypeScript-Interfaces für `LinkItem`, `FolderItem`, `DesktopItem` | 🔴 Hoch | ✅ Erledigt |
| 3.2 | `LinkIcon` Komponente | Icon mit Favicon-Fetch, Label, Hover-Effekt | 🔴 Hoch | ✅ Erledigt |
| 3.3 | `FolderIcon` Komponente | Ordner-Icon mit Anzahl-Badge und Hover-Effekt | 🔴 Hoch | ✅ Erledigt |
| 3.4 | `FolderWindow` Komponente | Öffenbares Fenster (wie Finder/Explorer) mit Inhalt des Ordners | 🔴 Hoch | ⬜ Offen |
| 3.5 | Favicon-Fetching Service | `https://www.google.com/s2/favicons?sz=64&domain=...` nutzen | 🟡 Mittel | ✅ Erledigt |
| 3.6 | `AddLinkModal` Komponente | Formular: URL, Name, Ziel-Ordner, Icon-Vorschau | 🔴 Hoch | ✅ Erledigt |
| 3.7 | `AddFolderModal` Komponente | Formular: Name, Farbe, Icon-Emoji | 🔴 Hoch | ⬜ Offen |
| 3.8 | `EditItemModal` Komponente | Bearbeiten von Name/URL/Farbe bestehender Items | 🟡 Mittel | ✅ Erledigt |
| 3.10 | Suche / Schnellzugriff | Suchleiste die Icons/Links filtert (Spotlight-Stil) | 🟢 Niedrig | ✅ Erledigt |
| 3.9 | Löschen mit Bestätigung | Bestätigungs-Dialog vor dem Löschen | 🟡 Mittel | ✅ Erledigt |

**Meilenstein M3:** Links & Ordner können erstellt, geöffnet und gelöscht werden ✅

---

### 🟦 EPIC 4 – Drag & Drop

**Ziel:** Icons können per Drag & Drop auf dem Desktop und in Ordner verschoben werden.

| # | Task | Beschreibung | Priorität | Status |
|---|---|---|---|---|
| 4.1 | `DndContext` auf Desktop einrichten | `@dnd-kit/core` Provider auf `DesktopCanvas` | 🔴 Hoch | ✅ Erledigt |
| 4.2 | Draggable Icons | `useDraggable` Hook auf `LinkIcon` & `FolderIcon` | 🔴 Hoch | ✅ Erledigt |
| 4.3 | Droppable Desktop-Grid-Zellen | Freie Positionen als Drop-Targets | 🔴 Hoch | ✅ Erledigt |
| 4.4 | Drop in Ordner | Ordner-Icon als Drop-Target → Item wird in Ordner verschoben | 🔴 Hoch | ⬜ Offen |
| 4.5 | Drag-Overlay / Ghost-Preview | Schöne Semi-transparente Vorschau beim Ziehen | 🟡 Mittel | ✅ Erledigt |
| 4.6 | Sortierung innerhalb Ordner | `@dnd-kit/sortable` für Items in `FolderWindow` | 🟡 Mittel | ⬜ Offen |
| 4.7 | Kollisionsverhalten | Snap-to-Grid oder freie Positionierung konfigurieren | 🟢 Niedrig | ✅ Erledigt |

**Meilenstein M4:** Drag & Drop auf Desktop und in Ordner funktioniert ✅

---

### 🟦 EPIC 5 – Animationen & Visuelles Polish

**Ziel:** App fühlt sich lebendig, immersiv und hochwertig an.

| # | Task | Beschreibung | Priorität | Status |
|---|---|---|---|---|
| 5.1 | Einblend-Animationen für Icons | Staggered Fade-in beim Laden der Desktop-Icons | 🟡 Mittel | ✅ Erledigt |
| 5.2 | Ordner Öffnen/Schließen Animation | `FolderWindow` slide/scale-in mit Framer Motion | 🔴 Hoch | ✅ Erledigt |
| 5.3 | Icon Hover & Click Animationen | Scale-up on hover, bounce on click | 🟡 Mittel | ⬜ Offen |
| 5.4 | Modal Animationen | Fade + Scale für alle Modals | 🟡 Mittel | ⬜ Offen |
| 5.5 | Glassmorphism auf Fenstern | Backdrop-blur + semi-transparente Hintergründe | 🔴 Hoch | ⬜ Offen |
| 5.6 | Wallpaper-Auswahl | Mehrere Hintergrundbilder auswählbar (lokal gespeichert) | 🟢 Niedrig | ⬜ Offen |
| 5.7 | Ripple-Effekt auf Buttons | Kleiner Click-Ripple wie Material Design | 🟢 Niedrig | ⬜ Offen |
| 5.8 | Ladeanimation / Splash Screen | Kurzer Intro-Screen beim ersten Laden | 🟢 Niedrig | ⬜ Offen |

**Meilenstein M5:** App wirkt „lebendig" und polished ✅

---

### 🟦 EPIC 6 – State-Management & Persistenz

**Ziel:** Alle Daten werden zuverlässig gespeichert und können exportiert/importiert werden.

| # | Task | Beschreibung | Priorität | Status |
|---|---|---|---|---|
| 6.1 | Zustand-Store aufbauen | `useReducer` + `Context` oder `Zustand` (lightweight) | 🔴 Hoch | ⬜ Offen |
| 6.2 | localStorage Synchronisation | Custom Hook `useLocalStorage` mit auto-persist | 🔴 Hoch | ⬜ Offen |
| 6.3 | Initiale Demo-Daten | Beim ersten Start werden Beispiel-Links/-Ordner geladen | 🟡 Mittel | ⬜ Offen |
| 6.4 | JSON-Export | Download der kompletten Desktop-Konfiguration als `.json` | 🟡 Mittel | ⬜ Offen |
| 6.5 | JSON-Import | Upload und Einlesen einer Konfig-Datei | 🟡 Mittel | ⬜ Offen |
| 6.6 | Reset / Werkseinstellungen | Alles löschen und Demo-Daten wiederherstellen | 🟢 Niedrig | ⬜ Offen |

**Meilenstein M6:** Daten überleben Browser-Refresh, Export/Import funktioniert ✅

---

### 🟦 EPIC 7 – Testing & Deployment

**Ziel:** App ist stabil, getestet und auf einem Static-Host erreichbar.

| # | Task | Beschreibung | Priorität | Status |
|---|---|---|---|---|
| 7.1 | Unit Tests für Utility-Funktionen | Vitest für `utils/` Funktionen | 🟡 Mittel | ⬜ Offen |
| 7.2 | Komponenten-Tests | React Testing Library für kritische Komponenten | 🟡 Mittel | ⬜ Offen |
| 7.3 | Accessibility-Check | Lighthouse + axe-core Audit | 🟡 Mittel | ⬜ Offen |
| 7.4 | Performance-Optimierung | Code-Splitting, lazy loading, Bundle-Analyse | 🟡 Mittel | ⬜ Offen |
| 7.5 | Production Build testen | `npm run build && npm run preview` lokal testen | 🔴 Hoch | ⬜ Offen |
| 7.6 | GitHub Pages Deployment | GitHub Actions Workflow für automatisches Deployment | 🟡 Mittel | ⬜ Offen |
| 7.7 | README.md für das Projekt | Installations- und Nutzungsanleitung | 🟢 Niedrig | ⬜ Offen |

**Meilenstein M7:** App ist live unter einer öffentlichen URL erreichbar ✅

---

## 🏁 Gesamtübersicht Meilensteine

```
M1 → M2 → M3 → M4 → M5 → M6 → M7
Setup  Layout  Icons  DnD  Polish  Data  Deploy
```

## 📊 Task-Status Legende

| Symbol | Bedeutung |
|---|---|
| ⬜ Offen | Noch nicht begonnen |
| 🔄 In Arbeit | Wird gerade umgesetzt |
| ✅ Erledigt | Abgeschlossen |
| ❌ Blockiert | Abhängigkeit fehlt |
| ⏸ Pausiert | Zurückgestellt |


