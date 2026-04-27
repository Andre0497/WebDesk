import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { exportToJson, importFromJson, downloadJson } from './dataTransfer'
import type { DesktopItem } from '../types/desktop'
import type { Settings } from '../types/store'

const mockSettings: Settings = {
  wallpaper: 'dark-space',
  theme: 'dark',
  gridSize: 100,
  showLabels: true,
}

const mockItems: DesktopItem[] = [
  {
    id: 'link-1',
    type: 'link',
    name: 'GitHub',
    url: 'https://github.com',
    position: { col: 0, row: 0 },
    parentId: null,
    createdAt: 1000,
    updatedAt: 1000,
  },
]

describe('exportToJson', () => {
  it('serialisiert Items und Settings als JSON-String', () => {
    const json = exportToJson(mockItems, mockSettings)
    expect(typeof json).toBe('string')
    const parsed = JSON.parse(json)
    expect(parsed.version).toBe(1)
    expect(parsed.state.items).toEqual(mockItems)
    expect(parsed.state.settings).toEqual(mockSettings)
  })

  it('erzeugt valides JSON', () => {
    const json = exportToJson(mockItems, mockSettings)
    expect(() => JSON.parse(json)).not.toThrow()
  })

  it('gibt leere Items-Liste korrekt aus', () => {
    const json = exportToJson([], mockSettings)
    const parsed = JSON.parse(json)
    expect(parsed.state.items).toEqual([])
  })
})

describe('importFromJson', () => {
  it('parst einen gültigen JSON-String korrekt', () => {
    const json = exportToJson(mockItems, mockSettings)
    const result = importFromJson(json)
    expect(result.version).toBe(1)
    expect(result.state.items).toEqual(mockItems)
    expect(result.state.settings).toEqual(mockSettings)
  })

  it('wirft Fehler bei ungültigem JSON', () => {
    expect(() => importFromJson('{invalid json}')).toThrow()
  })

  it('wirft Fehler wenn version fehlt', () => {
    const invalid = JSON.stringify({ state: { items: [], settings: mockSettings } })
    expect(() => importFromJson(invalid)).toThrow()
  })

  it('wirft Fehler wenn state fehlt', () => {
    const invalid = JSON.stringify({ version: 1 })
    expect(() => importFromJson(invalid)).toThrow()
  })

  it('wirft Fehler wenn state.items kein Array ist', () => {
    const invalid = JSON.stringify({ version: 1, state: { items: 'no-array', settings: mockSettings } })
    expect(() => importFromJson(invalid)).toThrow()
  })

  it('wirft Fehler wenn state.settings fehlt', () => {
    const invalid = JSON.stringify({ version: 1, state: { items: [] } })
    expect(() => importFromJson(invalid)).toThrow()
  })
})

describe('downloadJson', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('erstellt einen Download-Link und klickt ihn', () => {
    const clickSpy = vi.fn()
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(node => node)
    const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(node => node)
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLAnchorElement)

    downloadJson('{"test":1}', 'test.json')

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(clickSpy).toHaveBeenCalled()
    expect(appendSpy).toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalled()

    createElementSpy.mockRestore()
    appendSpy.mockRestore()
    removeSpy.mockRestore()
  })

  it('verwendet den Standard-Dateinamen wenn keiner angegeben', () => {
    const clickSpy = vi.fn()
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(node => node)
    const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(node => node)
    const mockLink = { href: '', download: '', click: clickSpy }
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement)

    downloadJson('{}')

    expect(mockLink.download).toBe('webdesk-backup.json')

    appendSpy.mockRestore()
    removeSpy.mockRestore()
  })
})
