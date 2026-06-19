export type ShapeKind = 'trapezoid' | 'oval' | 'square' | 'circle' | 'diamond' | 'rectangle' | 'star' | 'hexagon' | 'pentagon'

export type FoamPiece = {
  id: string
  name: string
  shape: ShapeKind
  baseColor: string
  shapeColor: string
  baseStart: { x: number; y: number; rotate: number; tiltX: number; tiltY: number }
  shapeStart: { x: number; y: number; rotate: number; tiltX: number; tiltY: number }
}

// The nine combinations match the supplied 3x3 EVA mat reference.
export const PIECES: FoamPiece[] = [
  { id: 'trapezoid', name: 'Trapezoid', shape: 'trapezoid', baseColor: '#f58220', shapeColor: '#1379c4', baseStart: { x: 12, y: 20, rotate: -7, tiltX: 3, tiltY: -5 }, shapeStart: { x: 63, y: 16, rotate: 11, tiltX: -4, tiltY: 3 } },
  { id: 'oval', name: 'Oval', shape: 'oval', baseColor: '#ffd21f', shapeColor: '#f33b58', baseStart: { x: 35, y: 18, rotate: 5, tiltX: -3, tiltY: 4 }, shapeStart: { x: 84, y: 25, rotate: -9, tiltX: 4, tiltY: -3 } },
  { id: 'square', name: 'Square', shape: 'square', baseColor: '#6e3a92', shapeColor: '#6cc24a', baseStart: { x: 77, y: 16, rotate: 8, tiltX: 3, tiltY: 5 }, shapeStart: { x: 51, y: 30, rotate: -12, tiltX: -4, tiltY: 4 } },
  { id: 'circle', name: 'Circle', shape: 'circle', baseColor: '#63bd49', shapeColor: '#7c3b91', baseStart: { x: 22, y: 50, rotate: 7, tiltX: 4, tiltY: -4 }, shapeStart: { x: 8, y: 72, rotate: -6, tiltX: -3, tiltY: 4 } },
  { id: 'diamond', name: 'Diamond', shape: 'diamond', baseColor: '#0879b8', shapeColor: '#f58b27', baseStart: { x: 55, y: 54, rotate: -5, tiltX: -4, tiltY: 3 }, shapeStart: { x: 31, y: 69, rotate: 10, tiltX: 4, tiltY: -3 } },
  { id: 'rectangle', name: 'Rectangle', shape: 'rectangle', baseColor: '#ef3340', shapeColor: '#ffd629', baseStart: { x: 87, y: 52, rotate: 6, tiltX: 3, tiltY: -5 }, shapeStart: { x: 71, y: 68, rotate: -8, tiltX: -4, tiltY: 3 } },
  { id: 'star', name: 'Star', shape: 'star', baseColor: '#f58220', shapeColor: '#1177b5', baseStart: { x: 14, y: 84, rotate: -5, tiltX: -4, tiltY: 4 }, shapeStart: { x: 44, y: 85, rotate: 7, tiltX: 3, tiltY: -4 } },
  { id: 'hexagon', name: 'Hexagon', shape: 'hexagon', baseColor: '#ffd21f', shapeColor: '#ec3150', baseStart: { x: 59, y: 85, rotate: 4, tiltX: 3, tiltY: 4 }, shapeStart: { x: 92, y: 78, rotate: -10, tiltX: -4, tiltY: -3 } },
  { id: 'pentagon', name: 'Pentagon', shape: 'pentagon', baseColor: '#62bd49', shapeColor: '#733a91', baseStart: { x: 85, y: 86, rotate: -7, tiltX: 4, tiltY: -4 }, shapeStart: { x: 40, y: 45, rotate: 9, tiltX: -3, tiltY: 5 } },
]

export const SHAPE_PATHS: Record<ShapeKind, string> = {
  trapezoid: 'M25 70 L34 31 L66 31 L75 70 Z',
  oval: 'M20 50 C20 30 32 22 50 22 C68 22 80 30 80 50 C80 70 68 78 50 78 C32 78 20 70 20 50 Z',
  square: 'M25 25 H75 V75 H25 Z',
  circle: 'M50 20 A30 30 0 1 1 49.9 20 Z',
  diamond: 'M50 18 L78 50 L50 82 L22 50 Z',
  rectangle: 'M20 31 H80 V69 H20 Z',
  star: 'M50 16 L59 39 L84 39 L64 54 L72 79 L50 64 L28 79 L36 54 L16 39 L41 39 Z',
  hexagon: 'M32 22 H68 L82 50 L68 78 H32 L18 50 Z',
  pentagon: 'M50 18 L80 40 L68 77 H32 L20 40 Z',
}

export const TILE_PATH = 'M8 8 H37 C37 1 44 1 44 8 H56 C56 1 63 1 63 8 H92 V37 C99 37 99 44 92 44 V56 C99 56 99 63 92 63 V92 H63 C63 99 56 99 56 92 H44 C44 99 37 99 37 92 H8 V63 C1 63 1 56 8 56 V44 C1 44 1 37 8 37 Z'
