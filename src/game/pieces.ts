export type ShapeKind = 'triangle' | 'heart' | 'wedge' | 'semiCircle' | 'pentagon' | 'star' | 'diamond' | 'trapezoid'

export type FoamPiece = {
  id: string
  name: string
  shape: ShapeKind
  baseColor: string
  shapeColor: string
  baseStart: { x: number; y: number; rotate: number; tiltX: number; tiltY: number }
  shapeStart: { x: number; y: number; rotate: number; tiltX: number; tiltY: number }
}

// The twelve combinations match the 4x3 mat shown in Rudy's video.
export const PIECES: FoamPiece[] = [
  { id: 'triangle-blue-left', name: 'Blue triangle', shape: 'triangle', baseColor: '#f58220', shapeColor: '#1558c4', baseStart: { x: 10, y: 17, rotate: -7, tiltX: 3, tiltY: -5 }, shapeStart: { x: 51, y: 34, rotate: 11, tiltX: -4, tiltY: 3 } },
  { id: 'heart-yellow', name: 'Yellow heart', shape: 'heart', baseColor: '#1558c4', shapeColor: '#f3df13', baseStart: { x: 34, y: 15, rotate: 5, tiltX: -3, tiltY: 4 }, shapeStart: { x: 77, y: 31, rotate: -9, tiltX: 4, tiltY: -3 } },
  { id: 'wedge-red', name: 'Red curved wedge', shape: 'wedge', baseColor: '#f3df13', shapeColor: '#ee293e', baseStart: { x: 62, y: 17, rotate: -5, tiltX: 4, tiltY: -3 }, shapeStart: { x: 19, y: 34, rotate: 8, tiltX: -3, tiltY: 5 } },
  { id: 'triangle-blue-right', name: 'Blue slim triangle', shape: 'triangle', baseColor: '#f58220', shapeColor: '#1558c4', baseStart: { x: 88, y: 17, rotate: 7, tiltX: -4, tiltY: 4 }, shapeStart: { x: 39, y: 34, rotate: -7, tiltX: 3, tiltY: -4 } },
  { id: 'semicircle-green-left', name: 'Green semicircle', shape: 'semiCircle', baseColor: '#ef2c3c', shapeColor: '#18b848', baseStart: { x: 12, y: 50, rotate: 6, tiltX: 3, tiltY: -5 }, shapeStart: { x: 72, y: 65, rotate: 10, tiltX: -3, tiltY: 4 } },
  { id: 'pentagon-orange', name: 'Orange pentagon', shape: 'pentagon', baseColor: '#18b848', shapeColor: '#f58220', baseStart: { x: 39, y: 47, rotate: -5, tiltX: -4, tiltY: 3 }, shapeStart: { x: 9, y: 67, rotate: -8, tiltX: 4, tiltY: -3 } },
  { id: 'triangle-green', name: 'Green triangle', shape: 'triangle', baseColor: '#ef2c3c', shapeColor: '#18b848', baseStart: { x: 68, y: 48, rotate: 5, tiltX: 3, tiltY: 4 }, shapeStart: { x: 92, y: 68, rotate: 9, tiltX: -4, tiltY: 3 } },
  { id: 'semicircle-yellow', name: 'Yellow semicircle', shape: 'semiCircle', baseColor: '#1558c4', shapeColor: '#f3df13', baseStart: { x: 91, y: 50, rotate: -6, tiltX: -3, tiltY: 4 }, shapeStart: { x: 47, y: 66, rotate: -9, tiltX: 3, tiltY: -5 } },
  { id: 'pentagon-yellow', name: 'Yellow pentagon', shape: 'pentagon', baseColor: '#1558c4', shapeColor: '#f3df13', baseStart: { x: 12, y: 84, rotate: 7, tiltX: 4, tiltY: -4 }, shapeStart: { x: 58, y: 91, rotate: 8, tiltX: -3, tiltY: 4 } },
  { id: 'star-red', name: 'Red star', shape: 'star', baseColor: '#f3df13', shapeColor: '#ef2c3c', baseStart: { x: 39, y: 83, rotate: -5, tiltX: -4, tiltY: 4 }, shapeStart: { x: 84, y: 90, rotate: -7, tiltX: 3, tiltY: -4 } },
  { id: 'diamond-blue', name: 'Blue diamond', shape: 'diamond', baseColor: '#f58220', shapeColor: '#1558c4', baseStart: { x: 67, y: 84, rotate: 4, tiltX: 3, tiltY: 4 }, shapeStart: { x: 21, y: 91, rotate: 10, tiltX: -4, tiltY: -3 } },
  { id: 'trapezoid-orange', name: 'Orange trapezoid', shape: 'trapezoid', baseColor: '#18b848', shapeColor: '#f58220', baseStart: { x: 91, y: 83, rotate: -7, tiltX: 4, tiltY: -4 }, shapeStart: { x: 51, y: 51, rotate: -10, tiltX: -3, tiltY: 5 } },
]

export const SHAPE_PATHS: Record<ShapeKind, string> = {
  triangle: 'M50 18 L78 78 L22 78 Z',
  heart: 'M50 78 C43 68 20 56 20 38 C20 22 40 17 50 33 C60 17 80 22 80 38 C80 56 57 68 50 78 Z',
  wedge: 'M33 22 C72 25 81 45 72 78 L27 59 Z',
  semiCircle: 'M23 76 A34 34 0 0 1 77 35 L77 76 Z',
  trapezoid: 'M25 70 L34 31 L66 31 L75 70 Z',
  diamond: 'M50 18 L78 50 L50 82 L22 50 Z',
  star: 'M50 16 L59 39 L84 39 L64 54 L72 79 L50 64 L28 79 L36 54 L16 39 L41 39 Z',
  pentagon: 'M50 18 L80 40 L68 77 H32 L20 40 Z',
}

export const TILE_PATH = 'M8 8 H37 C37 1 44 1 44 8 H56 C56 1 63 1 63 8 H92 V37 C99 37 99 44 92 44 V56 C99 56 99 63 92 63 V92 H63 C63 99 56 99 56 92 H44 C44 99 37 99 37 92 H8 V63 C1 63 1 56 8 56 V44 C1 44 1 37 8 37 Z'
