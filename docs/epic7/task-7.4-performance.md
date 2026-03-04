# Task 7.4 – Performance-Optimierung

> **Epic:** EPIC 7 – Testing & Deployment  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Die WebDesk-App wird auf Performance analysiert und optimiert. Nach Abschluss dieses Tasks lädt die App schnell, unnötiger Code wird nicht im initialen Bundle mitgeliefert, und der Lighthouse Performance-Score beträgt mindestens 85.

---

## 📋 Aufgaben

### 1. Bundle-Analyse mit `rollup-plugin-visualizer`

```bash
npm install --save-dev rollup-plugin-visualizer
```

`vite.config.ts` ergänzen:

```typescript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-stats.html',
      open: true,       // öffnet Report automatisch nach Build
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

Build starten und Report analysieren:

```bash
npm run build
# → dist/bundle-stats.html wird automatisch geöffnet
```

Kritisch: Pakete die > 50 KB (gzip) einnehmen identifizieren.

### 2. Code-Splitting mit React.lazy & Suspense

Große Komponenten werden lazy-loaded, damit sie nicht im initialen Bundle landen:

```typescript
// src/App.tsx – Vorher (alles synchron)
import { FolderWindow } from './components/windows/FolderWindow'
import { AddLinkModal } from './components/modals/AddLinkModal'
import { AddFolderModal } from './components/modals/AddFolderModal'
import { EditItemModal } from './components/modals/EditItemModal'

// ✅ Nachher (lazy-loaded)
import { lazy, Suspense } from 'react'

const FolderWindow = lazy(() => import('./components/windows/FolderWindow'))
const AddLinkModal = lazy(() => import('./components/modals/AddLinkModal'))
const AddFolderModal = lazy(() => import('./components/modals/AddFolderModal'))
const EditItemModal = lazy(() => import('./components/modals/EditItemModal'))

// Verwendung mit Suspense:
<Suspense fallback={<div className="modal-loading" />}>
  {openModal === 'addLink' && <AddLinkModal ... />}
</Suspense>
```

### 3. React.memo für Desktop-Icons

Icons auf dem Desktop werden bei jedem State-Update neu gerendert. `React.memo` verhindert unnötige Re-Renders:

```typescript
// src/components/icons/LinkIcon.tsx
export const LinkIcon = React.memo(({ id, name, url, position }: LinkIconProps) => {
  // ...
})

// src/components/icons/FolderIcon.tsx
export const FolderIcon = React.memo(({ id, name, children, position }: FolderIconProps) => {
  // ...
})
```

### 4. useMemo & useCallback für teure Berechnungen

```typescript
// src/components/desktop/DesktopCanvas.tsx
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.position.row - b.position.row || a.position.col - b.position.col),
  [items]
)

const handleDragEnd = useCallback((event: DragEndEvent) => {
  // ... Drag-Handler
}, [dispatch])
```

### 5. Bilder & Assets optimieren

**Wallpaper-Bilder:**
- Format: WebP statt JPEG/PNG verwenden (30–50 % kleinere Dateien)
- Größe: Max. 1920×1080 px, Qualität 80 %
- Lazy-Loading für nicht-aktive Wallpapers:

```typescript
// Wallpaper wird nur geladen wenn ausgewählt
const wallpaperUrl = useMemo(
  () => selectedWallpaper ? `/wallpapers/${selectedWallpaper}.webp` : null,
  [selectedWallpaper]
)
```

**Favicons werden gecacht:**
```typescript
// src/utils/favicon.ts
const faviconCache = new Map<string, string>()

export const getFaviconUrl = (url: string): string => {
  const domain = extractDomain(url)
  if (faviconCache.has(domain)) return faviconCache.get(domain)!
  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
  faviconCache.set(domain, faviconUrl)
  return faviconUrl
}
```

### 6. Framer Motion Tree-Shaking sicherstellen

Nur benötigte Framer-Motion-Exporte importieren:

```typescript
// ❌ Schlecht – lädt alles
import * as motion from 'framer-motion'

// ✅ Gut – Tree-Shaking greift
import { motion, AnimatePresence } from 'framer-motion'
```

### 7. Lighthouse Performance-Audit

1. `npm run build && npm run preview`
2. Chrome → `http://localhost:4173`
3. DevTools → Lighthouse → **Performance** → Analyze

**Ziel-Metriken:**
| Metrik | Zielwert |
|---|---|
| First Contentful Paint (FCP) | < 1.5 s |
| Largest Contentful Paint (LCP) | < 2.5 s |
| Total Blocking Time (TBT) | < 200 ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Lighthouse Score | ≥ 85 |

### 8. `vite.config.ts` – Build-Optimierungen

```typescript
export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
  },
})
```

---

## ✅ Akzeptanzkriterien

- [ ] Bundle-Analyse wurde durchgeführt (Visualizer-Report vorhanden)
- [ ] Modals und `FolderWindow` sind lazy-loaded
- [ ] `LinkIcon` und `FolderIcon` sind mit `React.memo` optimiert
- [ ] `manualChunks` trennen Vendor-Bundles von App-Code
- [ ] Lighthouse Performance-Score ≥ 85 (auf `npm run preview`)
- [ ] FCP < 1.5 s, LCP < 2.5 s
- [ ] Kein einzelnes Chunk ist größer als 200 KB (gzip)

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Alle EPIC 2–6 Tasks (App muss vollständig sein)
- **Voraussetzung für:** Task 7.5 (Production Build testen), Task 7.6 (Deployment)
- **Parallel möglich mit:** Tasks 7.1, 7.2, 7.3

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "perf: Task 7.4 - Performance-Optimierung mit Code-Splitting und React.memo"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 7.4 auf `✅ Erledigt` setzen.

