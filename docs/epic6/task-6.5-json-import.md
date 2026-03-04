# Task 6.5 – JSON-Import

> **Epic:** EPIC 6 – State-Management & Persistenz  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Der Nutzer kann eine zuvor exportierte `.json`-Konfigurationsdatei hochladen und damit den Desktop-Zustand wiederherstellen. Der Import ersetzt den aktuellen Store-State vollständig. Fehlerhafte oder inkompatible Dateien werden mit einer verständlichen Fehlermeldung abgelehnt.

---

## 📋 Aufgaben

### 1. `importFromJson`-Funktion in `dataTransfer.ts` ergänzen

```typescript
// src/utils/dataTransfer.ts (Ergänzung)
import { StoredData } from '../types/store';

/**
 * Parst einen JSON-String und gibt den validierten StoredData-Inhalt zurück.
 * Wirft einen Fehler, wenn das Format ungültig ist.
 */
export function importFromJson(jsonString: string): StoredData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Ungültiges JSON-Format. Bitte eine gültige WebDesk-Backup-Datei wählen.');
  }

  // Basis-Validierung der Struktur
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('version' in parsed) ||
    !('state' in parsed)
  ) {
    throw new Error('Unbekanntes Dateiformat. Fehlende Felder: version, state.');
  }

  const data = parsed as StoredData;

  if (!Array.isArray(data.state?.items)) {
    throw new Error('Ungültige Dateistruktur: state.items ist kein Array.');
  }

  if (typeof data.state?.settings !== 'object') {
    throw new Error('Ungültige Dateistruktur: state.settings fehlt.');
  }

  return data;
}
```

### 2. `importData`-Action im Store aufrufen

```typescript
// src/store/desktopStore.ts (Anpassung)
import { importFromJson } from '../utils/dataTransfer';

// In der Store-Implementierung:
importData: (json) => {
  try {
    const data = importFromJson(json);
    set({ items: data.state.items, settings: data.state.settings });
  } catch (e) {
    console.error('Import fehlgeschlagen:', e);
    // Fehler nach oben weitergeben, damit die UI eine Meldung zeigen kann
    throw e;
  }
},
```

### 3. Import-UI in `SettingsModal` einbauen

```tsx
// src/components/modals/SettingsModal.tsx (Ausschnitt)
import { useRef, useState } from 'react';
import { useDesktopStore } from '../../store';

export function SettingsModal() {
  const { importData } = useDesktopStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      try {
        importData(json);
        setImportSuccess(true);
        setImportError(null);
      } catch (err) {
        setImportError((err as Error).message);
        setImportSuccess(false);
      }
    };
    reader.readAsText(file);
    // Input zurücksetzen, damit dieselbe Datei erneut gewählt werden kann
    e.target.value = '';
  };

  return (
    // ... Modal-Wrapper ...
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
      <button onClick={handleImportClick}>
        📂 Konfiguration importieren
      </button>

      {importError && (
        <p className="text-red-400 text-sm mt-2">{importError}</p>
      )}
      {importSuccess && (
        <p className="text-green-400 text-sm mt-2">Import erfolgreich!</p>
      )}
    </>
    // ...
  );
}
```

### 4. Confirm-Dialog vor dem Überschreiben

Da der Import den aktuellen State vollständig ersetzt, soll ein Bestätigungs-Dialog angezeigt werden:

```tsx
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const confirmed = window.confirm(
    'Achtung: Der Import überschreibt alle aktuellen Daten. Fortfahren?'
  );
  if (!confirmed) {
    e.target.value = '';
    return;
  }

  // ... FileReader-Logik ...
};
```

> **Hinweis:** In einer späteren Iteration kann `window.confirm` durch den `ConfirmModal` aus Task 3.9 ersetzt werden.

### 5. Verhalten nach erfolgreichem Import

- Der Store wird mit den importierten Daten aktualisiert
- Die `persist`-Middleware speichert den neuen State sofort in den `localStorage`
- Das `SettingsModal` bleibt geöffnet und zeigt eine Erfolgsmeldung

---

## ✅ Akzeptanzkriterien

- [ ] `importFromJson` in `dataTransfer.ts` ist implementiert und validiert die Dateistruktur
- [ ] Eine gültige Export-Datei aus Task 6.4 kann erfolgreich importiert werden
- [ ] Nach dem Import sind alle importierten Items und Einstellungen im Store vorhanden
- [ ] Nach einem Browser-Refresh bleiben die importierten Daten erhalten (via `localStorage`)
- [ ] Ungültige JSON-Dateien zeigen eine verständliche Fehlermeldung in der UI
- [ ] Vor dem Überschreiben erscheint ein Bestätigungs-Dialog
- [ ] Der Datei-Input akzeptiert nur `.json`-Dateien
- [ ] `npm run build` ist fehlerfrei

---

## 📦 Abhängigkeiten (nach Task)

Keine neuen Pakete erforderlich.

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 6.1 (Store), Task 6.2 (localStorage), Task 6.4 (Export – kompatibles Format)
- **Voraussetzung für:** Task 6.6 (Reset – ähnliche UI-Muster)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(data): Task 6.5 - JSON-Import der Desktop-Konfiguration implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 6.5 auf `✅ Erledigt` setzen.

