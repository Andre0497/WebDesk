# Task 3.5 – Favicon-Fetching Service

> **Epic:** EPIC 3 – Icon & Ordner-System  
> **Priorität:** 🟡 Mittel  
> **Status:** ⬜ Offen

---

## 🎯 Ziel

Einen Favicon-Service implementieren, der für eine gegebene URL automatisch das Favicon der Website lädt. Als primäre Quelle wird der Google Favicon Service genutzt. Der Service wird sowohl beim Erstellen eines neuen Links (direkte URL-Vorschau im Modal) als auch beim Laden bestehender Links ohne gespeichertes Favicon eingesetzt.

---

## 📋 Aufgaben

### 1. `src/utils/favicon.ts` implementieren

```typescript
// src/utils/favicon.ts
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
    const response = await fetch(faviconUrl, { method: 'HEAD', mode: 'no-cors' })
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

  // Direkte favicon.ico als Alternative
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
```

### 2. `src/hooks/useFavicon.ts` implementieren

Ein Hook, der das Favicon für eine URL lädt und den Lade-Zustand trackt:

```typescript
// src/hooks/useFavicon.ts
import { useState, useEffect } from 'react'
import { getFaviconUrl } from '../utils/favicon'
import { isValidUrl } from '../utils/urlParser'

interface UseFaviconResult {
  faviconUrl: string | null
  isLoading: boolean
  hasError: boolean
}

export function useFavicon(url: string, debounceMs: number = 500): UseFaviconResult {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!url || !isValidUrl(url)) {
      setFaviconUrl(null)
      setIsLoading(false)
      setHasError(false)
      return
    }

    setIsLoading(true)
    setHasError(false)

    // Debounce: Nicht bei jedem Tastendruck fetchen
    const timer = setTimeout(() => {
      const url_generated = getFaviconUrl(url)
      setFaviconUrl(url_generated)
      setIsLoading(false)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [url, debounceMs])

  return { faviconUrl, isLoading, hasError }
}
```

### 3. Favicon-Vorschau im `AddLinkModal` nutzen (Vorschau für Task 3.6)

```tsx
// Ausschnitt aus AddLinkModal – Verwendung von useFavicon:
import { useFavicon } from '../../hooks/useFavicon'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

function FaviconPreview({ url }: { url: string }) {
  const { faviconUrl, isLoading } = useFavicon(url)

  return (
    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
      {isLoading ? (
        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      ) : faviconUrl ? (
        <img
          src={faviconUrl}
          alt="Favicon"
          className="w-7 h-7 rounded object-contain"
          onError={e => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <GlobeAltIcon className="w-6 h-6 text-white/40" />
      )}
    </div>
  )
}
```

### 4. Favicon automatisch beim Erstellen eines Links setzen

Wenn ein Link ohne `faviconUrl` erstellt wird, soll das Favicon automatisch ermittelt werden. Dies passiert in der `addLink`-Action des Stores (Task 6.1):

```typescript
// Pseudocode für den Store (Task 6.1):
addLink: (linkData) => {
  const faviconUrl = getFaviconUrl(linkData.url)
  const newLink: LinkItem = {
    ...linkData,
    id: crypto.randomUUID(),
    faviconUrl: linkData.faviconUrl ?? faviconUrl,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  set(state => ({ items: [...state.items, newLink] }))
}
```

---

## ✅ Akzeptanzkriterien

- [ ] `getFaviconUrl('https://github.com')` gibt eine gültige Google-Favicon-URL zurück
- [ ] `extractHostname` verarbeitet URLs mit und ohne `https://` korrekt
- [ ] `useFavicon` Hook debounced den URL-Input (kein Fetch bei jedem Tastendruck)
- [ ] Favicon wird in der Vorschau des `AddLinkModal` korrekt angezeigt
- [ ] Ladeanimation erscheint während des Debounce-Timeouts
- [ ] Bei ungültiger URL wird kein Favicon geladen (kein Fehler in der Konsole)
- [ ] `npm run lint` meldet keine Fehler

---

## 🔗 Abhängigkeiten zu anderen Tasks

- **Voraussetzung:** Task 3.1 (Datenmodell, `urlParser.ts`)
- **Voraussetzung für:** Task 3.6 (AddLinkModal – Favicon-Vorschau), Task 6.1 (Store – automatisches Favicon beim Erstellen)

---

## 🚀 Abschluss & Push

Nach erfolgreichem Abschluss dieses Tasks:

```bash
git add .
git commit -m "feat(favicon): Task 3.5 - Favicon-Service und useFavicon Hook implementieren"
git push origin main
```

Danach in `docs/project-plan.md` den Status von Task 3.5 auf `✅ Erledigt` setzen.

