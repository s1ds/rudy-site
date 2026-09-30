/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

/**
 * Degrees to radians
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Radians to degrees
 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Calculate the Euclidean distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Rotate a point around a given pivot
 */
export function rotatePoint(pt: Point, pivot: Point, angleDeg: number): Point {
  const angleRad = degToRad(angleDeg);
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  
  const dx = pt.x - pivot.x;
  const dy = pt.y - pivot.y;
  
  return {
    x: pivot.x + dx * cos - dy * sin,
    y: pivot.y + dx * sin + dy * cos,
  };
}

/**
 * Rotate a set of points around a given pivot (e.g. centroid)
 */
export function rotatePoints(points: Point[], pivot: Point, angleDeg: number): Point[] {
  return points.map(pt => rotatePoint(pt, pivot, angleDeg));
}

/**
 * Calculate the bounding box for a set of points
 */
export function getBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Calculate the centroid of a polygon
 */
export function getCentroid(points: Point[]): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  
  let sumX = 0;
  let sumY = 0;
  for (const pt of points) {
    sumX += pt.x;
    sumY += pt.y;
  }
  return {
    x: sumX / points.length,
    y: sumY / points.length,
  };
}

/**
 * Converts local points of a piece to board/global coordinate spaces based on its translation & rotation
 */
export function getGlobalPoints(
  localPoints: Point[],
  x: number,
  y: number,
  rotation: number,
  scale: number = 1
): Point[] {
  // First scale, then rotate around local (0,0), then translate by (x, y)
  return localPoints.map(pt => {
    const scaled = { x: pt.x * scale, y: pt.y * scale };
    const rotated = rotatePoint(scaled, { x: 0, y: 0 }, rotation);
    return {
      x: rotated.x + x,
      y: rotated.y + y,
    };
  });
}

/**
 * Generate SVG polygon points string
 */
export function pointsToSVGString(points: Point[]): string {
  return points.map(p => `${p.x},${p.y}`).join(" ");
}

/**
 * Check if a point is inside a polygon (ray-casting algorithm)
 */
export function isPointInPolygon(pt: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    
    const intersect = ((yi > pt.y) !== (yj > pt.y))
        && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
