/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point, getBoundingBox, getGlobalPoints, isPointInPolygon } from "./geometry";
import { GamePiece } from "./pieces";
import { BOARD_WIDTH, BOARD_HEIGHT } from "./constants";

/**
 * Clamps coordinates so that a piece's virtual boundaries are kept entirely inside the game board
 */
export function clampPieceToBoard(
  piece: GamePiece,
  newX: number,
  newY: number,
  padding: number = 10
): { x: number; y: number } {
  const localPoints = piece.isCircle
    ? [
        { x: -piece.radius!, y: -piece.radius! },
        { x: piece.radius!, y: -piece.radius! },
        { x: piece.radius!, y: piece.radius! },
        { x: -piece.radius!, y: piece.radius! },
      ]
    : piece.points;

  // Calculate points of the piece if placed at newX, newY
  const globalPoints = getGlobalPoints(localPoints, newX, newY, piece.rotation, piece.scale);
  const bbox = getBoundingBox(globalPoints);

  let shiftX = 0;
  let shiftY = 0;

  if (bbox.minX < padding) {
    shiftX = padding - bbox.minX;
  } else if (bbox.maxX > BOARD_WIDTH - padding) {
    shiftX = (BOARD_WIDTH - padding) - bbox.maxX;
  }

  if (bbox.minY < padding) {
    shiftY = padding - bbox.minY;
  } else if (bbox.maxY > BOARD_HEIGHT - padding) {
    shiftY = (BOARD_HEIGHT - padding) - bbox.maxY;
  }

  return {
    x: newX + shiftX,
    y: newY + shiftY,
  };
}

/**
 * Checks if two shapes overlap based on simple bounding box intersection, 
 * followed by a refined centroid/point query
 */
export function piecesOverlap(p1: GamePiece, p2: GamePiece): boolean {
  // 1. Get global bounds
  const pts1 = p1.isCircle
    ? [
        { x: -p1.radius!, y: -p1.radius! },
        { x: p1.radius!, y: p1.radius! },
      ]
    : p1.points;
  const pts2 = p2.isCircle
    ? [
        { x: -p2.radius!, y: -p2.radius! },
        { x: p2.radius!, y: p2.radius! },
      ]
    : p2.points;

  const g1 = getGlobalPoints(pts1, p1.x, p1.y, p1.rotation, p1.scale);
  const g2 = getGlobalPoints(pts2, p2.x, p2.y, p2.rotation, p2.scale);

  const b1 = getBoundingBox(g1);
  const b2 = getBoundingBox(g2);

  // Check simple bbox intersection
  const intersectBBox = 
    !(b2.minX > b1.maxX || 
      b2.maxX < b1.minX || 
      b2.minY > b1.maxY || 
      b2.maxY < b1.minY);

  if (!intersectBBox) return false;

  // Refine check: Does centroid of p1 fall near/in p2 or vice-versa?
  const center1 = { x: p1.x, y: p1.y };
  const center2 = { x: p2.x, y: p2.y };
  
  const r1 = p1.isCircle ? p1.radius! : 45;
  const r2 = p2.isCircle ? p2.radius! : 45;

  const distCenters = Math.hypot(center1.x - center2.x, center1.y - center2.y);
  // If centers are closer than sum of average dimension radii, we count as overlapping translucent sheets
  return distCenters < (r1 + r2) * 1.05;
}
