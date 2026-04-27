import { describe, it, expect } from 'vitest'
import { snapToGrid } from './snapToGrid'

describe('snapToGrid', () => {
  it('rundet auf das nächste Vielfache der Grid-Größe', () => {
    expect(snapToGrid(55, 55, 100)).toEqual([100, 100])
  })

  it('gibt die Position unverändert zurück wenn sie exakt auf dem Grid liegt', () => {
    expect(snapToGrid(200, 300, 100)).toEqual([200, 300])
  })

  it('rundet nach unten wenn näher am kleineren Vielfachen', () => {
    expect(snapToGrid(30, 40, 100)).toEqual([0, 0])
  })

  it('rundet nach oben wenn näher am größeren Vielfachen', () => {
    expect(snapToGrid(80, 90, 100)).toEqual([100, 100])
  })

  it('funktioniert mit verschiedenen Grid-Größen', () => {
    expect(snapToGrid(15, 25, 50)).toEqual([0, 50])
  })

  it('gibt [0, 0] zurück für Ursprungskoordinaten', () => {
    expect(snapToGrid(0, 0, 100)).toEqual([0, 0])
  })
})
