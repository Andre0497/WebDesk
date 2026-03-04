# Task 6.3 – Initiale Demo-Daten

> **Epic:** EPIC 6 – State-Management & Persistenz  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Beim ersten Start der App – wenn noch kein `localStorage`-Eintrag existiert – werden sinnvolle Demo-Daten geladen. So sieht die App direkt nach dem ersten Öffnen nicht leer aus, sondern zeigt einen vorgebildeten Desktop mit Beispiel-Links und -Ordnern.

---

## 📋 Aufgaben

### 1. `defaultData.ts` anlegen

```typescript
// src/utils/defaultData.ts
import { DesktopItem, LinkItem, FolderItem } from '../types/desktop';
import { Settings } from '../types/store';

export const defaultSettings: Settings = {
  wallpaper: 'dark-space',
  theme: 'dark',
  gridSize: 100,
  showLabels: true,
};

export const defaultItems: DesktopItem[] = [
  // --- Ordner ---
  {
    id: 'folder-dev',
    type: 'folder',
    name: 'Entwicklung',
    color: '#6366f1',
    emoji: '💻',
    isOpen: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 0, row: 0 },
    parentId: null,
  } satisfies FolderItem,

  {
    id: 'folder-design',
    type: 'folder',
    name: 'Design',
    color: '#ec4899',
    emoji: '🎨',
    isOpen: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 1, row: 0 },
    parentId: null,
  } satisfies FolderItem,

  // --- Links auf dem Desktop-Root ---
  {
    id: 'link-github',
    type: 'link',
    name: 'GitHub',
    url: 'https://github.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 0, row: 1 },
    parentId: null,
  } satisfies LinkItem,

  {
    id: 'link-mdn',
    type: 'link',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=developer.mozilla.org',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 1, row: 1 },
    parentId: null,
  } satisfies LinkItem,

  {
    id: 'link-vercel',
    type: 'link',
    name: 'Vercel',
    url: 'https://vercel.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=vercel.com',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 2, row: 1 },
    parentId: null,
  } satisfies LinkItem,

  // --- Links im Ordner "Entwicklung" ---
  {
    id: 'link-vite',
    type: 'link',
    name: 'Vite',
    url: 'https://vitejs.dev',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=vitejs.dev',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 0, row: 0 },
    parentId: 'folder-dev',
  } satisfies LinkItem,

  {
    id: 'link-react',
    type: 'link',
    name: 'React Docs',
    url: 'https://react.dev',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=react.dev',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 1, row: 0 },
    parentId: 'folder-dev',
  } satisfies LinkItem,

  {
    id: 'link-tailwind',
    type: 'link',
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=tailwindcss.com',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 2, row: 0 },
    parentId: 'folder-dev',
  } satisfies LinkItem,

  // --- Links im Ordner "Design" ---
  {
    id: 'link-figma',
    type: 'link',
    name: 'Figma',
    url: 'https://figma.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=figma.com',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 0, row: 0 },
    parentId: 'folder-design',
  } satisfies LinkItem,

  {
    id: 'link-coolors',
    type: 'link',
    name: 'Coolors',
    url: 'https://coolors.co',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=coolors.co',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { col: 1, row: 0 },
    parentId: 'folder-design',
  } satisfies LinkItem,
];
```

### 2. Integration in `desktopStore.ts`

Die `persist`-Middleware initialisiert den Store automatisch mit dem `localStorage`-Wert, falls vorhanden. Andernfalls greift der Store-Default (`defaultItems`, `defaultSettings`):

```typescript
// src/store/desktopStore.ts
import { defaultItems, defaultSettings } from '../utils/defaultData';

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set, get) => ({
      items: defaultItems,       // ← nur beim allerersten Start genutzt
      settings: defaultSettings, // ← nur beim allerersten Start genutzt
      // ...Actions...
    }),
    { name: 'webdesk-data', version: 1 }
  )
);
```

> **Hinweis:** Die `persist`-Middleware überschreibt den initialen Store-State mit dem gespeicherten `localStorage`-Wert, falls der Schlüssel `webdesk-data` bereits existiert. Die `defaultItems` werden also nur beim allerersten Aufruf ohne vorhandenen Eintrag verwendet.

### 3. Funktionstest durchführen

1. `localStorage` im Browser leeren (DevTools → Application → Storage → Clear All)
2. App neu laden → Demo-Daten müssen erscheinen
3. App nach einem erneuten Reload → Daten aus `localStorage` müssen erscheinen (nicht erneut die Demo-Daten)

---

## ✅ Akzeptanzkriterien

- [ ] `src/utils/defaultData.ts` ist angelegt und exportiert `defaultItems` und `defaultSettings`
- [ ] Beim ersten Start (leerer `localStorage`) werden die Demo-Daten angezeigt
- [ ] Nach einem Refresh werden die zuletzt gespeicherten Daten (aus `localStorage`) geladen, nicht die Demo-Daten
- [ ] Mindestens 2 Demo-Ordner und 5 Demo-Links sind definiert
- [ ] Alle Demo-Items haben gültige `faviconUrl`-Werte (über Google Favicon Service)
- [ ] TypeScript ist fehlerfrei (`npm run build`)

---

## 📦 Abhängigkeiten (nach Task)

Keine neuen Pakete erforderlich.

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 6.1 (Store), Task 6.2 (localStorage), Task 3.1 (Datenmodell)
- **Voraussetzung für:** Task 6.6 (Reset), alle Icon-Komponenten in EPIC 3

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(data): Task 6.3 - Initiale Demo-Daten fuer ersten App-Start anlegen"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 6.3 auf `✅ Erledigt` setzen.

