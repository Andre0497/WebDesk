# 🛠 Tech-Stack – WebDesk

> Alle Entscheidungen mit Begründung

## Kernabhängigkeiten

| Paket | Version | Zweck | Begründung |
|---|---|---|---|
| `react` | ^18.3 | UI Framework | Größtes Ökosystem, Concurrent Mode für flüssige Animationen |
| `react-dom` | ^18.3 | DOM-Rendering | – |
| `typescript` | ^5.7 | Typsicherheit | Pflicht für wartbaren Code, Interface-Definitionen für Datenmodell |
| `vite` | ^6.x | Build Tool | Blitzschnelles HMR, optimiertes Production-Build, native ES-Modules |

## Styling

| Paket | Version | Zweck | Begründung |
|---|---|---|---|
| `tailwindcss` | ^4.x | Utility CSS | Kein CSS-Overhead, direkte Design-Token-Nutzung, Dark Mode einfach |
| `@tailwindcss/vite` | ^4.x | Vite-Integration | Offizielles Plugin für Tailwind v4 + Vite |

## Animationen

| Paket | Version | Zweck | Begründung |
|---|---|---|---|
| `framer-motion` | ^12.x | Animationen | Deklarativ, React-nativ, Layout-Animationen, spring physics |

## Drag & Drop

| Paket | Version | Zweck | Begründung |
|---|---|---|---|
| `@dnd-kit/core` | ^6.x | DnD-Basis | Accessible by default, kein jQuery, modular |
| `@dnd-kit/sortable` | ^8.x | Sortierbare Listen | Ordner-Inhalt sortierbar |
| `@dnd-kit/utilities` | ^3.x | Hilfsfunktionen | CSS-Transform-Utilities |

## UI-Komponenten & Icons

| Paket | Version | Zweck | Begründung |
|---|---|---|---|
| `@heroicons/react` | ^2.x | SVG-Icons | Konsistentes Icon-Set, direkt als React-Komponenten |
| `@headlessui/react` | ^2.x | Basis-Komponenten | Unstyled, accessible: Dialog, Menu, Transition |

## State & Persistenz

| Paket | Version | Zweck | Begründung |
|---|---|---|---|
| `zustand` | ^5.x | State Management | Ultra-leichtgewichtig, kein Boilerplate, React Concurrent-sicher |

## Testing

| Paket | Version | Zweck | Begründung |
|---|---|---|---|
| `vitest` | ^3.x | Test Runner | Vite-nativ, gleiche Config, Jest-kompatibel |
| `@testing-library/react` | ^16.x | Komponenten-Tests | Best Practice für React-Tests |
| `@testing-library/user-event` | ^14.x | User-Interaktionen simulieren | – |

## Dev-Tools

| Paket | Version | Zweck |
|---|---|---|
| `eslint` | ^9.x | Linting |
| `prettier` | ^3.x | Code-Formatierung |
| `@vitejs/plugin-react` | ^4.x | React Fast Refresh |

---

## Nicht verwendet (und warum)

| Paket | Grund |
|---|---|
| `redux` / `redux-toolkit` | Zu viel Boilerplate für diese App-Größe → `zustand` reicht |
| `react-router` | Keine mehrere Seiten nötig, alles in einer SPA-Ansicht |
| `axios` | Kein Backend, kein API-Calls nötig |
| `styled-components` | Tailwind übernimmt Styling, zusätzliche Runtime unnötig |
| `GSAP` | Framer Motion reicht für diese Use-Cases, kleiner Bundle |
| `next.js` | Kein SSR nötig, rein statisch → Vite SPA ist simpler |

