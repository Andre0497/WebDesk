import { extractHostname } from './urlParser'

/** Erzeugt die Favicon-URL via Google S2 Favicon Service */
export function getFaviconUrl(url: string, size: 32 | 64 | 128 = 64): string {
  const hostname = extractHostname(url)
  if (!hostname) return ''
  return `https://www.google.com/s2/favicons?sz=${size}&domain=${hostname}`
}

/** Prüft ob eine Favicon-URL erreichbar ist (für die Vorschau im Modal) */
export async function checkFaviconExists(faviconUrl: string): Promise<boolean> {
  if (!faviconUrl) return false
  try {
    await fetch(faviconUrl, { method: 'HEAD', mode: 'no-cors' })
    // no-cors liefert immer opaque response – wir prüfen nur ob kein Netzwerkfehler auftritt
    return true
  } catch {
    return false
  }
}

/**
 * Lädt das beste verfügbare Favicon für eine URL.
 * Versucht zuerst Google Favicon Service (sz=64), dann sz=32 als Fallback.
 */
export async function fetchBestFavicon(url: string): Promise<string | null> {
  const hostname = extractHostname(url)
  if (!hostname) return null

  const candidates = [
    `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`,
    `https://www.google.com/s2/favicons?sz=32&domain=${hostname}`,
  ]

  for (const candidate of candidates) {
    const exists = await checkFaviconExists(candidate)
    if (exists) return candidate
  }
  return null
}
