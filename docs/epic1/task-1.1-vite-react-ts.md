# ✅ Task 1.1 – Vite + React + TS Projekt anlegen

> **Epic:** EPIC 1 – Projekt-Setup & Infrastruktur  
> **Priorität:** 🔴 Hoch  
> **Status:** ✅ Erledigt

---

## 🎯 Ziel

Ein lauffähiges Vite-Projekt mit React 18 und TypeScript als Grundlage für WebDesk aufsetzen. Nach Abschluss dieses Tasks soll `npm run dev` eine leere React-App ohne Fehler starten.

---

## 📋 Aufgaben

### 1. Projekt initialisieren
```bash
npm create vite@latest webdesk -- --template react-ts
cd webdesk
npm install
```

### 2. Konfigurationsdateien prüfen & anpassen
- `vite.config.ts` – `@vitejs/plugin-react` ist aktiv
- `tsconfig.json` – Referenziert `tsconfig.app.json` und `tsconfig.node.json`
- `tsconfig.app.json` – `strict: true`, `jsx: "react-jsx"`, Target `ES2020`
- `tsconfig.node.json` – Für Vite-Konfig-Dateien, Target `ES2022`

### 3. `index.html` anpassen
- `lang="de"` setzen
- `<title>WebDesk</title>` setzen
- Favicon-Referenz auf `/favicon.svg` setzen

### 4. `src/App.tsx` bereinigen
- Standard-Vite-Boilerplate entfernen
- Minimale Platzhalter-Komponente mit `<h1>WebDesk</h1>` anlegen

### 5. `src/index.css` bereinigen
- Vite-Standard-Styles entfernen
- Globale Reset-Styles anlegen (`box-sizing`, `margin`, `padding`)
- `#root` auf `width: 100%; height: 100vh` setzen
- Hintergrundfarbe `#1a1a2e` (Dark-Theme Basis)

### 6. Ordnerstruktur anlegen
Folgende leere Verzeichnisse gemäß `architecture.md` anlegen:
```
src/
├── types/
├── store/
├── hooks/
├── utils/
├── assets/
└── components/
    ├── desktop/
    ├── icons/
    ├── windows/
    ├── modals/
    ├── ui/
    └── taskbar/
public/
└── wallpapers/
```

### 7. `.gitignore` anlegen
```
node_modules
dist
dist-ssr
*.local
.env
.env.*
!.env.example
```

---

## ✅ Akzeptanzkriterien

- [ ] `npm install` läuft ohne Fehler durch
- [ ] `npm run dev` startet den Dev-Server ohne Fehler
- [ ] Im Browser ist eine leere Seite mit dem Titel „WebDesk" sichtbar
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build
- [ ] TypeScript-Konfiguration ist auf `strict: true` gesetzt
- [ ] Ordnerstruktur entspricht `architecture.md`
- [ ] `node_modules` und `dist` sind in `.gitignore` eingetragen

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Version | Typ |
|---|---|---|
| `react` | ^18.3 | dependency |
| `react-dom` | ^18.3 | dependency |
| `typescript` | ^5.7 | devDependency |
| `vite` | ^6.x | devDependency |
| `@vitejs/plugin-react` | ^4.x | devDependency |
| `@types/react` | ^18.3 | devDependency |
| `@types/react-dom` | ^18.3 | devDependency |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung für:** 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 (alle weiteren EPIC-1-Tasks)
- **Blockiert durch:** keine

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(setup): Task 1.1 - Vite + React + TS Projektstruktur anlegen"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 1.1 auf `✅ Erledigt` setzen.

