# Task 6.4 – JSON-Export

> **Epic:** EPIC 6 – State-Management & Persistenz  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Der Nutzer kann die komplette Desktop-Konfiguration (alle Items und Einstellungen) als `.json`-Datei herunterladen. Die Export-Funktion soll über einen Button in den Einstellungen (`SettingsModal`) aufrufbar sein.

---

## 📋 Aufgaben

### 1. `dataTransfer.ts` – Export-Hilfsfunktion anlegen

```typescript
// src/utils/dataTransfer.ts
import { DesktopItem } from '../types/desktop';
import { Settings, StoredData } from '../types/store';

/**
 * Serialisiert den aktuellen App-State als JSON-String.
 */
export function exportToJson(items: DesktopItem[], settings: Settings): string {
  const data: StoredData = {
    version: 1,
    state: { items, settings },
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Löst einen Browser-Download einer .json-Datei aus.
 */
export function downloadJson(jsonString: string, filename = 'webdesk-backup.json'): void {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

### 2. `exportData`-Action im Store nutzen

Die `exportData`-Action aus Task 6.1 ruft intern `exportToJson` auf:

```typescript
// src/store/desktopStore.ts (Anpassung)
import { exportToJson } from '../utils/dataTransfer';

// In der Store-Implementierung:
exportData: () => {
  const { items, settings } = get();
  return exportToJson(items, settings);
},
```

### 3. Export-Button in `SettingsModal` einbauen

```tsx
// src/components/modals/SettingsModal.tsx (Ausschnitt)
import { useDesktopStore } from '../../store';
import { downloadJson } from '../../utils/dataTransfer';

export function SettingsModal() {
  const { exportData } = useDesktopStore();

  const handleExport = () => {
    const json = exportData();
    // Dateiname mit aktuellem Datum
    const date = new Date().toISOString().split('T')[0];
    downloadJson(json, `webdesk-backup-${date}.json`);
  };

  return (
    // ... Modal-Wrapper ...
    <button onClick={handleExport}>
      💾 Konfiguration exportieren
    </button>
    // ...
  );
}
```

### 4. Dateiname dynamisch mit Datum

Das exportierte Dateiformat soll wie folgt aussehen:

```
webdesk-backup-2026-03-04.json
```

### 5. Exported JSON Struktur prüfen

Die heruntergeladene Datei soll folgendes Format haben:

```json
{
  "version": 1,
  "state": {
    "items": [
      {
        "id": "folder-dev",
        "type": "folder",
        "name": "Entwicklung",
        ...
      }
    ],
    "settings": {
      "wallpaper": "dark-space",
      "theme": "dark",
      "gridSize": 100,
      "showLabels": true
    }
  }
}
```

---

## ✅ Akzeptanzkriterien

- [ ] `src/utils/dataTransfer.ts` ist angelegt und exportiert `exportToJson` und `downloadJson`
- [ ] Klick auf Export-Button startet einen Browser-Download
- [ ] Die heruntergeladene Datei hat das Format `webdesk-backup-YYYY-MM-DD.json`
- [ ] Die JSON-Datei enthält alle aktuellen Items und Einstellungen vollständig
- [ ] Die JSON-Datei ist valide (kein `JSON.parse`-Fehler)
- [ ] Schema-Version `1` ist im Export enthalten
- [ ] `npm run build` ist fehlerfrei

---

## 📦 Abhängigkeiten (nach Task)

Keine neuen Pakete erforderlich. Die Export-Funktion nutzt nur native Browser-APIs (`Blob`, `URL.createObjectURL`).

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 6.1 (Store), Task 6.2 (localStorage), Task 3.1 (Typen)
- **Voraussetzung für:** Task 6.5 (Import – setzt kompatibles Format voraus)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(data): Task 6.4 - JSON-Export der Desktop-Konfiguration implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 6.4 auf `✅ Erledigt` setzen.

