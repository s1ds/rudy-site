export type BuildMode = 'mat' | 'house' | 'castle' | 'bridge'

export type Target = { x: number; y: number; rotate?: number }

export const BUILD_LAYOUTS: Record<BuildMode, Target[]> = {
  mat: [
    { x: 33, y: 24 }, { x: 50, y: 24 }, { x: 67, y: 24 },
    { x: 33, y: 49 }, { x: 50, y: 49 }, { x: 67, y: 49 },
    { x: 33, y: 74 }, { x: 50, y: 74 }, { x: 67, y: 74 },
  ],
  house: [
    { x: 50, y: 15, rotate: 45 },
    { x: 38, y: 36 }, { x: 50, y: 36 }, { x: 62, y: 36 },
    { x: 38, y: 57 }, { x: 50, y: 57 }, { x: 62, y: 57 },
    { x: 38, y: 78 }, { x: 50, y: 78 },
  ],
  castle: [
    { x: 29, y: 27 }, { x: 50, y: 20 }, { x: 71, y: 27 },
    { x: 29, y: 50 }, { x: 50, y: 43 }, { x: 71, y: 50 },
    { x: 29, y: 73 }, { x: 50, y: 66 }, { x: 71, y: 73 },
  ],
  bridge: [
    { x: 22, y: 58 }, { x: 36, y: 43 }, { x: 50, y: 36 }, { x: 64, y: 43 }, { x: 78, y: 58 },
    { x: 22, y: 78 }, { x: 36, y: 68 }, { x: 64, y: 68 }, { x: 78, y: 78 },
  ],
}
