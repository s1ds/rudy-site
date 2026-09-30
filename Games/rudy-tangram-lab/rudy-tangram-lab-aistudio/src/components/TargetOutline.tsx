/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SnapTarget } from "../game/snapping";
import { PRESCHOOL_TEMPLATES, TANGRAM_TEMPLATES, ShapeTemplate } from "../game/pieces";
import { pointsToSVGString } from "../game/geometry";

interface TargetOutlineProps {
  key?: string;
  target: SnapTarget;
  revealHintSlot: boolean; // Reveal faint inner outlines if hint sequence is active
  isUnifiedSilhouetteMode: boolean; // Solid charcoal for classic Tangram puzzle silhouette
}

export default function TargetOutline({
  target,
  revealHintSlot,
  isUnifiedSilhouetteMode,
}: TargetOutlineProps) {
  const { id, type, x, y, rotation, scale } = target;

  // Find matching template to draw the outline geometry
  let template: ShapeTemplate | undefined = PRESCHOOL_TEMPLATES[type] || TANGRAM_TEMPLATES[type];

  // Families fallback
  if (!template) {
    if (type.startsWith("large_triangle")) {
      template = TANGRAM_TEMPLATES["large_triangle_1"];
    } else if (type.startsWith("small_triangle")) {
      template = TANGRAM_TEMPLATES["small_triangle_1"];
    }
  }

  if (!template) return null;

  const pointsString = pointsToSVGString(template.points);

  // Dynamic values depending on game modes
  let fillTheme = "rgba(226, 232, 240, 0.55)"; // neutral light grey
  let strokeColor = "#a1a1aa"; // slate-300
  let strokeDash = "5 4";
  let strokeW = 2;

  if (isUnifiedSilhouetteMode) {
    // True classic solid dark silhouette shadow so individual piece divisions are hidden
    fillTheme = "#334155"; // deep slate-700
    strokeColor = "#1e293b"; // slate-800
    strokeDash = "none";
    strokeW = 1.5;
  } else {
    // Child shape matching guidelines
    strokeColor = "#818cf8"; // indigo pastel
    fillTheme = "rgba(238, 242, 255, 0.6)"; 
    strokeDash = "4 4";
    strokeW = 2.5;
  }

  // Draw circle or path or general polygon
  const renderOutlineContent = () => {
    if (template.isCircle && template.radius) {
      return (
        <circle
          cx={0}
          cy={0}
          r={template.radius}
          fill={fillTheme}
          stroke={strokeColor}
          strokeWidth={strokeW}
          strokeDasharray={strokeDash}
        />
      );
    }

    if (template.customPath) {
      return (
        <path
          d={template.customPath}
          fill={fillTheme}
          stroke={strokeColor}
          strokeWidth={strokeW}
          strokeDasharray={strokeDash}
        />
      );
    }

    return (
      <polygon
        points={pointsString}
        fill={fillTheme}
        stroke={strokeColor}
        strokeWidth={strokeW}
        strokeLinejoin="round"
        strokeDasharray={strokeDash}
      />
    );
  };

  // Helper dashed highlighter overlay that appears to guide children
  const renderHintOverlay = () => {
    if (!revealHintSlot) return null;

    const overlayStroke = "#10b981"; // emerald-500 guides the matching
    const overlayFill = "rgba(209, 250, 229, 0.25)"; // light green shimmer

    if (template.isCircle && template.radius) {
      return (
        <circle
          cx={0}
          cy={0}
          r={template.radius}
          fill={overlayFill}
          stroke={overlayStroke}
          strokeWidth={3}
          strokeDasharray="6 3"
          className="animate-pulse"
        />
      );
    }

    if (template.customPath) {
      return (
        <path
          d={template.customPath}
          fill={overlayFill}
          stroke={overlayStroke}
          strokeWidth={3}
          strokeDasharray="6 3"
          className="animate-pulse"
        />
      );
    }

    return (
      <polygon
        points={pointsString}
        fill={overlayFill}
        stroke={overlayStroke}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeDasharray="6 3"
        className="animate-pulse"
      />
    );
  };

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {/* 1. Underlying Base Target outline */}
      {renderOutlineContent()}

      {/* 2. Highlight Sequence hint Overlay (revealed sequentially by hint counter) */}
      {renderHintOverlay()}
      
      {/* 3. Little text guide label for preschool mode so kids recognize shape names */}
      {!isUnifiedSilhouetteMode && (
        <g transform="translate(0, 0)">
          <rect
            x={-35}
            y={-9}
            width={70}
            height={18}
            rx={9}
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth={1}
            opacity={0.85}
          />
          <text
            y={3}
            textAnchor="middle"
            className="font-semibold text-[8px] fill-slate-500 tracking-wider uppercase"
          >
            {template.label}
          </text>
        </g>
      )}
    </g>
  );
}
