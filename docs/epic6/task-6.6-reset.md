# Task 6.6 – Reset / Werkseinstellungen

> **Epic:** EPIC 6 – State-Management & Persistenz  
> **Priorität:** 🟢 Niedrig  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Der Nutzer kann über die Einstellungen alle gespeicherten Daten löschen und die App auf den Ausgangszustand mit den Demo-Daten zurücksetzen. Die Funktion entspricht einem „Werksreset" und löscht dabei sowohl den Zustand-Store als auch den `localStorage`-Eintrag.

---

## 📋 Aufgaben

### 1. `resetToDefaults`-Action im Store implementieren

Die Action ist bereits in Task 6.1 als Platzhalter definiert. Hier wird sie vollständig implementiert:

```typescript
// src/store/desktopStore.ts (Anpassung)
import { defaultItems, defaultSettings } from '../utils/defaultData';

// In der Store-Implementierung:
resetToDefaults: () => {
  // localStorage-Eintrag explizit löschen, damit persist neu schreibt
  localStorage.removeItem('webdesk-data');
  // Store auf Demo-Daten zurücksetzen
  set({ items: defaultItems, settings: defaultSettings });
},
```

> **Hinweis:** `localStorage.removeItem('webdesk-data')` ist notwendig, weil `persist` sonst beim nächsten Render wieder den alten Wert lädt. Das anschließende `set(...)` schreibt den neuen State sofort zurück.

### 2. Reset-Button in `SettingsModal` einbauen

```tsx
// src/components/modals/SettingsModal.tsx (Ausschnitt)
import { useDesktopStore } from '../../store';
import { useUIStore } from '../../store';

export function SettingsModal() {
  const { resetToDefaults } = useDesktopStore();
  const { closeModal } = useUIStore();

  const handleReset = () => {
    const confirmed = window.confirm(
      '⚠️ Achtung: Alle deine gespeicherten Links und Ordner werden unwiderruflich gelöscht und durch die Demo-Daten ersetzt. Fortfahren?'
    );
    if (!confirmed) return;

    resetToDefaults();
    closeModal();
  };

  return (
    // ... Modal-Wrapper ...
    <button
      onClick={handleReset}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
    >
      🗑️ Zurücksetzen auf Werkseinstellungen
    </button>
    // ...
  );
}
```

### 3. Visuelles Feedback nach dem Reset

Nach dem Reset soll das Modal geschlossen werden und der Desktop die Demo-Daten anzeigen. Optional kann ein kurzes Toast-/Benachrichtigungs-Element eingeblendet werden:

```tsx
// Optionales Toast-Feedback (einfache Variante mit setTimeout)
const handleReset = () => {
  const confirmed = window.confirm('...');
  if (!confirmed) return;

  resetToDefaults();
  closeModal();

  // Kurze visuelle Rückmeldung (optional, kann als eigene Komponente ausgebaut werden)
  const toast = document.createElement('div');
  toast.textContent = '✅ Werkseinstellungen wiederhergestellt';
  toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-700 text-white px-4 py-2 rounded-lg z-50';
  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 3000);
};
```

### 4. `ConfirmModal` aus Task 3.9 integrieren (empfohlen)

Sobald der `ConfirmModal` aus Task 3.9 fertig ist, den `window.confirm`-Aufruf durch den modalen Dialog ersetzen:

```tsx
// Variante mit ConfirmModal (nach Fertigstellung von Task 3.9)
const { openModal } = useUIStore();

const handleResetClick = () => {
  openModal('confirm', null);
  // Im ConfirmModal wird dann resetToDefaults() als onConfirm übergeben
};
```

### 5. Sicherheitsstufen des Resets

Der Reset soll folgende Reihenfolge einhalten:

1. **Bestätigung einholen** (Dialog/Modal)
2. **`localStorage.removeItem('webdesk-data')`** ausführen
3. **Store auf `defaultItems` und `defaultSettings` setzen**
4. **Modal schließen**
5. **Visuelles Feedback** geben (optional)

---

## ✅ Akzeptanzkriterien

- [ ] `resetToDefaults`-Action ist vollständig in `desktopStore.ts` implementiert
- [ ] Klick auf Reset-Button öffnet einen Bestätigungs-Dialog
- [ ] Nach Bestätigung werden alle eigenen Daten gelöscht und Demo-Daten geladen
- [ ] Nach einem Browser-Refresh nach dem Reset sind weiterhin die Demo-Daten vorhanden (kein alter `localStorage`-Inhalt)
- [ ] Das `SettingsModal` schließt sich nach dem Reset
- [ ] Abbruch des Bestätigungs-Dialogs bewirkt keinerlei Änderung
- [ ] Der Reset-Button ist visuell als destruktive Aktion erkennbar (z. B. roter Button)
- [ ] `npm run build` ist fehlerfrei

---

## 📦 Abhängigkeiten (nach Task)

Keine neuen Pakete erforderlich.

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 6.1 (Store), Task 6.2 (localStorage), Task 6.3 (Demo-Daten)
- **Empfohlen:** Task 3.9 (ConfirmModal – für bessere UX statt `window.confirm`)
- **Blockiert durch keine weiteren Tasks**

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(data): Task 6.6 - Reset auf Werkseinstellungen mit Demo-Daten implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 6.6 auf `✅ Erledigt` setzen.

