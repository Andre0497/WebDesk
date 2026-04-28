import { describe, it, expect, vi } from 'vitest'
import { getFaviconUrl, checkFaviconExists, fetchBestFavicon } from './favicon'
import { extractHostname, normalizeUrl, isValidUrl } from './urlParser'

describe('extractHostname', () => {
  it('extrahiert Hostname aus einer vollständigen URL', () => {
    expect(extractHostname('https://www.google.com/search?q=test')).toBe('www.google.com')
  })

  it('funktioniert ohne Protokoll-Präfix', () => {
    expect(extractHostname('google.com')).toBe('google.com')
  })

  it('gibt leeren String bei ungültiger URL zurück', () => {
    expect(extractHostname('')).toBe('')
  })

  it('extrahiert Hostname aus einer URL mit Pfad', () => {
    expect(extractHostname('https://github.com/user/repo')).toBe('github.com')
  })
})

describe('normalizeUrl', () => {
  it('gibt leeren String bei leerem Input zurück', () => {
    expect(normalizeUrl('')).toBe('')
  })

  it('fügt https:// hinzu wenn kein Protokoll vorhanden', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com')
  })

  it('behält bestehende https:// URL unverändert', () => {
    expect(normalizeUrl('https://example.com')).toBe('https://example.com')
  })

  it('behält bestehende http:// URL unverändert', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com')
  })

  it('ergänzt https: bei // Präfix', () => {
    expect(normalizeUrl('//example.com')).toBe('https://example.com')
  })
})

describe('isValidUrl', () => {
  it('gibt true für gültige URL zurück', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
  })

  it('gibt true für URL ohne Protokoll zurück (wird normalisiert)', () => {
    expect(isValidUrl('example.com')).toBe(true)
  })

  it('gibt false für ungültige URL zurück', () => {
    expect(isValidUrl('')).toBe(false)
  })
})

describe('getFaviconUrl', () => {
  it('gibt korrekte Google Favicon Service URL zurück', () => {
    const url = getFaviconUrl('https://github.com')
    expect(url).toContain('google.com/s2/favicons')
    expect(url).toContain('github.com')
    expect(url).toContain('sz=64')
  })

  it('verwendet die angegebene Größe', () => {
    const url = getFaviconUrl('https://github.com', 32)
    expect(url).toContain('sz=32')
  })

  it('gibt leeren String bei ungültiger URL zurück', () => {
    expect(getFaviconUrl('')).toBe('')
  })

  it('enthält den korrekten Hostnamen in der Favicon-URL', () => {
    const url = getFaviconUrl('https://www.example.com/path?q=1')
    expect(url).toContain('www.example.com')
  })
})

describe('checkFaviconExists', () => {
  it('gibt true zurück wenn fetch erfolgreich ist', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({}))
    const result = await checkFaviconExists('https://www.google.com/s2/favicons?sz=64&domain=github.com')
    expect(result).toBe(true)
    vi.unstubAllGlobals()
  })

  it('gibt false zurück wenn fetch einen Fehler wirft', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    const result = await checkFaviconExists('https://invalid-url')
    expect(result).toBe(false)
    vi.unstubAllGlobals()
  })

  it('gibt false zurück bei leerer URL', async () => {
    const result = await checkFaviconExists('')
    expect(result).toBe(false)
  })
})

describe('fetchBestFavicon', () => {
  it('gibt null zurück bei ungültiger URL', async () => {
    const result = await fetchBestFavicon('')
    expect(result).toBeNull()
  })

  it('gibt die erste erreichbare Favicon-URL zurück', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({}))
    const result = await fetchBestFavicon('https://github.com')
    expect(result).toContain('sz=64')
    expect(result).toContain('github.com')
    vi.unstubAllGlobals()
  })

  it('gibt null zurück wenn alle Kandidaten fehlschlagen', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    const result = await fetchBestFavicon('https://github.com')
    expect(result).toBeNull()
    vi.unstubAllGlobals()
  })
})
