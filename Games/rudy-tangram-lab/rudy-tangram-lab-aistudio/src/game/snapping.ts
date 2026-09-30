/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point, distance } from "./geometry";
import { GamePiece } from "./pieces";
import {
  SNAP_DISTANCE_FORGIVING,
  SNAP_ANGLE_FORGIVING,
  SNAP_DISTANCE_STRICT,
  SNAP_ANGLE_STRICT,
} from "./constants";

export interface SnapTarget {
  id: string;          // Target reference ID
  type: string;        // Shape key (e.g. 'square', 'large_triangle_1')
  x: number;           // Target center X
  y: number;           // Target center Y
  rotation: number;    // Target target rotation
  scale: number;       // Target scale factor (usually 1)
  matchedPieceId?: string; // Cache which piece actually sits here
}

/**
 * Normalizes an angle into [0, 360)
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Calculates the absolute smallest delta angle in degrees, accounting for shape rotation symmetries
 */
export function getRotationDifference(deg1: number, deg2: number, shapeType: string): number {
  const a1 = normalizeAngle(deg1);
  const a2 = normalizeAngle(deg2);
  let diff = Math.abs(a1 - a2);
  if (diff > 180) diff = 360 - diff;

  // Shapes with symmetry:
  // 1. Circle: Completely rotationally symmetric (diff is 0)
  if (shapeType === "circle") {
    return 0;
  }
  
  // 2. Square: 90-degree symmetry
  if (shapeType === "square" || shapeType === "tangram_square") {
    const mod = diff % 90;
    return mod > 45 ? 90 - mod : mod;
  }
  
  // 3. Rectangle, Diamond, Parallelograms (without reflection): 180-degree symmetry
  if (
    shapeType === "rectangle" ||
    shapeType === "diamond" ||
    shapeType === "parallelogram" ||
    shapeType === "tangram_parallelogram"
  ) {
    const mod = diff % 180;
    return mod > 90 ? 180 - mod : mod;
  }

  // Right triangles do not have general 90/180 rotational symmetry, they must match their specific rotation
  return diff;
}

/**
 * Finds if a piece qualifies for snapping to any target
 */
export function findSnapResult(
  piece: GamePiece,
  targets: SnapTarget[],
  isStrict: boolean = false,
  gridSnapEnabled: boolean = false,
  gridSize: number = 20
): { snapped: boolean; x: number; y: number; rotation: number; targetId?: string } {
  const maxDistance = isStrict ? SNAP_DISTANCE_STRICT : SNAP_DISTANCE_FORGIVING;
  const maxAngleDiff = isStrict ? SNAP_ANGLE_STRICT : SNAP_ANGLE_FORGIVING;

  let bestTarget: SnapTarget | null = null;
  let bestDist = Infinity;

  for (const target of targets) {
    // Piece type must match. We also allow matching shapes by family if they are equivalent.
    // e.g., large_triangle_1 and large_triangle_2 are identical templates.
    const isLargeTriangleMatch = 
      (piece.type.startsWith("large_triangle") && target.type.startsWith("large_triangle"));
    const isSmallTriangleMatch = 
      (piece.type.startsWith("small_triangle") && target.type.startsWith("small_triangle"));
    const typeMatches = piece.type === target.type || isLargeTriangleMatch || isSmallTriangleMatch;

    if (!typeMatches) continue;

    const d = distance({ x: piece.x, y: piece.y }, { x: target.x, y: target.y });
    if (d < maxDistance && d < bestDist) {
      // Check rotation diff
      const rotDiff = getRotationDifference(piece.rotation, target.rotation, piece.type);
      if (rotDiff < maxAngleDiff) {
        bestDist = d;
        bestTarget = target;
      }
    }
  }

  if (bestTarget) {
    // To match correctly, we need to snap the piece's rotation to a symmetrical equivalent of the target's rotation.
    // If we have square symmetry, we'll snap to the closest 90 multiple of target.
    let snappedRotation = bestTarget.rotation;
    
    const baseDiff = normalizeAngle(piece.rotation - bestTarget.rotation);
    if (piece.type === "square" || piece.type === "tangram_square") {
      const offset = Math.round(baseDiff / 90) * 90;
      snappedRotation = normalizeAngle(bestTarget.rotation + offset);
    } else if (
      piece.type === "rectangle" ||
      piece.type === "diamond" ||
      piece.type === "parallelogram" ||
      piece.type === "tangram_parallelogram"
    ) {
      const offset = Math.round(baseDiff / 180) * 180;
      snappedRotation = normalizeAngle(bestTarget.rotation + offset);
    } else if (piece.type === "circle") {
      snappedRotation = piece.rotation; // keep current rotation for circle
    }

    return {
      snapped: true,
      x: bestTarget.x,
      y: bestTarget.y,
      rotation: snappedRotation,
      targetId: bestTarget.id,
    };
  }

  // Grid Snapping fallback if enabled and not matched to a silhouette spot
  if (gridSnapEnabled) {
    const rx = Math.round(piece.x / gridSize) * gridSize;
    const ry = Math.round(piece.y / gridSize) * gridSize;
    // Round rotation to nearest 45
    const rr = Math.round(piece.rotation / 45) * 45;
    
    return {
      snapped: true,
      x: rx,
      y: ry,
      rotation: normalizeAngle(rr),
    };
  }

  return {
    snapped: false,
    x: piece.x,
    y: piece.y,
    rotation: piece.rotation,
  };
}
