# Task 6.2 – localStorage Synchronisation

> **Epic:** EPIC 6 – State-Management & Persistenz  
> **Priorität:** 🔴 Hoch  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Den Zustand des `desktopStore` automatisch mit dem `localStorage` des Browsers synchronisieren. Alle Desktop-Items und Einstellungen sollen einen Browser-Refresh überleben. Die Implementierung erfolgt über die eingebaute `zustand/middleware`-Lösung (`persist`) sowie einen eigenen `useLocalStorage`-Hook für allgemeine Fälle.

---

## 📋 Aufgaben

### 1. `persist`-Middleware in `desktopStore.ts` einbinden

Zustand bietet eine eingebaute `persist`-Middleware, die den Store automatisch serialisiert und im `localStorage` speichert:

```typescript
// src/store/desktopStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DesktopItem, LinkItem, FolderItem } from '../types/desktop';
import { defaultItems, defaultSettings } from '../utils/defaultData';

// ... Interface-Definitionen wie in Task 6.1 ...

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set, get) => ({
      items: defaultItems,
      settings: defaultSettings,

      // ... alle Actions wie in Task 6.1 ...
    }),
    {
      name: 'webdesk-data',   // localStorage-Schlüssel
      version: 1,             // Schema-Version für spätere Migrationen
    }
  )
);
```

### 2. Schema-Version & Migration vorbereiten

Die `version`-Option der `persist`-Middleware erlaubt Daten-Migrationen bei Breaking Changes:

```typescript
persist(
  (set, get) => ({ /* ... */ }),
  {
    name: 'webdesk-data',
    version: 1,
    migrate: (persistedState: unknown, version: number) => {
      if (version === 0) {
        // Migration von Version 0 → 1
        // z. B. neues Feld hinzufügen
        const state = persistedState as DesktopState;
        return {
          ...state,
          settings: {
            ...state.settings,
            showLabels: true, // neues Feld mit Default-Wert
          },
        };
      }
      return persistedState as DesktopState;
    },
  }
)
```

### 3. Custom Hook `useLocalStorage.ts` anlegen

Für einfachere Fälle (z. B. einzelne Einstellungen außerhalb des Stores) einen generischen Hook anlegen:

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Fehler beim Lesen von localStorage[${key}]:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Fehler beim Schreiben in localStorage[${key}]:`, error);
    }
  };

  // Synchronisation bei Tab-Wechsel (storage event)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // ignorieren
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
```

### 4. `StoredData`-Interface in `src/types/store.ts` definieren

```typescript
// src/types/store.ts
import { DesktopItem } from './desktop';

export interface Settings {
  wallpaper: string;
  theme: 'dark' | 'light';
  gridSize: number;
  showLabels: boolean;
}

/** Schema des localStorage-Eintrags 'webdesk-data' */
export interface StoredData {
  version: number;
  state: {
    items: DesktopItem[];
    settings: Settings;
  };
}
```

### 5. Überprüfung im Browser (DevTools)

Nach dem Start der App im Browser prüfen:
- **Application → Local Storage → localhost** → Eintrag `webdesk-data` muss vorhanden sein
- Nach einer Änderung (z. B. Item hinzufügen) soll der Eintrag sofort aktualisiert werden
- Nach einem Browser-Refresh müssen alle Items noch vorhanden sein

---

## ✅ Akzeptanzkriterien

- [ ] `zustand/middleware` `persist` ist korrekt in `desktopStore` eingebunden
- [ ] Nach einem Browser-Refresh sind alle Desktop-Items und Einstellungen wiederhergestellt
- [ ] Der `localStorage`-Schlüssel lautet `webdesk-data`
- [ ] `useLocalStorage`-Hook ist in `src/hooks/useLocalStorage.ts` implementiert und typsicher
- [ ] Schema-Version `1` ist gesetzt; `migrate`-Funktion ist als Platzhalter vorbereitet
- [ ] `StoredData`-Interface ist in `src/types/store.ts` definiert
- [ ] `npm run build` ist fehlerfrei

---

## 📦 Abhängigkeiten (nach Task)

| Paket | Version | Typ | Hinweis |
|---|---|---|---|
| `zustand` | ^5.x | dependency | Bereits durch Task 6.1 installiert |

> Die `persist`-Middleware ist Teil von `zustand` und erfordert keine zusätzliche Installation.

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 6.1 (Zustand-Store)
- **Voraussetzung für:** Task 6.3 (Demo-Daten), Task 6.4 (Export), Task 6.5 (Import), Task 6.6 (Reset)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(store): Task 6.2 - localStorage Synchronisation mit zustand persist-Middleware"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 6.2 auf `✅ Erledigt` setzen.

