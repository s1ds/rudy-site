export type BuildMode = 'mat' | 'house' | 'castle' | 'bridge'

export type Target = { x: number; y: number; rotate?: number }

export const BUILD_LAYOUTS: Record<BuildMode, Target[]> = {
  mat: [
    { x: 32, y: 24 }, { x: 44, y: 24 }, { x: 56, y: 24 }, { x: 68, y: 24 },
    { x: 32, y: 50 }, { x: 44, y: 50 }, { x: 56, y: 50 }, { x: 68, y: 50 },
    { x: 32, y: 76 }, { x: 44, y: 76 }, { x: 56, y: 76 }, { x: 68, y: 76 },
  ],
  house: [
    { x: 50, y: 15, rotate: 45 },
    { x: 37, y: 32, rotate: 45 }, { x: 63, y: 32, rotate: 45 },
    { x: 35, y: 51 }, { x: 50, y: 51 }, { x: 65, y: 51 },
    { x: 35, y: 73 }, { x: 50, y: 73 }, { x: 65, y: 73 },
    { x: 20, y: 84 }, { x: 80, y: 84 }, { x: 50, y: 89 },
  ],
  castle: [
    { x: 26, y: 23 }, { x: 42, y: 30 }, { x: 58, y: 30 }, { x: 74, y: 23 },
    { x: 26, y: 49 }, { x: 42, y: 54 }, { x: 58, y: 54 }, { x: 74, y: 49 },
    { x: 26, y: 75 }, { x: 42, y: 78 }, { x: 58, y: 78 }, { x: 74, y: 75 },
  ],
  bridge: [
    { x: 16, y: 58 }, { x: 30, y: 43 }, { x: 43, y: 34 }, { x: 57, y: 34 }, { x: 70, y: 43 }, { x: 84, y: 58 },
    { x: 16, y: 80 }, { x: 30, y: 70 }, { x: 43, y: 62 }, { x: 57, y: 62 }, { x: 70, y: 70 }, { x: 84, y: 80 },
  ],
}
