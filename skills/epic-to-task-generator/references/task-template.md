# Task {{TASK_ID}} - {{TASK_TITEL}}

> **Epic:** EPIC {{EPIC_NUMMER}} - {{EPIC_TITEL}}  
> **Prioritaet:** {{PRIORITAET}}  
> **Status:** {{STATUS}}

---

## Ziel

{{ZIELTEXT_1_BIS_3_SAETZE}}

---

## Aufgaben

### 1. Analyse und Vorbereitung
- {{AUFGABE_1}}
- {{AUFGABE_2}}

### 2. Implementierung
- {{AUFGABE_3}}
- {{AUFGABE_4}}

### 3. Absicherung
- {{AUFGABE_5}}
- {{AUFGABE_6_OPTIONAL}}

---

## Akzeptanzkriterien

- [ ] {{KRITERIUM_1}}
- [ ] {{KRITERIUM_2}}
- [ ] {{KRITERIUM_3}}
- [ ] {{KRITERIUM_4}}
- [ ] {{KRITERIUM_5}}

---

## Abhaengigkeiten zu anderen Tasks

- **Voraussetzung:** {{VORHERIGE_TASK_ODER_KEINE}}
- **Voraussetzung fuer:** {{NAECHSTE_TASK_ODER_KEINE}}

---

## Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(epic{{EPIC_NUMMER}}): Task {{TASK_ID}} - {{KURZE_ZUSAMMENFASSUNG}}"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task {{TASK_ID}} auf `Erledigt` setzen.
