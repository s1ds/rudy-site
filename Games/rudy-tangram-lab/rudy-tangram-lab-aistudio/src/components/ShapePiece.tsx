/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { RotateCw, RotateCcw } from "lucide-react";
import { GamePiece, PRESCHOOL_TEMPLATES } from "../game/pieces";
import { pointsToSVGString } from "../game/geometry";

interface ShapePieceProps {
  key?: string;
  piece: GamePiece;
  isSelected: boolean;
  isLightBoxMode: boolean;
  onSelect: (e: React.PointerEvent<SVGElement>) => void;
  onRotateCentroid: (degree: number) => void;
  reducedMotion: boolean;
}

export default function ShapePiece({
  piece,
  isSelected,
  isLightBoxMode,
  onSelect,
  onRotateCentroid,
  reducedMotion,
}: ShapePieceProps) {
  const { id, type, points, customPath, isCircle, radius, color, x, y, rotation, scale, isLocked } = piece;

  const [rotateDrag, setRotateDrag] = React.useState<{
    startAngle: number;
    startRefRotation: number;
  } | null>(null);

  const getSVGCoords = (e: React.PointerEvent) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 900;
    const py = ((e.clientY - rect.top) / rect.height) * 580;
    return { x: px, y: py };
  };

  const handleRotateRingDown = (e: React.PointerEvent<SVGGElement>) => {
    e.stopPropagation();
    if (isLocked) return;
    const coords = getSVGCoords(e);
    if (!coords) return;

    // Calculate angle in degrees from center x, y
    const angleRad = Math.atan2(coords.y - y, coords.x - x);
    const angleDeg = angleRad * (180 / Math.PI);

    setRotateDrag({
      startAngle: angleDeg,
      startRefRotation: rotation,
    });

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleRotateRingMove = (e: React.PointerEvent<SVGGElement>) => {
    if (!rotateDrag) return;
    e.stopPropagation();
    const coords = getSVGCoords(e);
    if (!coords) return;

    const angleRad = Math.atan2(coords.y - y, coords.x - x);
    const angleDeg = angleRad * (180 / Math.PI);

    const deltaDeg = angleDeg - rotateDrag.startAngle;
    let targetRotation = (rotateDrag.startRefRotation + deltaDeg) % 360;
    if (targetRotation < 0) targetRotation += 360;

    const roundedTarget = Math.round(targetRotation);
    const deltaFromCurrent = roundedTarget - rotation;
    if (deltaFromCurrent !== 0) {
      onRotateCentroid(deltaFromCurrent);
    }
  };

  const handleRotateRingUp = (e: React.PointerEvent<SVGGElement>) => {
    setRotateDrag(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGElement>) => {
    // Prevent standard scrolling on mobile while dragging pieces
    e.preventDefault();
    if (isLocked) return;
    onSelect(e);
  };

  const pointsString = pointsToSVGString(points);

  // Translucent styling for Light Box Mode, solid but rich for normal
  const fillOpacity = isLightBoxMode ? "0.74" : "0.95";
  const glowShadow = isLightBoxMode
    ? "drop-shadow(0 0 12px " + color + "B4)"
    : isSelected
    ? "drop-shadow(0 0 8px rgba(99, 102, 241, 0.45))"
    : "drop-shadow(0 3px 4px rgba(15, 23, 42, 0.15))";

  // Build the main shape content path or polygon
  const renderShapeContent = () => {
    if (isCircle && radius) {
      return (
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill={color}
          fillOpacity={fillOpacity}
          stroke={isSelected ? "#6366f1" : "#1e293b"}
          strokeWidth={isSelected ? 3.5 : 2}
          strokeDasharray={isSelected ? "1 0" : undefined}
          className="transition-all"
        />
      );
    }

    if (customPath) {
      return (
        <path
          d={customPath}
          fill={color}
          fillOpacity={fillOpacity}
          stroke={isSelected ? "#6366f1" : "#1e293b"}
          strokeWidth={isSelected ? 3.5 : 2}
          className="transition-all"
        />
      );
    }

    return (
      <polygon
        points={pointsString}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={isSelected ? "#6366f1" : "#1e293b"}
        strokeWidth={isSelected ? 3.5 : 2}
        strokeLinejoin="round"
        className="transition-all"
      />
    );
  };

  // Acrylic translucent gleam/highlight to create 3D tactile block look
  const renderAcrylicGlossHighlight = () => {
    if (isCircle && radius) {
      return (
        <path
          d={`M -${radius * 0.7} -${radius * 0.4} A ${radius * 0.8} ${radius * 0.8} 0 0 1 ${radius * 0.4} -${radius * 0.7}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.35}
        />
      );
    }
    
    // Fallback simple highlight segment for polygons
    if (points && points.length > 2) {
      // Create a nice thin line along the top edges of the polygon
      const sortedByY = [...points].sort((a, b) => a.y - b.y);
      const topPt1 = sortedByY[0];
      const topPt2 = sortedByY[1];
      return (
        <line
          x1={topPt1.x * 0.8}
          y1={topPt1.y * 0.8}
          x2={topPt2.x * 0.8}
          y2={topPt2.y * 0.8}
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.3}
        />
      );
    }

    return null;
  };

  return (
    <g
      id={`piece-group-${id}`}
      style={{
        cursor: isLocked ? "default" : "grab",
        filter: glowShadow,
        transition: isLocked && !reducedMotion ? "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
      }}
    >
      {/* 1. Underlying selection halo backdrop ring */}
      {isSelected && !isLocked && (
        <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
          {isCircle && radius ? (
            <circle cx={0} cy={0} r={radius + 8} fill="none" stroke="#818cf8" strokeWidth={11} opacity={0.2} />
          ) : (
            // standard outer bound ring
            <circle cx={0} cy={0} r={65} fill="none" stroke="#818cf8" strokeWidth={11} opacity={0.2} />
          )}
        </g>
      )}

      {/* 2. Main interactive shape group */}
      <g
        className="game-piece-element"
        transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}
        onPointerDown={handlePointerDown}
      >
        {renderShapeContent()}
        {!isLocked && renderAcrylicGlossHighlight()}

        {/* Locked star emblem to indicate completed lock-in state */}
        {isLocked && (
          <g transform="translate(0,0) scale(0.85)">
            {/* Draw a subtle padlock or golden check icon inside a circle */}
            <circle cx={0} cy={0} r={14} fill="#ffffff" stroke="#10b981" strokeWidth={2.5} />
            <path
              d="M-5,1 L-1,5 L5,-3"
              fill="none"
              stroke="#10b981"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </g>

      {/* 2.5 Tactile Rotation Ring for touch and drag rotating centered at center (x,y) */}
      {isSelected && !isLocked && (
        <g
          id={`rotate-ring-group-${id}`}
          transform={`translate(${x}, ${y})`}
          onPointerDown={handleRotateRingDown}
          onPointerMove={handleRotateRingMove}
          onPointerUp={handleRotateRingUp}
          onPointerCancel={handleRotateRingUp}
          className="cursor-pointer select-none touch-none group/ring"
        >
          {/* Visual Dashed Outline Ring */}
          <circle
            cx={0}
            cy={0}
            r={82}
            fill="none"
            stroke={rotateDrag ? "#6366f1" : "#818cf8"}
            strokeWidth={rotateDrag ? 4.5 : 3.5}
            strokeDasharray="6 4"
            className="opacity-75 group-hover/ring:opacity-100 transition-opacity"
          />
          {/* Ultra wide invisible interaction bounding path to make touch dragging super robust */}
          <circle
            cx={0}
            cy={0}
            r={82}
            fill="none"
            stroke="transparent"
            strokeWidth={22}
          />

          {/* Compass Pointer Anchors at key directions */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angleOffset) => {
            const rad = (angleOffset * Math.PI) / 180;
            // Place anchor beads perfectly on the ring
            const hx = Math.cos(rad) * 82;
            const hy = Math.sin(rad) * 82;
            const isPole = angleOffset % 90 === 0;

            return (
              <g key={angleOffset} transform={`translate(${hx}, ${hy}) rotate(${angleOffset + 90})`}>
                <circle
                  cx={0}
                  cy={0}
                  r={isPole ? 6 : 4.5}
                  fill={rotateDrag ? "#6366f1" : "#ffffff"}
                  stroke="#6366f1"
                  strokeWidth={2}
                  className="transition-all transform hover:scale-125"
                />
              </g>
            );
          })}

          {/* Glowing ring animation hint */}
          <circle
            cx={0}
            cy={0}
            r={92}
            fill="none"
            stroke="#818cf8"
            strokeWidth={2}
            opacity={rotateDrag ? 0.3 : 0.12}
            className={rotateDrag ? "none" : "animate-pulse"}
          />
        </g>
      )}

      {/* 3. Accessible rotation helper tabs (anchored above the piece in workspace coordinates) */}
      {isSelected && !isLocked && (
        <g transform={`translate(${x}, ${y - 82})`}>
          {/* Rotator backdrop plate */}
          <rect
            x={-60}
            y={-18}
            width={120}
            height={36}
            rx={18}
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth={1}
            filter="drop-shadow(0 4px 6px rgba(15, 23, 42, 0.15))"
          />

          {/* Counterclockwise Tapper */}
          <g
            id={`rotate-ccw-${id}`}
            className="cursor-pointer group"
            onPointerDown={(e) => {
              e.stopPropagation();
              onRotateCentroid(-45);
            }}
          >
            <circle cx={-30} cy={0} r={14} fill="#f1f5f9" className="group-hover:fill-indigo-50" />
            <g transform="translate(-30, 0) scale(0.8) translate(-10, -10)">
              <RotateCcw className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
            </g>
          </g>

          {/* Angle indicator label */}
          <text
            x={0}
            y={4}
            textAnchor="middle"
            className="font-mono text-[10px] font-bold fill-slate-500"
          >
            {rotation}°
          </text>

          {/* Clockwise Tapper */}
          <g
            id={`rotate-cw-${id}`}
            className="cursor-pointer group"
            onPointerDown={(e) => {
              e.stopPropagation();
              onRotateCentroid(45);
            }}
          >
            <circle cx={30} cy={0} r={14} fill="#f1f5f9" className="group-hover:fill-indigo-50" />
            <g transform="translate(30, 0) scale(0.8) translate(-10, -10)">
              <RotateCw className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
            </g>
          </g>
        </g>
      )}
    </g>
  );
}
