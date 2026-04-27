import { describe, it, expect, beforeEach } from 'vitest'
import { loadFromStorage, saveToStorage } from './storage'

describe('loadFromStorage / saveToStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('speichert und liest Daten korrekt', () => {
    const data = { items: ['a', 'b'] }
    saveToStorage('test-key', data)
    expect(loadFromStorage('test-key')).toEqual(data)
  })

  it('gibt null zurück wenn Schlüssel nicht existiert', () => {
    expect(loadFromStorage('nicht-vorhanden')).toBeNull()
  })

  it('gibt null zurück bei ungültigem JSON', () => {
    localStorage.setItem('bad-key', '{invalid json}')
    expect(loadFromStorage('bad-key')).toBeNull()
  })

  it('speichert verschiedene Datentypen korrekt', () => {
    saveToStorage('number-key', 42)
    expect(loadFromStorage('number-key')).toBe(42)

    saveToStorage('bool-key', true)
    expect(loadFromStorage('bool-key')).toBe(true)

    saveToStorage('array-key', [1, 2, 3])
    expect(loadFromStorage('array-key')).toEqual([1, 2, 3])
  })

  it('überschreibt vorhandene Daten', () => {
    saveToStorage('key', { version: 1 })
    saveToStorage('key', { version: 2 })
    expect(loadFromStorage<{ version: number }>('key')).toEqual({ version: 2 })
  })
})
