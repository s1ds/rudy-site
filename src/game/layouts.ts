export type BuildMode = 'mat' | 'house' | 'castle' | 'bridge'

// x/y are measured in joined-tile units from the centre of the build area.
// The renderer converts these units to the measured on-screen foam tile size,
// so adjacent targets remain physically connected at every viewport size.
export type Target = { x: number; y: number; rotate?: number }

export const BUILD_LAYOUTS: Record<BuildMode, Target[]> = {
  mat: [
    { x: -1.5, y: -1 }, { x: -.5, y: -1, rotate: 180 }, { x: .5, y: -1 }, { x: 1.5, y: -1, rotate: 180 },
    { x: -1.5, y: 0, rotate: 180 }, { x: -.5, y: 0 }, { x: .5, y: 0, rotate: 180 }, { x: 1.5, y: 0 },
    { x: -1.5, y: 1 }, { x: -.5, y: 1, rotate: 180 }, { x: .5, y: 1 }, { x: 1.5, y: 1, rotate: 180 },
  ],
  house: [
    { x: 0, y: -1.85, rotate: 45 },
    { x: -.8, y: -1.15, rotate: 45 }, { x: .8, y: -1.15, rotate: -45 },
    { x: -1, y: -.2 }, { x: 0, y: -.2, rotate: 180 }, { x: 1, y: -.2 },
    { x: -1, y: .8, rotate: 180 }, { x: 0, y: .8 }, { x: 1, y: .8, rotate: 180 },
    { x: -1, y: 1.8 }, { x: 0, y: 1.8, rotate: 180 }, { x: 1, y: 1.8 },
  ],
  castle: [
    { x: -1.5, y: -1, rotate: 90 }, { x: -.5, y: -1 }, { x: .5, y: -1, rotate: 180 }, { x: 1.5, y: -1, rotate: -90 },
    { x: -1.5, y: 0, rotate: 180 }, { x: -.5, y: 0 }, { x: .5, y: 0, rotate: 180 }, { x: 1.5, y: 0 },
    { x: -1.5, y: 1 }, { x: -.5, y: 1, rotate: 180 }, { x: .5, y: 1 }, { x: 1.5, y: 1, rotate: 180 },
  ],
  bridge: [
    { x: -2.5, y: .3, rotate: -32 }, { x: -1.5, y: -.25, rotate: -18 }, { x: -.5, y: -.55, rotate: -6 },
    { x: .5, y: -.55, rotate: 6 }, { x: 1.5, y: -.25, rotate: 18 }, { x: 2.5, y: .3, rotate: 32 },
    { x: -2.5, y: 1.3, rotate: -32 }, { x: -1.5, y: .75, rotate: -18 }, { x: -.5, y: .45, rotate: -6 },
    { x: .5, y: .45, rotate: 6 }, { x: 1.5, y: .75, rotate: 18 }, { x: 2.5, y: 1.3, rotate: 32 },
  ],
}

export function resolveBuildLayout(mode: BuildMode, canvasWidth: number, canvasHeight: number, tileSize: number): Target[] {
  const layout = BUILD_LAYOUTS[mode]
  const xs = layout.map((target) => target.x)
  const ys = layout.map((target) => target.y)
  const xSpan = Math.max(...xs) - Math.min(...xs)
  const ySpan = Math.max(...ys) - Math.min(...ys)
  const joinedEdge = tileSize * .82
  const availableWidth = canvasWidth * .68
  const availableHeight = canvasHeight * .78
  const step = Math.min(
    joinedEdge,
    xSpan ? (availableWidth - tileSize) / xSpan : joinedEdge,
    ySpan ? (availableHeight - tileSize) / ySpan : joinedEdge,
  )
  const xMid = (Math.max(...xs) + Math.min(...xs)) / 2
  const yMid = (Math.max(...ys) + Math.min(...ys)) / 2

  return layout.map((target) => ({
    x: 50 + ((target.x - xMid) * step / canvasWidth) * 100,
    y: 50 + ((target.y - yMid) * step / canvasHeight) * 100,
    rotate: target.rotate,
  }))
}
