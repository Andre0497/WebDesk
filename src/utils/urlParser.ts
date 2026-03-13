/** Normalisiert eine URL – fügt https:// hinzu falls kein Protokoll vorhanden */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return `https://${trimmed}`
}

/** Extrahiert den Hostnamen aus einer URL für die Favicon-Abfrage */
export function extractHostname(url: string): string {
  try {
    return new URL(normalizeUrl(url)).hostname
  } catch {
    return ''
  }
}

/** Prüft ob ein String eine gültige URL ist */
export function isValidUrl(input: string): boolean {
  try {
    new URL(normalizeUrl(input))
    return true
  } catch {
    return false
  }
}
