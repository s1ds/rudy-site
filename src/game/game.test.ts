import { describe, expect, it } from 'vitest'
import { BUILD_LAYOUTS } from './layouts'
import { PIECES } from './pieces'

describe('Rudy video toy data', () => {
  it('contains exactly twelve base and shape pairs', () => {
    expect(PIECES).toHaveLength(12)
    expect(new Set(PIECES.map((piece) => piece.id)).size).toBe(12)
  })

  it('keeps the repeated video color families', () => {
    expect(PIECES.filter((piece) => piece.baseColor === '#f58220')).toHaveLength(3)
    expect(PIECES.filter((piece) => piece.baseColor === '#1558c4')).toHaveLength(3)
    expect(PIECES.filter((piece) => piece.baseColor === '#f3df13')).toHaveLength(2)
    expect(PIECES.filter((piece) => piece.baseColor === '#ef2c3c')).toHaveLength(2)
    expect(PIECES.filter((piece) => piece.baseColor === '#18b848')).toHaveLength(2)
  })

  it('provides one target per completed tile in every build activity', () => {
    Object.values(BUILD_LAYOUTS).forEach((layout) => expect(layout).toHaveLength(PIECES.length))
  })

  it('lays the finished mat out as four columns by three rows', () => {
    expect(new Set(BUILD_LAYOUTS.mat.map((target) => target.x)).size).toBe(4)
    expect(new Set(BUILD_LAYOUTS.mat.map((target) => target.y)).size).toBe(3)
  })
})
