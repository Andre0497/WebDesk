# Task 7.5 – Production Build testen

> **Epic:** EPIC 7 – Testing & Deployment  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Der Production-Build wird lokal vollständig gebaut und geprüft. Nach Abschluss dieses Tasks ist sichergestellt, dass `npm run build` fehlerfrei durchläuft, der Preview-Server die App korrekt ausliefert und keine Laufzeitfehler auftreten.

---

## 📋 Aufgaben

### 1. Alle Tests vor dem Build ausführen

```bash
npm run test:run
```

Nur wenn alle Tests grün sind, wird der Build gestartet.

### 2. TypeScript-Fehler prüfen

```bash
npx tsc --noEmit
```

Alle TypeScript-Fehler müssen behoben sein, bevor der Build gestartet wird.

### 3. ESLint-Check

```bash
npm run lint
```

Keine Fehler (Warnings sind tolerierbar, aber zu dokumentieren).

### 4. Production-Build erstellen

```bash
npm run build
```

**Zu prüfen nach dem Build:**
- Keine Fehler oder Warnings in der Ausgabe
- `dist/`-Ordner wurde erstellt
- `dist/index.html` ist vorhanden
- `dist/assets/` enthält JS- und CSS-Dateien

Erwartete Ausgabe (Beispiel):
```
✓ 1234 modules transformed.
dist/index.html                   1.23 kB │ gzip:  0.67 kB
dist/assets/react-vendor-xxx.js  42.10 kB │ gzip: 13.50 kB
dist/assets/motion-xxx.js        98.20 kB │ gzip: 30.10 kB
dist/assets/index-xxx.js         85.30 kB │ gzip: 22.80 kB
dist/assets/index-xxx.css         8.10 kB │ gzip:  2.30 kB
✓ built in 4.23s
```

### 5. Preview-Server starten & App manuell testen

```bash
npm run preview
```

Öffnet den Preview-Server unter `http://localhost:4173`.

**Manuelle Test-Checkliste:**

#### Grundlegende Funktionen
- [ ] App lädt ohne Fehler in der Browser-Konsole
- [ ] Desktop-Canvas ist sichtbar
- [ ] Taskbar ist sichtbar mit Uhrzeit
- [ ] Demo-Daten werden angezeigt

#### Link-Funktionen
- [ ] Link-Icon öffnet URL beim Doppelklick in neuem Tab
- [ ] Rechtsklick auf Desktop öffnet Kontextmenü
- [ ] „Neuen Link hinzufügen" → Modal öffnet sich
- [ ] Link-Formular validiert leere URL
- [ ] Neuer Link erscheint auf dem Desktop nach dem Speichern
- [ ] Link kann bearbeitet werden
- [ ] Link kann gelöscht werden (mit Bestätigungs-Dialog)

#### Ordner-Funktionen
- [ ] Ordner-Icon zeigt Anzahl der enthaltenen Items
- [ ] Klick auf Ordner öffnet das Ordner-Fenster
- [ ] Ordner-Fenster kann geschlossen werden
- [ ] Links können dem Ordner hinzugefügt werden

#### Drag & Drop
- [ ] Icons können auf dem Desktop verschoben werden
- [ ] Icons können in Ordner gezogen werden
- [ ] Drag-Overlay/Ghost erscheint beim Ziehen

#### Persistenz
- [ ] Nach Browser-Refresh sind alle Daten noch vorhanden
- [ ] localStorage enthält die Desktop-Konfiguration

#### Export/Import
- [ ] JSON-Export lädt eine Datei herunter
- [ ] JSON-Import liest die exportierte Datei korrekt ein
- [ ] Reset stellt die Demo-Daten wieder her

#### Animationen
- [ ] Icons blenden beim Laden staggered ein
- [ ] Ordner-Fenster hat Öffnungs-/Schließ-Animation
- [ ] Modals haben Fade/Scale-Animation
- [ ] Wallpaper-Auswahl funktioniert

### 6. Build-Größen dokumentieren

Nach dem Build die Größen notieren und in einem Kommentar in `vite.config.ts` oder `docs/` festhalten:

```
Bundle-Größen (Stand: YYYY-MM-DD):
- react-vendor:  ~13 KB (gzip)
- framer-motion: ~30 KB (gzip)
- dnd-kit:       ~10 KB (gzip)
- app-code:      ~23 KB (gzip)
- styles:         ~2 KB (gzip)
- Gesamt:        ~78 KB (gzip)
```

### 7. Browser-Kompatibilität prüfen

In folgenden Browsern testen:

| Browser | Version | Status |
|---|---|---|
| Chrome | Aktuell | ⬜ |
| Firefox | Aktuell | ⬜ |
| Edge | Aktuell | ⬜ |
| Safari (macOS) | Aktuell | ⬜ |

Besonders prüfen: `backdrop-filter` (Glassmorphism), CSS Grid, Framer Motion Animationen.

### 8. Häufige Build-Fehler beheben

**Problem: TypeScript-Fehler nur im Build**
```bash
# Prüfen mit strenger Konfiguration
npx tsc --noEmit --strict
```

**Problem: Assets werden nicht gefunden**
```typescript
// Bilder aus public/ müssen absolut referenziert werden
const wallpaper = '/wallpapers/default.webp'  // ✅
// Nicht: '../public/wallpapers/default.webp'  // ❌
```

**Problem: `process.env` ist undefined**
```typescript
// Vite nutzt import.meta.env statt process.env
const isDev = import.meta.env.DEV  // ✅
```

---

## ✅ Akzeptanzkriterien

- [ ] `npx tsc --noEmit` gibt keine Fehler aus
- [ ] `npm run lint` gibt keine Fehler aus
- [ ] `npm run test:run` – alle Tests grün
- [ ] `npm run build` läuft ohne Fehler durch
- [ ] `dist/`-Ordner enthält `index.html` und alle Assets
- [ ] `npm run preview` startet ohne Fehler
- [ ] Keine Konsolen-Fehler im Browser beim Aufrufen des Previews
- [ ] Alle Punkte der manuellen Test-Checkliste sind abgehakt
- [ ] App funktioniert in Chrome, Firefox und Edge

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Alle EPIC 1–6 Tasks, Tasks 7.1–7.4
- **Voraussetzung für:** Task 7.6 (GitHub Pages Deployment)
- **Blockiert durch:** Offene TypeScript-Fehler oder fehlgeschlagene Tests

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "chore: Task 7.5 - Production Build getestet und verifiziert"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 7.5 auf `✅ Erledigt` setzen.

