# Task 4.7 – Kollisionsverhalten konfigurieren

> **Epic:** EPIC 4 – Drag & Drop  
> **Priorität:** 🟢 Niedrig  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Das Kollisionsverhalten des Drag-&-Drop-Systems verfeinern: Snap-to-Grid auf dem Desktop, optimierte Kollisionserkennung für den Ordner-Drop sowie eine saubere Trennung zwischen Desktop-DnD und Ordner-internem Sortieren. Nach diesem Task fühlt sich das DnD-System präzise und vorhersehbar an.

---

## 📋 Aufgaben

### 1. Kollisions-Algorithmen im Überblick

dnd-kit bietet mehrere eingebaute Algorithmen. Für WebDesk werden folgende eingesetzt:

| Kontext | Algorithmus | Begründung |
|---|---|---|
| Desktop-Grid (Task 4.3) | `rectIntersection` | Zellen-basiert, kein Mittelpunkt nötig |
| Drop in Ordner (Task 4.4) | `pointerWithin` + Fallback `rectIntersection` | Genauerer Treffer auf Icon-Ebene |
| Sortierung im Ordner (Task 4.6) | `closestCenter` | Standard für Sortable-Listen |

### 2. Custom Collision Detection für Desktop

Einen kombinierten Algorithmus anlegen, der Ordner-Drops bevorzugt gegenüber Grid-Zellen:

```tsx
// src/utils/dndCollision.ts
import {
  closestCenter,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  type CollisionDetection,
} from '@dnd-kit/core'

export const desktopCollisionDetection: CollisionDetection = (args) => {
  // Prüfe zuerst ob der Pointer direkt über einem Ordner-Drop-Target liegt
  const pointerCollisions = pointerWithin(args)
  const folderCollision = pointerCollisions.find(
    c => String(c.id).startsWith('folder-drop-')
  )
  if (folderCollision) return [folderCollision]

  // Ansonsten: nächste Grid-Zelle
  return rectIntersection(args)
}
```

```tsx
// DesktopCanvas.tsx
import { desktopCollisionDetection } from '../../utils/dndCollision'

<DndContext collisionDetection={desktopCollisionDetection} ...>
```

### 3. Snap-to-Grid implementieren

Icons sollen nach dem Drop exakt auf Grid-Positionen einrasten. Die Grid-Zell-Größe wird aus dem Store gelesen (`settings.gridSize`):

```tsx
// src/utils/snapToGrid.ts
export function snapToGrid(x: number, y: number, gridSize: number): [number, number] {
  return [
    Math.round(x / gridSize) * gridSize,
    Math.round(y / gridSize) * gridSize,
  ]
}
```

Da dnd-kit Grid-Positionen über die `data`-Property der Drop-Targets abbildet (col/row), ist ein explizites Snap in WebDesk nicht notwendig – das Ablegen in einer Grid-Zelle übernimmt das Einrasten automatisch. Der `snapToGrid`-Util kann jedoch für freie Positionierung (Task 4.7-Option B) genutzt werden.

### 4. Option B: Freie Positionierung (alternativ zu Grid)

Falls freie Positionierung statt Grid gewünscht wird, kann `modifiers` von dnd-kit genutzt werden:

```tsx
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

<DndContext modifiers={[restrictToWindowEdges]} ...>
```

Für ein reines Snap-to-Grid mit freier Positionierung:

```tsx
import { createSnapModifier } from '@dnd-kit/modifiers'

const snapToGridModifier = createSnapModifier(80) // 80px Grid-Raster

<DndContext modifiers={[snapToGridModifier, restrictToWindowEdges]} ...>
```

> **Empfehlung für WebDesk:** Grid-Zellen-basierter Ansatz (Option A) beibehalten – ist konsistenter mit dem Layout-System.

### 5. Randbehandlung: Icon außerhalb des Desktops

Wenn ein Icon über den Desktop-Rand hinaus gezogen wird, soll es an der letzten gültigen Position einrasten. Mit `restrictToParentElement` aus `@dnd-kit/modifiers`:

```tsx
import { restrictToParentElement } from '@dnd-kit/modifiers'

<DndContext modifiers={[restrictToParentElement]} ...>
```

> ⚠️ `@dnd-kit/modifiers` muss ggf. separat installiert werden: `npm install @dnd-kit/modifiers`

### 6. Performance-Optimierung

Bei vielen Icons (>50) kann die Kollisionserkennung träge werden. Optimierungen:
- `requestAnimationFrame` wird von dnd-kit intern bereits genutzt
- Grid-Zellen nur im sichtbaren Viewport als Droppable registrieren (Virtualisierung)
- `shouldSwap`-Logik aus Task 4.3 nur bei tatsächlichem Positionswechsel triggern

### 7. Abschließende Tests

| Szenario | Erwartetes Verhalten |
|---|---|
| Icon auf freie Zelle droppen | Rastet in Zelle ein |
| Icon auf belegte Zelle droppen | Items tauschen Position |
| Icon auf Ordner droppen | Item landet im Ordner |
| Icon über Rand hinaus droppen | Bleibt an letzter gültiger Position |
| Schnelles Drag & Drop | Kein visuelles Ruckeln, kein falsche Zielzelle |

---

## ✅ Akzeptanzkriterien

- [ ] Custom `desktopCollisionDetection` bevorzugt Ordner-Drop-Targets gegenüber Grid-Zellen
- [ ] `closestCenter` wird im Ordner-DndContext für Sortierung verwendet
- [ ] Icons rasten nach Drop exakt in Grid-Zellen ein (kein halb-daneben-Legen)
- [ ] `restrictToParentElement` oder äquivalente Logik verhindert Drop außerhalb des Desktops
- [ ] Kein TypeScript-Fehler
- [ ] `npm run build` erzeugt einen fehlerfreien Production-Build

---

## 📦 Vorausgesetzte Abhängigkeiten

| Paket | Version | Installiert in |
|---|---|---|
| `@dnd-kit/core` | ^6.x | Task 1.5 |
| `@dnd-kit/modifiers` | ^9.x | **Neu installieren** |

```bash
npm install @dnd-kit/modifiers
```

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 4.1–4.6 (alle vorherigen DnD-Tasks abgeschlossen)
- **Voraussetzung für:** Task 5.1 (Einblend-Animationen), EPIC 6 (Persistenz – Positionen werden korrekt gespeichert)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(dnd): Task 4.7 - Kollisionsverhalten und Snap-to-Grid konfigurieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 4.7 auf `✅ Erledigt` setzen.

