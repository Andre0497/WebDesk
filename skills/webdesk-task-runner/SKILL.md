---
name: webdesk-task-runner
description: Arbeitet WebDesk-Tasks aus docs/epic*/task-*.md strikt sequentiell ab. Verwenden, wenn der naechste Task umgesetzt werden soll und erst nach Abschluss des aktuellen fortgefahren werden darf.
---

# Workflow
1. Lese `docs/task-state.json` im Repository-Root.
2. Bearbeite ausschliesslich den Task aus `current`.
3. Starte keinen weiteren Task, solange `current` nicht als abgeschlossen markiert ist.

# Abschlusskriterien fuer `current`
- Alle Akzeptanzkriterien aus der Task-Datei sind umgesetzt.
- `npm run lint` laeuft ohne Fehler.
- `npm run build` laeuft ohne Fehler.
- Aktualisiere `skills/webdesk-task-runner/task-state.json`:
  - Fuege den abgeschlossenen Task in `done` ein.
  - Setze `current` auf den naechsten Task in numerischer Reihenfolge.

# Reihenfolge (nur Epic 1)
1. `docs/epic1/task-1.1-vite-react-ts.md`
2. `docs/epic1/task-1.2-tailwind.md`
3. `docs/epic1/task-1.3-eslint-prettier.md`
4. `docs/epic1/task-1.4-framer-motion.md`
5. `docs/epic1/task-1.5-dnd-kit.md`
6. `docs/epic1/task-1.6-heroicons-headlessui.md`
7. `docs/epic1/task-1.7-ordnerstruktur.md`
8. `docs/epic1/task-1.8-github-pages.md`

# Regeln
- Bearbeite exakt einen Task pro Lauf.
- Wenn `current` bereits in `done` enthalten ist, setze `current` auf den naechsten noch nicht erledigten Task aus Epic 1.
- Wenn alle Epic-1-Tasks erledigt sind, stoppe und melde "Epic 1 abgeschlossen".
