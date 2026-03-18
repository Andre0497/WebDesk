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
  const [resolvedForUrl, setResolvedForUrl] = useState<string>('')
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Debounce: Nicht bei jedem Tastendruck fetchen
    const timer = setTimeout(() => {
      setResolvedForUrl(url)
      if (!url || !isValidUrl(url)) {
        setFaviconUrl(null)
        setHasError(false)
      } else {
        setFaviconUrl(getFaviconUrl(url))
        setHasError(false)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [url, debounceMs])

  // isLoading is true while the debounce timer is pending for a valid URL
  const isLoading = !!url && isValidUrl(url) && url !== resolvedForUrl

  return { faviconUrl, isLoading, hasError }
}
