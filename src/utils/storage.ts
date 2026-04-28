/**
 * Liest einen Wert aus dem localStorage und parst ihn als JSON.
 * Gibt null zurück, wenn der Schlüssel nicht existiert oder das JSON ungültig ist.
 */
export function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return null
    return JSON.parse(item) as T
  } catch {
    return null
  }
}

/**
 * Serialisiert einen Wert als JSON und speichert ihn im localStorage.
 */
export function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}
