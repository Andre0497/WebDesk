import type { DesktopItem } from '../types/desktop'
import type { Settings, StoredData } from '../types/store'

/**
 * Parst einen JSON-String und gibt den validierten StoredData-Inhalt zurück.
 * Wirft einen Fehler, wenn das Format ungültig ist.
 */
export function importFromJson(jsonString: string): StoredData {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    throw new Error('Ungültiges JSON-Format. Bitte eine gültige WebDesk-Backup-Datei wählen.')
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('version' in parsed) ||
    !('state' in parsed)
  ) {
    throw new Error('Unbekanntes Dateiformat. Fehlende Felder: version, state.')
  }

  const data = parsed as StoredData

  if (!Array.isArray(data.state?.items)) {
    throw new Error('Ungültige Dateistruktur: state.items ist kein Array.')
  }

  if (typeof data.state?.settings !== 'object') {
    throw new Error('Ungültige Dateistruktur: state.settings fehlt.')
  }

  return data
}

/**
 * Serialisiert den aktuellen App-State als JSON-String.
 */
export function exportToJson(items: DesktopItem[], settings: Settings): string {
  const data: StoredData = {
    version: 1,
    state: { items, settings },
  }
  return JSON.stringify(data, null, 2)
}

/**
 * Löst einen Browser-Download einer .json-Datei aus.
 */
export function downloadJson(jsonString: string, filename = 'webdesk-backup.json'): void {
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
