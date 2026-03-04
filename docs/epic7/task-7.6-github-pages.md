# Task 7.6 – GitHub Pages Deployment

> **Epic:** EPIC 7 – Testing & Deployment  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Die WebDesk-App wird per GitHub Actions automatisch auf GitHub Pages deployed. Nach Abschluss dieses Tasks ist die App unter einer öffentlichen URL erreichbar und jeder Push auf `main` löst ein automatisches Deployment aus.

---

## 📋 Aufgaben

### 1. Voraussetzungen prüfen

- [ ] Task 1.8 (GitHub Pages CI Grundkonfiguration) ist abgeschlossen
- [ ] `.github/workflows/deploy.yml` existiert im Repository
- [ ] `vite.config.ts` hat `base: '/WebDesk/'` gesetzt
- [ ] Task 7.5 (Production Build) wurde erfolgreich lokal getestet

### 2. GitHub Actions Workflow finalisieren

Den in Task 1.8 angelegten Workflow auf den finalen Stand bringen:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:    # ← Manueller Trigger über GitHub UI

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:run

      - name: TypeScript check
        run: npx tsc --noEmit

  build:
    runs-on: ubuntu-latest
    needs: test        # ← Build startet erst wenn Tests grün sind
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. GitHub Pages im Repository-Settings aktivieren

Im GitHub-Repository:
1. **Settings** → **Pages** öffnen
2. **Source**: `GitHub Actions` auswählen
3. **Save** klicken

> ⚠️ Wichtig: Nicht „Deploy from a branch" wählen – das überschreibt die Actions-Konfiguration.

### 4. Erste Deployment durchführen

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: finaler GitHub Actions Workflow mit Test-Job"
git push origin main
```

Dann unter `https://github.com/Andre0497/WebDesk/actions` den Workflow beobachten.

### 5. Deployment verifizieren

Nach erfolgreichem Workflow:

1. **Actions-Tab** → grüner Haken bei allen Jobs (test, build, deploy)
2. **Settings → Pages** → URL wird angezeigt: `https://andre0497.github.io/WebDesk/`
3. URL aufrufen und folgendes prüfen:

**Deployment-Checkliste:**
- [ ] App lädt ohne 404-Fehler
- [ ] CSS und JavaScript werden korrekt geladen (kein 404 in der Browser-Konsole)
- [ ] Favicons werden geladen
- [ ] Wallpaper-Hintergründe werden angezeigt
- [ ] localStorage funktioniert (Daten bleiben nach Refresh erhalten)
- [ ] Alle Animationen laufen korrekt

### 6. Häufige Deployment-Fehler

**Problem: Assets 404 auf GitHub Pages**
```typescript
// Ursache: base-URL fehlt in vite.config.ts
// Lösung:
export default defineConfig({
  base: '/WebDesk/',   // ← Repository-Name exakt (case-sensitive!)
  // ...
})
```

**Problem: Workflow schlägt beim Test-Job fehl**
```bash
# Lokal reproduzieren:
npm run test:run
# Fehler beheben, dann erneut pushen
```

**Problem: Deploy-Job: "Resource not accessible by integration"**
- Unter **Settings → Actions → General** → **Workflow permissions**
- `Read and write permissions` aktivieren

**Problem: Seite zeigt alten Stand**
- GitHub Pages cached aggressiv → Hard-Refresh: `Ctrl+Shift+R`
- Oder im Inkognito-Fenster testen

### 7. Automatisches Badge in README.md

Nach erstem erfolgreichem Deployment ein Status-Badge in `README.md` einfügen:

```markdown
[![Deploy to GitHub Pages](https://github.com/Andre0497/WebDesk/actions/workflows/deploy.yml/badge.svg)](https://github.com/Andre0497/WebDesk/actions/workflows/deploy.yml)
```

---

## ✅ Akzeptanzkriterien

- [ ] `.github/workflows/deploy.yml` enthält Test-, Build- und Deploy-Job
- [ ] GitHub Pages ist auf `GitHub Actions` als Source gesetzt
- [ ] Jeder Push auf `main` triggert den Workflow automatisch
- [ ] Alle drei Jobs (test, build, deploy) laufen grün durch
- [ ] App ist unter `https://andre0497.github.io/WebDesk/` erreichbar
- [ ] Keine Asset-404-Fehler in der Browser-Konsole
- [ ] Status-Badge ist in `README.md` eingebunden
- [ ] Manueller Trigger (`workflow_dispatch`) funktioniert

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.8 (GitHub Pages Grundkonfiguration)
- **Voraussetzung:** Task 7.5 (Production Build getestet)
- **Voraussetzung:** Tasks 7.1–7.2 (Tests müssen existieren)
- **Voraussetzung für:** Task 7.7 (README.md für das Projekt)
- **Parallel möglich mit:** Task 7.7

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "ci: Task 7.6 - GitHub Pages Deployment finalisiert"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 7.6 auf `✅ Erledigt` setzen.

