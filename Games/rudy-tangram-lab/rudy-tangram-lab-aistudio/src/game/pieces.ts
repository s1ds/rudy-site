/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point } from "./geometry";
import { SHAPE_COLORS } from "./constants";

export interface ShapeTemplate {
  type: string;
  label: string;
  points: Point[];
  customPath?: string; // Standard SVG Path if poly points don't capture curves (like circle, heart, star, semicircle)
  isCircle?: boolean;
  radius?: number;
}

export interface GamePiece {
  id: string;
  type: string;
  label: string;
  points: Point[];
  customPath?: string;
  isCircle?: boolean;
  radius?: number;
  color: string;
  x: number;          // Current X position on Board (or tray)
  y: number;          // Current Y position on Board (or tray)
  rotation: number;   // Rotation angle in degrees (0 - 360)
  scale: number;      // Scaling factor (defaults to 1.0)
  isLocked?: boolean; // Locked in place once correctly matched
  layer?: number;     // Render order sorting
}

// Programmatic star generator
function generateStarPoints(outerRadius: number = 55, innerRadius: number = 22): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    points.push({
      x: parseFloat((Math.cos(angle) * r).toFixed(2)),
      y: parseFloat((Math.sin(angle) * r).toFixed(2)),
    });
  }
  return points;
}

// Base shapes templates
export const PRESCHOOL_TEMPLATES: Record<string, ShapeTemplate> = {
  triangle: {
    type: "triangle",
    label: "Triangle",
    points: [
      { x: -50, y: 28.87 },
      { x: 50, y: 28.87 },
      { x: 0, y: -57.73 },
    ],
  },
  square: {
    type: "square",
    label: "Square",
    points: [
      { x: -45, y: -45 },
      { x: 45, y: -45 },
      { x: 45, y: 45 },
      { x: -45, y: 45 },
    ],
  },
  rectangle: {
    type: "rectangle",
    label: "Rectangle",
    points: [
      { x: -65, y: -35 },
      { x: 65, y: -35 },
      { x: 65, y: 35 },
      { x: -65, y: 35 },
    ],
  },
  circle: {
    type: "circle",
    label: "Circle",
    points: [], // Not polygon-based
    isCircle: true,
    radius: 46,
    customPath: "M 0 0 A 46 46 0 1 1 0 -0.01 Z",
  },
  semicircle: {
    type: "semicircle",
    label: "Semicircle",
    points: [],
    customPath: "M -50 15 A 50 50 0 0 1 50 15 Z", // Flat bottom, dome top
  },
  diamond: {
    type: "diamond",
    label: "Diamond",
    points: [
      { x: 0, y: -55 },
      { x: 45, y: 0 },
      { x: 0, y: 55 },
      { x: -45, y: 0 },
    ],
  },
  parallelogram: {
    type: "parallelogram",
    label: "Parallelogram",
    points: [
      { x: -45, y: -25 },
      { x: 35, y: -25 },
      { x: 45, y: 25 },
      { x: -35, y: 25 },
    ],
  },
  trapezoid: {
    type: "trapezoid",
    label: "Trapezoid",
    points: [
      { x: -55, y: 25 },
      { x: 55, y: 25 },
      { x: 30, y: -25 },
      { x: -30, y: -25 },
    ],
  },
  star: {
    type: "star",
    label: "Star",
    points: generateStarPoints(52, 22),
  },
  heart: {
    type: "heart",
    label: "Heart",
    points: [],
    customPath: "M 0,-25 C -25,-55 -60,-35 -40,10 C -25,25 0,50 0,50 C 0,50 25,25 40,10 C 60,-35 25,-55 0,-25 Z",
  },
};

// 7 Classic Tangram Pieces (unit coordinate definitions in 100x100 space, scaled)
// Classic pieces are relative to centroid
export const TANGRAM_TEMPLATES: Record<string, ShapeTemplate> = {
  large_triangle_1: {
    type: "large_triangle_1",
    label: "Large Triangle 1",
    points: [
      { x: -94.28, y: 47.14 },
      { x: 94.28, y: 47.14 },
      { x: 0, y: -47.14 },
    ],
  },
  large_triangle_2: {
    type: "large_triangle_2",
    label: "Large Triangle 2",
    points: [
      { x: -94.28, y: 47.14 },
      { x: 94.28, y: 47.14 },
      { x: 0, y: -47.14 },
    ],
  },
  medium_triangle: {
    type: "medium_triangle",
    label: "Medium Triangle",
    points: [
      { x: -66.67, y: 33.33 },
      { x: 66.67, y: 33.33 },
      { x: 0, y: -33.33 },
    ],
  },
  small_triangle_1: {
    type: "small_triangle_1",
    label: "Small Triangle 1",
    points: [
      { x: -47.14, y: 23.57 },
      { x: 47.14, y: 23.57 },
      { x: 0, y: -23.57 },
    ],
  },
  small_triangle_2: {
    type: "small_triangle_2",
    label: "Small Triangle 2",
    points: [
      { x: -47.14, y: 23.57 },
      { x: 47.14, y: 23.57 },
      { x: 0, y: -23.57 },
    ],
  },
  tangram_square: {
    type: "tangram_square",
    label: "Square",
    points: [
      { x: -33.33, y: -33.33 },
      { x: 33.33, y: -33.33 },
      { x: 33.33, y: 33.33 },
      { x: -33.33, y: 33.33 },
    ],
  },
  tangram_parallelogram: {
    type: "tangram_parallelogram",
    label: "Parallelogram",
    points: [
      { x: -50, y: -25 },
      { x: 16.67, y: -25 },
      { x: 50, y: 25 },
      { x: -16.67, y: 25 },
    ],
  },
};

/**
 * Instantiates a new game piece based on a template
 */
export function createPieceFromTemplate(
  id: string,
  template: ShapeTemplate,
  color: string,
  x: number = 100,
  y: number = 100,
  rotation: number = 0,
  scale: number = 1.0
): GamePiece {
  return {
    id,
    type: template.type,
    label: template.label,
    points: JSON.parse(JSON.stringify(template.points)),
    customPath: template.customPath,
    isCircle: template.isCircle,
    radius: template.radius,
    color,
    x,
    y,
    rotation,
    scale,
    isLocked: false,
    layer: Date.now(),
  };
}

/**
 * Gets a collection of default preschool shape pieces for Free Play or Light Box Mode
 */
export function getDefaultPreschoolPieces(): GamePiece[] {
  const keys = Object.keys(PRESCHOOL_TEMPLATES);
  const colors = [
    SHAPE_COLORS.red,
    SHAPE_COLORS.orange,
    SHAPE_COLORS.amber,
    SHAPE_COLORS.green,
    SHAPE_COLORS.teal,
    SHAPE_COLORS.blue,
    SHAPE_COLORS.violet,
    SHAPE_COLORS.pink,
    SHAPE_COLORS.yellow,
    SHAPE_COLORS.purple,
  ];
  
  return keys.map((key, index) => {
    // Distribute them evenly in space
    const col = index % 5;
    const row = Math.floor(index / 5);
    const x = 120 + col * 160;
    const y = 140 + row * 160;
    const template = PRESCHOOL_TEMPLATES[key];
    const color = colors[index % colors.length];
    return createPieceFromTemplate(`preschool_${key}_${index}`, template, color, x, y, 0);
  });
}

/**
 * Gets the 7 classic tangram pieces
 */
export function getDefaultTangramPieces(startCenterX: number = 450, startCenterY: number = 290): GamePiece[] {
  const colors = [
    SHAPE_COLORS.red,
    SHAPE_COLORS.orange,
    SHAPE_COLORS.yellow,
    SHAPE_COLORS.green,
    SHAPE_COLORS.teal,
    SHAPE_COLORS.blue,
    SHAPE_COLORS.violet,
  ];
  
  const orderKeys = [
    "large_triangle_1",
    "large_triangle_2",
    "medium_triangle",
    "small_triangle_1",
    "small_triangle_2",
    "tangram_square",
    "tangram_parallelogram"
  ];
  
  return orderKeys.map((key, index) => {
    const template = TANGRAM_TEMPLATES[key];
    const color = colors[index];
    // Stagger them slightly so they aren't piled directly over each other
    const radiusOffset = 80;
    const angle = (index * 2 * Math.PI) / 7;
    const x = startCenterX + Math.cos(angle) * radiusOffset;
    const y = startCenterY + Math.sin(angle) * radiusOffset;
    
    // Random rotation in 45 increments
    const rot = (Math.floor(Math.random() * 4) * 90);
    
    return createPieceFromTemplate(`tangram_${key}`, template, color, x, y, rot);
  });
}
