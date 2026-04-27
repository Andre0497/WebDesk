import { describe, it, expect } from 'vitest'
import { generateId, createLinkItem, createFolderItem } from './items'

describe('generateId', () => {
  it('erzeugt eine nicht-leere Zeichenkette', () => {
    expect(generateId()).toBeTruthy()
  })

  it('erzeugt eindeutige IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('createLinkItem', () => {
  it('erstellt ein LinkItem mit korrekten Pflichtfeldern', () => {
    const item = createLinkItem({ url: 'https://example.com', name: 'Example' })
    expect(item.type).toBe('link')
    expect(item.url).toBe('https://example.com')
    expect(item.name).toBe('Example')
    expect(item.id).toBeTruthy()
  })

  it('setzt Standardposition auf { col: 0, row: 0 }', () => {
    const item = createLinkItem({ url: 'https://example.com', name: 'Example' })
    expect(item.position).toEqual({ col: 0, row: 0 })
  })

  it('setzt parentId standardmäßig auf null', () => {
    const item = createLinkItem({ url: 'https://example.com', name: 'Example' })
    expect(item.parentId).toBeNull()
  })

  it('erlaubt das Überschreiben von Standardwerten', () => {
    const item = createLinkItem({
      url: 'https://example.com',
      name: 'Example',
      position: { col: 3, row: 2 },
      parentId: 'folder-1',
    })
    expect(item.position).toEqual({ col: 3, row: 2 })
    expect(item.parentId).toBe('folder-1')
  })

  it('erstellt jedes Mal eine neue ID', () => {
    const item1 = createLinkItem({ url: 'https://a.com', name: 'A' })
    const item2 = createLinkItem({ url: 'https://b.com', name: 'B' })
    expect(item1.id).not.toBe(item2.id)
  })
})

describe('createFolderItem', () => {
  it('erstellt ein FolderItem mit korrekten Pflichtfeldern', () => {
    const folder = createFolderItem({ name: 'Arbeit' })
    expect(folder.type).toBe('folder')
    expect(folder.name).toBe('Arbeit')
    expect(folder.id).toBeTruthy()
  })

  it('setzt isOpen standardmäßig auf false', () => {
    const folder = createFolderItem({ name: 'Test' })
    expect(folder.isOpen).toBe(false)
  })

  it('setzt eine Standard-Farbe', () => {
    const folder = createFolderItem({ name: 'Test' })
    expect(folder.color).toBeTruthy()
  })

  it('setzt parentId standardmäßig auf null', () => {
    const folder = createFolderItem({ name: 'Test' })
    expect(folder.parentId).toBeNull()
  })

  it('erlaubt das Überschreiben der Standardfarbe', () => {
    const folder = createFolderItem({ name: 'Test', color: '#ff0000' })
    expect(folder.color).toBe('#ff0000')
  })
})
