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
