import { describe, expect, it } from 'vitest'
import { BUILD_LAYOUTS, resolveBuildLayout } from './layouts'
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

  it('spaces mat neighbours by the measured interlocking foam edge', () => {
    const targets = resolveBuildLayout('mat', 1200, 600, 100)
    const horizontalGap = (targets[1].x - targets[0].x) / 100 * 1200
    const verticalGap = (targets[4].y - targets[0].y) / 100 * 600

    expect(horizontalGap).toBeCloseTo(82)
    expect(verticalGap).toBeCloseTo(82)
  })

  it('uses perpendicular and angled tile joins in the construction choices', () => {
    expect(BUILD_LAYOUTS.castle.some((target) => Math.abs(target.rotate ?? 0) === 90)).toBe(true)
    expect(BUILD_LAYOUTS.house.some((target) => Math.abs(target.rotate ?? 0) === 45)).toBe(true)
    expect(new Set(BUILD_LAYOUTS.bridge.map((target) => target.rotate)).size).toBeGreaterThan(3)
  })
})
