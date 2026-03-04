# Task 7.3 – Accessibility-Check

> **Epic:** EPIC 7 – Testing & Deployment  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Die WebDesk-App wird auf Barrierefreiheit (Accessibility / a11y) geprüft. Nach Abschluss dieses Tasks sind kritische WCAG-Verstöße behoben und die App erreicht einen Lighthouse-Accessibility-Score von mindestens 90.

---

## 📋 Aufgaben

### 1. axe-core für automatisierte a11y-Tests installieren

```bash
npm install --save-dev @axe-core/react axe-core vitest-axe
```

In `src/test/setup.ts` ergänzen:

```typescript
import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'
```

### 2. axe-Tests in Komponenten-Tests integrieren

**Beispiel in `src/components/modals/AddLinkModal.test.tsx`:**

```typescript
import { axe, toHaveNoViolations } from 'vitest-axe'
import { render } from '@testing-library/react'
import { AddLinkModal } from './AddLinkModal'

expect.extend(toHaveNoViolations)

it('hat keine axe-Accessibility-Verletzungen', async () => {
  const { container } = render(
    <AddLinkModal isOpen={true} onClose={() => {}} onAdd={() => {}} />
  )
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### 3. Lighthouse-Audit durchführen

Lighthouse ist in Chrome DevTools integriert:

1. `npm run dev` starten
2. Chrome öffnen → `http://localhost:5173`
3. DevTools öffnen (`F12`) → **Lighthouse**-Tab
4. **Accessibility** aktivieren, **Analyze page load** klicken
5. Score und Empfehlungen notieren

Alternativ über die CLI:

```bash
npx lighthouse http://localhost:5173 --only-categories=accessibility --output=html --output-path=./lighthouse-report.html
```

### 4. Häufige a11y-Probleme beheben

#### 4a. Bilder ohne `alt`-Text
```tsx
// ❌ Schlecht
<img src={faviconUrl} />

// ✅ Gut
<img src={faviconUrl} alt={`Favicon von ${name}`} />
```

#### 4b. Buttons ohne Label
```tsx
// ❌ Schlecht
<button onClick={onClose}>✕</button>

// ✅ Gut
<button onClick={onClose} aria-label="Modal schließen">✕</button>
```

#### 4c. Fehlende Formular-Labels
```tsx
// ❌ Schlecht
<input type="text" placeholder="URL eingeben" />

// ✅ Gut
<label htmlFor="url-input">URL</label>
<input id="url-input" type="text" placeholder="https://example.com" />
```

#### 4d. Kontrastverhältnis prüfen
- Text auf dunklem Hintergrund: Mindest-Kontrast **4.5:1** (normal), **3:1** (groß)
- Tool: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- In Tailwind CSS: Klassen wie `text-gray-200` auf `bg-gray-900` prüfen

#### 4e. Fokus-Management in Modals
```tsx
// Modal muss Fokus "einfangen" (focus trap)
// Headless UI <Dialog> erledigt das automatisch
import { Dialog } from '@headlessui/react'

<Dialog open={isOpen} onClose={onClose}>
  <Dialog.Panel>
    {/* Fokus wird automatisch auf erstes fokussierbares Element gesetzt */}
  </Dialog.Panel>
</Dialog>
```

#### 4f. Keyboard-Navigation
- Alle interaktiven Elemente müssen per `Tab` erreichbar sein
- Desktop-Icons: `role="button"` oder `<button>` verwenden, `tabIndex={0}` setzen
- Context Menu: Pfeiltasten-Navigation implementieren oder `role="menu"` + `role="menuitem"` nutzen

#### 4g. ARIA-Rollen für benutzerdefinierte Widgets
```tsx
// Desktop-Icon
<div
  role="button"
  tabIndex={0}
  aria-label={`${name} öffnen`}
  onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
>
  ...
</div>

// Context Menu
<ul role="menu" aria-label="Desktop-Kontextmenü">
  <li role="menuitem" onClick={handleNewLink}>Neuen Link hinzufügen</li>
</ul>
```

### 5. Farb- und Kontrast-Audit mit Tailwind

Farbpalette in `tailwind.config.ts` auf WCAG-Konformität prüfen:

```typescript
// Sicherstelllen dass Text-Farben ausreichend Kontrast haben
// text-white (#ffffff) auf bg-gray-800 (#1f2937) → Kontrast: 14.7:1 ✅
// text-gray-400 (#9ca3af) auf bg-gray-900 (#111827) → Kontrast: 6.6:1 ✅
// text-gray-500 (#6b7280) auf bg-gray-900 (#111827) → Kontrast: 4.1:1 ⚠️ (zu niedrig!)
```

### 6. Screen-Reader-Test (optional, aber empfohlen)

Mit dem kostenlosen Screen-Reader **NVDA** (Windows) testen:
1. [NVDA herunterladen](https://www.nvaccess.org/download/)
2. App in Chrome öffnen
3. Mit `Tab` durch die App navigieren
4. Auf sinnvolle Ansagen achten

---

## ✅ Akzeptanzkriterien

- [ ] Lighthouse Accessibility-Score ≥ 90
- [ ] Kein axe-Core-Fehler der Severity `critical` oder `serious` in kritischen Komponenten
- [ ] Alle `<img>`-Elemente haben sinnvolle `alt`-Attribute
- [ ] Alle Buttons haben ein sichtbares oder ARIA-Label
- [ ] Alle Formular-Felder sind mit `<label>` oder `aria-label` verknüpft
- [ ] Modals nutzen Headless UI `<Dialog>` mit automatischem Focus-Trap
- [ ] Keyboard-Navigation durch alle Haupt-Elemente ist möglich
- [ ] Kein Text unterschreitet das Kontrastverhältnis von 4.5:1 auf dem Hintergrund

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Tasks 2.1–2.7, 3.2–3.9 (UI-Komponenten müssen existieren)
- **Voraussetzung für:** Task 7.5 (Production Build testen)
- **Parallel möglich mit:** Tasks 7.1, 7.2, 7.4

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "a11y: Task 7.3 - Accessibility-Audit und axe-Core-Tests"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 7.3 auf `✅ Erledigt` setzen.

