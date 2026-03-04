# Task 7.1 – Unit Tests für Utility-Funktionen

> **Epic:** EPIC 7 – Testing & Deployment  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Alle wichtigen Utility-Funktionen in `src/utils/` werden mit Vitest unit-getestet. Nach Abschluss dieses Tasks laufen alle Tests ohne Fehler durch und die kritische Geschäftslogik ist durch automatisierte Tests abgesichert.

---

## 📋 Aufgaben

### 1. Vitest installieren & konfigurieren

```bash
npm install --save-dev vitest @vitest/ui jsdom
```

In `vite.config.ts` die Test-Konfiguration ergänzen:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

`src/test/setup.ts` anlegen:

```typescript
import '@testing-library/jest-dom'
```

In `tsconfig.app.json` ergänzen:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

`package.json` – Scripts ergänzen:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "coverage": "vitest run --coverage"
  }
}
```

### 2. Zu testende Utility-Funktionen identifizieren

Typische Kandidaten in `src/utils/`:

| Datei | Funktionen |
|---|---|
| `src/utils/storage.ts` | `loadFromStorage`, `saveToStorage` |
| `src/utils/favicon.ts` | `getFaviconUrl`, `extractDomain` |
| `src/utils/items.ts` | `createLinkItem`, `createFolderItem`, `generateId` |
| `src/utils/export.ts` | `exportToJson`, `importFromJson`, `validateImport` |
| `src/utils/grid.ts` | `findFreeCell`, `snapToGrid`, `isPositionOccupied` |

### 3. Test-Dateien anlegen

Tests neben den zu testenden Dateien ablegen (Convention: `*.test.ts`):

```
src/utils/
├── storage.ts
├── storage.test.ts
├── favicon.ts
├── favicon.test.ts
├── items.ts
├── items.test.ts
├── export.ts
└── export.test.ts
```

### 4. Beispiel-Tests

**`src/utils/items.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest'
import { createLinkItem, createFolderItem, generateId } from './items'

describe('generateId', () => {
  it('erzeugt eine nicht-leere Zeichenkette', () => {
    expect(generateId()).toBeTruthy()
  })

  it('erzeugt eindeutige IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('createLinkItem', () => {
  it('erstellt ein LinkItem mit korrekten Standardwerten', () => {
    const item = createLinkItem({ url: 'https://example.com', name: 'Example' })
    expect(item.type).toBe('link')
    expect(item.url).toBe('https://example.com')
    expect(item.name).toBe('Example')
    expect(item.id).toBeTruthy()
  })
})

describe('createFolderItem', () => {
  it('erstellt ein FolderItem mit korrekten Standardwerten', () => {
    const folder = createFolderItem({ name: 'Arbeit' })
    expect(folder.type).toBe('folder')
    expect(folder.name).toBe('Arbeit')
    expect(folder.children).toEqual([])
  })
})
```

**`src/utils/favicon.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest'
import { getFaviconUrl, extractDomain } from './favicon'

describe('extractDomain', () => {
  it('extrahiert Domain aus einer vollständigen URL', () => {
    expect(extractDomain('https://www.google.com/search?q=test')).toBe('www.google.com')
  })

  it('funktioniert ohne Protokoll-Präfix', () => {
    expect(extractDomain('google.com')).toBe('google.com')
  })

  it('gibt leeren String bei ungültiger URL zurück', () => {
    expect(extractDomain('')).toBe('')
  })
})

describe('getFaviconUrl', () => {
  it('gibt korrekte Google Favicon Service URL zurück', () => {
    const url = getFaviconUrl('https://github.com')
    expect(url).toContain('google.com/s2/favicons')
    expect(url).toContain('github.com')
    expect(url).toContain('sz=64')
  })
})
```

**`src/utils/storage.test.ts`:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { loadFromStorage, saveToStorage } from './storage'

describe('localStorage Utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('speichert und liest Daten korrekt', () => {
    const data = { items: ['a', 'b'] }
    saveToStorage('test-key', data)
    expect(loadFromStorage('test-key')).toEqual(data)
  })

  it('gibt null zurück wenn Schlüssel nicht existiert', () => {
    expect(loadFromStorage('nicht-vorhanden')).toBeNull()
  })

  it('gibt null zurück bei ungültigem JSON', () => {
    localStorage.setItem('bad-key', '{invalid json}')
    expect(loadFromStorage('bad-key')).toBeNull()
  })
})
```

### 5. Coverage-Report einrichten

```bash
npm install --save-dev @vitest/coverage-v8
```

```bash
npm run coverage
```

Ziel: Mindestens **70 % Statement Coverage** für `src/utils/`.

---

## ✅ Akzeptanzkriterien

- [ ] `npm test` läuft ohne Fehler durch
- [ ] `npm run test:run` gibt grüne Ergebnisse aus
- [ ] Alle `src/utils/`-Funktionen haben mind. einen positiven und einen Negativ-Test
- [ ] `generateId` wird auf Eindeutigkeit getestet
- [ ] `createLinkItem` und `createFolderItem` werden auf korrekte Felder getestet
- [ ] `extractDomain` und `getFaviconUrl` sind getestet
- [ ] `loadFromStorage` / `saveToStorage` sind mit jsdom-`localStorage` getestet
- [ ] Coverage-Report zeigt ≥ 70 % für `src/utils/`

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Tasks 3.1, 6.1, 6.2 (Utility-Funktionen müssen existieren)
- **Voraussetzung für:** Task 7.5 (Production Build testen)
- **Parallel möglich mit:** Task 7.2 (Komponenten-Tests)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "test(utils): Task 7.1 - Unit Tests fuer Utility-Funktionen mit Vitest"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 7.1 auf `✅ Erledigt` setzen.

