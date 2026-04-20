import type { DesktopItem } from '../types/desktop'
import type { Settings, StoredData } from '../types/store'

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
