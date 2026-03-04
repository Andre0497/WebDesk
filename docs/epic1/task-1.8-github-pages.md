# Task 1.8 – GitHub Repository & GitHub Pages CI anlegen

> **Epic:** EPIC 1 – Projekt-Setup & Infrastruktur  
> **Priorität:** 🟢 Niedrig  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Einen automatisierten CI/CD-Workflow mit GitHub Actions einrichten, der bei jedem Push auf `main` die App baut und auf GitHub Pages deployed. Nach Abschluss dieses Tasks ist WebDesk unter einer öffentlichen URL erreichbar.

---

## 📋 Aufgaben

### 1. `vite.config.ts` – Base-URL für GitHub Pages anpassen

GitHub Pages hostet das Projekt unter einem Unterverzeichnis (`/WebDesk/`). Vite muss das wissen:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/WebDesk/',   // ← Repository-Name
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### 2. GitHub Actions Workflow anlegen

Datei anlegen unter `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
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

### 3. GitHub Pages im Repository aktivieren

Im GitHub-Repository unter **Settings → Pages**:
- **Source:** `GitHub Actions` auswählen (nicht `Deploy from a branch`)

### 4. SPA-Routing Fix für GitHub Pages

Da GitHub Pages bei direktem Aufruf von Unterseiten einen 404 zurückgibt, eine `public/404.html` anlegen:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>WebDesk</title>
    <script>
      // Redirect to index with path as query parameter
      var path = window.location.pathname.replace('/WebDesk', '')
      window.location.replace('/WebDesk/?p=' + encodeURIComponent(path))
    </script>
  </head>
  <body></body>
</html>
```

> **Hinweis:** Da WebDesk eine Single-Page-App ohne React Router ist, ist dieser Schritt optional – es gibt keine tiefen URLs.

### 5. Deployment verifizieren

Nach dem ersten Push:
1. Im GitHub-Repository unter **Actions** den Workflow-Run beobachten
2. Nach erfolgreichem Build die URL aufrufen: `https://andre0497.github.io/WebDesk/`
3. Prüfen: App lädt korrekt, keine Asset-404-Fehler in der Browser-Konsole

---

## ✅ Akzeptanzkriterien

- [ ] `.github/workflows/deploy.yml` ist im Repository vorhanden
- [ ] GitHub Pages ist unter **Settings → Pages** auf `GitHub Actions` gesetzt
- [ ] Nach Push auf `main` startet der Workflow automatisch
- [ ] Build-Job läuft ohne Fehler durch
- [ ] Deploy-Job läuft ohne Fehler durch
- [ ] App ist unter `https://andre0497.github.io/WebDesk/` erreichbar
- [ ] Keine Asset-404-Fehler in der Browser-Konsole
- [ ] `vite.config.ts` hat `base: '/WebDesk/'` gesetzt

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.1 (Projekt-Setup) muss abgeschlossen sein
- **Voraussetzung für:** Task 7.6 (finales Deployment nach EPIC 7)
- **Parallel möglich mit:** Tasks 1.2–1.7

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(ci): Task 1.8 - GitHub Actions Workflow fuer GitHub Pages Deployment"
git push origin main
```

Den Workflow-Run unter `https://github.com/Andre0497/WebDesk/actions` beobachten und auf erfolgreichen Abschluss warten.

Danach in `docs/project-plan.md` den Status von Task 1.8 auf `✅ Erledigt` setzen.

