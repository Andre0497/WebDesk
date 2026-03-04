# Task 7.7 – README.md für das Projekt

> **Epic:** EPIC 7 – Testing & Deployment  
> **Priorität:** 🟢 Niedrig  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Eine vollständige und ansprechende `README.md` für das WebDesk-Repository anlegen. Nach Abschluss dieses Tasks enthält das Repository eine professionelle Dokumentation mit Screenshot, Installations- und Nutzungsanleitung sowie einem Link zur Live-Demo.

---

## 📋 Aufgaben

### 1. README-Struktur planen

Die `README.md` im Repository-Root soll folgende Abschnitte enthalten:

```
1. Titel & Beschreibung mit Badge(s)
2. Live-Demo Link
3. Screenshot / GIF der App
4. Features-Übersicht
5. Tech-Stack
6. Lokale Installation & Setup
7. Nutzungsanleitung (Kurzform)
8. Projekt-Struktur
9. Contributing (optional)
10. Lizenz
```

### 2. Screenshot erstellen

Einen aussagekräftigen Screenshot der laufenden App erstellen:

1. `npm run preview` starten (oder Live-Demo aufrufen)
2. App mit Demo-Daten befüllen (Links, Ordner, offenes Ordner-Fenster)
3. Screenshot mit `Windows + Shift + S` oder einem Tool erstellen
4. Als `docs/screenshot.png` (oder `.webp`) abspeichern
5. In `README.md` einbinden

### 3. `README.md` anlegen/aktualisieren

Die bestehende `README.md` wird durch die vollständige Version ersetzt:

```markdown
# 🖥️ WebDesk

> Ein browser-basierter Desktop zur Verwaltung von Links und Lesezeichen.  
> Gebaut mit React 18, TypeScript, Tailwind CSS und Framer Motion.

[![Deploy to GitHub Pages](https://github.com/Andre0497/WebDesk/actions/workflows/deploy.yml/badge.svg)](https://github.com/Andre0497/WebDesk/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**🌐 Live-Demo:** [https://andre0497.github.io/WebDesk/](https://andre0497.github.io/WebDesk/)

---

![WebDesk Screenshot](docs/screenshot.png)

---

## ✨ Features

- 🔗 **Links verwalten** – URLs mit Favicon, Name und Beschreibung speichern
- 📁 **Ordner-System** – Links in Ordner gruppieren
- 🖱️ **Drag & Drop** – Icons frei auf dem Desktop anordnen
- 💾 **Persistenz** – Alle Daten werden im localStorage gespeichert
- 📤 **Export/Import** – Konfiguration als JSON sichern und wiederherstellen
- 🎨 **Wallpaper-Auswahl** – Mehrere Hintergründe auswählbar
- 🌗 **Dark Mode** – Glassmorphism-Design im Dark-Theme
- ⌨️ **Tastaturnavigation** – Vollständig per Tastatur bedienbar
- 🔍 **Spotlight-Suche** – Schnellsuche über alle Icons

---

## 🛠️ Tech-Stack

| Technologie | Version | Zweck |
|---|---|---|
| React | 18 | UI-Framework |
| TypeScript | 5 | Typsicherheit |
| Vite | 6 | Build-Tool & Dev-Server |
| Tailwind CSS | 4 | Styling |
| Framer Motion | 12 | Animationen |
| dnd-kit | 6 | Drag & Drop |
| Headless UI | 2 | Accessible UI-Primitives |
| Heroicons | 2 | Icon-Set |
| Vitest | 3 | Unit- & Komponenten-Tests |

---

## 🚀 Lokale Installation

### Voraussetzungen
- Node.js ≥ 20
- npm ≥ 10

### Setup

```bash
# Repository klonen
git clone https://github.com/Andre0497/WebDesk.git
cd WebDesk

# Abhängigkeiten installieren
npm install

# Development-Server starten
npm run dev
```

Die App ist dann unter `http://localhost:5173` erreichbar.

### Verfügbare Scripts

| Script | Beschreibung |
|---|---|
| `npm run dev` | Startet den Development-Server |
| `npm run build` | Erstellt den Production-Build |
| `npm run preview` | Startet den Preview-Server (nach Build) |
| `npm test` | Startet Tests im Watch-Mode |
| `npm run test:run` | Führt alle Tests einmalig aus |
| `npm run coverage` | Erstellt einen Coverage-Report |
| `npm run lint` | ESLint-Check |

---

## 📖 Nutzungsanleitung

### Links hinzufügen
1. Rechtsklick auf den Desktop → **Neuen Link hinzufügen**
2. URL und Name eingeben → **Speichern**

### Ordner erstellen
1. Rechtsklick auf den Desktop → **Neuen Ordner erstellen**
2. Name und Farbe wählen → **Erstellen**

### Links in Ordner verschieben
- Link-Icon auf ein Ordner-Icon ziehen

### Daten exportieren/importieren
1. Taskbar → Settings-Icon → **Exportieren**
2. JSON-Datei wird heruntergeladen
3. Über **Importieren** kann eine Konfiguration eingelesen werden

---

## 📁 Projektstruktur

```
src/
├── App.tsx                 # Root-Komponente
├── components/
│   ├── desktop/            # DesktopCanvas, ContextMenu
│   ├── icons/              # LinkIcon, FolderIcon
│   ├── modals/             # AddLinkModal, AddFolderModal, ...
│   ├── taskbar/            # TaskBar
│   ├── ui/                 # Modal, Button, ...
│   └── windows/            # FolderWindow
├── hooks/                  # Custom React Hooks
├── store/                  # State-Management (Context + useReducer)
├── types/                  # TypeScript-Interfaces
└── utils/                  # Utility-Funktionen
```

---

## 📄 Lizenz

MIT License – siehe [LICENSE](LICENSE)
```

### 4. LICENCE-Datei anlegen (optional)

```
MIT License

Copyright (c) 2026 Andre0497

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

Vollständiger MIT-Lizenztext unter: https://opensource.org/licenses/MIT

### 5. README in `docs/` README aktualisieren

Die bestehende `docs/README.md` verweist auf die Haupt-`README.md`:

```markdown
# WebDesk – Projektdokumentation

Die Haupt-README des Projekts befindet sich im Repository-Root: [README.md](../README.md)

Diese `docs/`-Mappe enthält die detaillierte Projekt- und Aufgabendokumentation:
- [project-plan.md](project-plan.md) – Vollständiger Projektplan mit allen Tasks
- [architecture.md](architecture.md) – Technische Architektur
- [design-plan.md](design-plan.md) – Design-Entscheidungen
- [tech-stack.md](tech-stack.md) – Tech-Stack-Begründungen
```

---

## ✅ Akzeptanzkriterien

- [ ] `README.md` im Repository-Root ist vollständig ausgefüllt
- [ ] Screenshot der App ist eingebunden (`docs/screenshot.png`)
- [ ] Live-Demo-Link `https://andre0497.github.io/WebDesk/` ist korrekt
- [ ] Alle Features sind aufgelistet
- [ ] Installations-Anleitung ist vollständig und korrekt
- [ ] Alle `npm`-Scripts sind dokumentiert
- [ ] Tech-Stack-Tabelle ist aktuell
- [ ] GitHub Actions Badge wird korrekt angezeigt
- [ ] `docs/README.md` verweist auf die Haupt-README

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 7.6 (GitHub Pages Deployment – für Live-Demo-Link)
- **Parallel möglich mit:** Task 7.6
- **Abschließt:** EPIC 7 und damit das gesamte Projekt

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "docs: Task 7.7 - README.md mit Screenshot, Features und Installationsanleitung"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 7.7 auf `✅ Erledigt` setzen.

> 🎉 **Herzlichen Glückwunsch!** Mit Task 7.7 ist Meilenstein M7 erreicht und das WebDesk-Projekt vollständig abgeschlossen!

