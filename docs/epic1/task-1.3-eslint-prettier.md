# Task 1.3 – ESLint + Prettier konfigurieren

> **Epic:** EPIC 1 – Projekt-Setup & Infrastruktur  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Eine einheitliche Code-Qualität und Formatierung durch ESLint (Linting) und Prettier (Formatierung) sicherstellen. Beide Tools sollen aufeinander abgestimmt sein, sodass es keine Konflikte zwischen Linting-Regeln und Formatierungsregeln gibt.

---

## 📋 Aufgaben

### 1. Prettier installieren

```bash
npm install --save-dev prettier eslint-config-prettier
```

- `prettier` – Der Formatter selbst
- `eslint-config-prettier` – Deaktiviert alle ESLint-Regeln, die mit Prettier kollidieren würden

### 2. `.prettierrc` anlegen

Datei im Projektstamm anlegen:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### 3. `.prettierignore` anlegen

```
node_modules
dist
dist-ssr
public
*.md
```

### 4. `eslint.config.js` erweitern

`eslint-config-prettier` am Ende der `extends`-Liste eintragen, damit Prettier-Regeln Vorrang haben:

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier,          // ← muss als letztes stehen
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
)
```

### 5. npm-Skripte ergänzen

In `package.json` folgende Skripte hinzufügen:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint . --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\"",
    "preview": "vite preview"
  }
}
```

### 6. Bestehende Dateien formatieren

```bash
npm run format
```

---

## ✅ Akzeptanzkriterien

- [ ] `npm run lint` läuft ohne Fehler durch
- [ ] `npm run format` formatiert alle Dateien unter `src/` korrekt
- [ ] `npm run format:check` meldet keine Abweichungen nach `npm run format`
- [ ] ESLint und Prettier haben keine widersprüchlichen Regeln (kein Konflikt-Output)
- [ ] `.prettierrc` und `.prettierignore` sind im Repository vorhanden
- [ ] `eslint.config.js` enthält `eslint-config-prettier` als letzten Eintrag

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Version | Typ |
|---|---|---|
| `prettier` | ^3.x | devDependency |
| `eslint-config-prettier` | ^9.x | devDependency |

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 1.1 muss abgeschlossen sein
- **Voraussetzung für:** Alle weiteren Tasks (saubere Code-Basis)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(setup): Task 1.3 - ESLint und Prettier konfigurieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 1.3 auf `✅ Erledigt` setzen.

