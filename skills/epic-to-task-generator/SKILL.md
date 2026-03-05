---
name: epic-to-task-generator
description: Erstellt aus einem Epic in docs/project-plan.md mehrere Task-Dateien im Format docs/epicX/task-*.md. Verwenden, wenn ein Epic in einzelne, umsetzbare Task-Dokumente mit Ziel, Aufgaben, Akzeptanzkriterien, Abhaengigkeiten und Abschlussschritten zerlegt werden soll.
---

# Workflow
1. Lese `docs/project-plan.md`.
2. Identifiziere genau ein Epic anhand der Ueberschrift `EPIC N` oder eines expliziten Epic-Namens.
3. Extrahiere aus der Task-Tabelle pro Zeile:
- `#` (Task-ID wie `3.4`)
- `Task` (kurzer Titel)
- `Beschreibung`
- `Prioritaet`
- `Status`
4. Lege den Zielordner `docs/epicN/` an, falls er fehlt.
5. Erzeuge pro Tabellenzeile eine Datei `docs/epicN/task-<id>-<slug>.md`.
6. Verwende als Inhalt die Struktur aus `references/task-template.md`.
7. Halte die Sprache der Dateien konsistent zu den bestehenden Docs (hier: Deutsch).

# Dateinamen-Regeln
- Verwende Task-ID in Kleinschreibung und mit Punkt, z. B. `task-2.7-...`.
- Bilde `slug` aus dem Task-Titel:
- alles klein
- Leerzeichen zu `-`
- nur `[a-z0-9-]`
- deutsche Umlaute ersetzen: `ae`, `oe`, `ue`, `ss`
- fuehrende/trailing `-` entfernen
- Beispiel: `Modal Basiskomponente` -> `modal-basiskomponente`

# Inhalts-Regeln
- Titelzeile: `# Task <id> - <Tasktitel>`
- Metadatenblock direkt darunter:
- `Epic: EPIC N - <Epic-Titel>`
- `Prioritaet: <Wert aus Tabelle>`
- `Status: <Wert aus Tabelle>`
- `Ziel`:
- Formuliere 1-3 saetze aus `Beschreibung` plus Epic-Ziel.
- `Aufgaben`:
- Erzeuge 4-8 konkrete Umsetzungsschritte.
- Nutze Dateinamen, Komponenten oder Befehle nur, wenn sie im Projekt plausibel sind.
- `Akzeptanzkriterien`:
- Erzeuge 5-8 checkbare Checkboxen (`- [ ] ...`).
- Keine vagen Aussagen.
- `Abhaengigkeiten zu anderen Tasks`:
- `Voraussetzung`: vorherige Task-ID im selben Epic oder `keine`.
- `Voraussetzung fuer`: naechste Task-ID im selben Epic oder `keine`.
- `Abschluss & Push`:
- Standardblock mit `git add .`, Conventional-Commit, `git push origin main`.
- Commit-Message-Format:
- `feat(epicN): Task <id> - <kurze Zusammenfassung>`
- Abschlusssatz:
- Status in `docs/project-plan.md` auf `Erledigt` setzen.

# Qualitaetssicherung
1. Erzeuge keine Duplikate: ueberschreibe nur auf expliziten Wunsch.
2. Pruefe fuer jede Task-Datei:
- Task-ID stimmt mit Tabelle ueberein.
- Dateiname passt zur ID und zum Slug.
- Epic-Nummer und Epic-Titel stimmen.
3. Wenn bereits Task-Dateien im Zielordner existieren:
- Nur fehlende Dateien anlegen, ausser der Nutzer fordert eine Regeneration.
4. Bei unklarer Tabellenzeile (fehlende ID oder Titel):
- stoppe und melde die konkrete Zeile.

# Ausgabe an den Nutzer
- Melde am Ende:
- erzeugte Dateien (vollstaendige Pfade),
- uebersprungene Dateien (bereits vorhanden),
- offene Punkte oder Inkonsistenzen in `project-plan.md`.
