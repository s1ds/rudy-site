export type ShapeType =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'heart'
  | 'star'
  | 'oval'
  | 'rectangle'
  | 'diamond'
  | 'crescent'
  | 'hexagon'
  | 'cone'
  | 'cube'
  | 'cylinder';

export type ColorType =
  | 'red'
  | 'blue'
  | 'yellow'
  | 'green'
  | 'orange'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'black'
  | 'white'
  | 'gray';

export interface ShapeInfo {
  id: ShapeType;
  name: string;
  is3D?: boolean;
}

export interface ColorInfo {
  id: ColorType;
  name: string;
  hex: string;
  textColor: string; // for light background readability
}

export interface MascotInfo {
  id: string;
  name: string;
  primaryColor: string;
}

export const SHAPES: ShapeInfo[] = [
  { id: 'circle', name: 'Circle' },
  { id: 'square', name: 'Square' },
  { id: 'triangle', name: 'Triangle' },
  { id: 'heart', name: 'Heart' },
  { id: 'star', name: 'Star' },
  { id: 'oval', name: 'Oval' },
  { id: 'rectangle', name: 'Rectangle' },
  { id: 'diamond', name: 'Diamond' },
  { id: 'crescent', name: 'Crescent' },
  { id: 'hexagon', name: 'Hexagon' },
  { id: 'cone', name: 'Cone', is3D: true },
  { id: 'cube', name: 'Cube', is3D: true },
  { id: 'cylinder', name: 'Cylinder', is3D: true },
];

export const COLORS: ColorInfo[] = [
  { id: 'red', name: 'Red', hex: '#EF4444', textColor: '#FFFFFF' },
  { id: 'blue', name: 'Blue', hex: '#3B82F6', textColor: '#FFFFFF' },
  { id: 'yellow', name: 'Yellow', hex: '#EAB308', textColor: '#1F2937' },
  { id: 'green', name: 'Green', hex: '#22C55E', textColor: '#FFFFFF' },
  { id: 'orange', name: 'Orange', hex: '#F97316', textColor: '#FFFFFF' },
  { id: 'purple', name: 'Purple', hex: '#A855F7', textColor: '#FFFFFF' },
  { id: 'pink', name: 'Pink', hex: '#EC4899', textColor: '#FFFFFF' },
  { id: 'brown', name: 'Brown', hex: '#78350F', textColor: '#FFFFFF' },
  { id: 'black', name: 'Black', hex: '#111827', textColor: '#FFFFFF' },
  { id: 'white', name: 'White', hex: '#F9FAFB', textColor: '#1F2937' },
  { id: 'gray', name: 'Gray', hex: '#6B7280', textColor: '#FFFFFF' },
];

export const MASCOTS: MascotInfo[] = [
  { id: 'rudy_red', name: 'Rudy Fuchsia', primaryColor: '#EC4899' },
  { id: 'gloop_blue', name: 'Gloop Blue', primaryColor: '#3B82F6' },
  { id: 'spike_green', name: 'Spike Green', primaryColor: '#10B981' },
  { id: 'sunny_yellow', name: 'Sunny Sparkle', primaryColor: '#F59E0B' },
];

export const GAME_MODES = [
  { id: 'shapes_colors', name: 'Shapes & Colors', modeText: 'Find shapes with specific colors!' },
  { id: 'shapes_only', name: 'Shapes Only', modeText: 'Find shapes regardless of color.' },
  { id: 'colors_only', name: 'Colors Only', modeText: 'Find colors regardless of shape.' },
] as const;

export type GameMode = typeof GAME_MODES[number]['id'];
