/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PRESCHOOL_TEMPLATES, ShapeTemplate } from "../game/pieces";
import { SHAPE_COLORS } from "../game/constants";
import { Plus } from "lucide-react";

interface ShapeTrayProps {
  onSpawnShape: (type: string, color: string) => void;
  reducedMotion: boolean;
}

export default function ShapeTray({ onSpawnShape, reducedMotion }: ShapeTrayProps) {
  // Sort the preschool shapes so they look beautifully cataloged
  const shapes = Object.keys(PRESCHOOL_TEMPLATES).map((key) => ({
    key,
    template: PRESCHOOL_TEMPLATES[key],
  }));

  // Playful candy palette rotation
  const spawnColors = [
    SHAPE_COLORS.red,
    SHAPE_COLORS.orange,
    SHAPE_COLORS.yellow,
    SHAPE_COLORS.teal,
    SHAPE_COLORS.blue,
    SHAPE_COLORS.purple,
    SHAPE_COLORS.pink,
    SHAPE_COLORS.green,
  ];

  const handleSpawn = (key: string, index: number) => {
    // Select color based on index
    const color = spawnColors[index % spawnColors.length];
    onSpawnShape(key, color);
  };

  const drawThumbnail = (t: ShapeTemplate, color: string) => {
    const size = 38;
    const center = size / 2;
    
    if (t.isCircle && t.radius) {
      return (
        <circle
          cx={center}
          cy={center}
          r={14}
          fill={color}
          stroke="#334155"
          strokeWidth={1.5}
        />
      );
    }

    if (t.customPath) {
      // Draw path scaled down
      return (
        <g transform={`translate(${center}, ${center}) scale(0.33)`}>
          <path
            d={t.customPath}
            fill={color}
            stroke="#334155"
            strokeWidth={4.5}
          />
        </g>
      );
    }

    // Polygons
    if (t.points && t.points.length > 0) {
      // Map local points to smaller thumbnail dimensions
      const scale = 0.3;
      const ptsString = t.points
        .map((p) => `${p.x * scale + center},${p.y * scale + center}`)
        .join(" ");
      return (
        <polygon
          points={ptsString}
          fill={color}
          stroke="#334155"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      );
    }

    return null;
  };

  return (
    <div className="bg-[#E0F2FE] border-4 border-[#4D96FF] rounded-3xl p-5 shadow-[4px_4px_0px_rgba(61,43,31,0.15)] w-full max-w-4xl mx-auto flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-sm text-[#3D2B1F] tracking-tight flex items-center gap-1.5 uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] border border-[#3D2B1F]" />
          <span>Tap to spawn colorful blocks:</span>
        </h3>
        <span className="text-[10px] bg-[#4D96FF] text-white px-2.5 py-0.5 rounded-full font-black uppercase border-2 border-[#3D2B1F]">
          Pre-school catalog
        </span>
      </div>

      <div className="grid grid-cols-5 md:grid-cols-10 gap-2.5 select-none">
        {shapes.map((item, index) => {
          const t = item.template;
          const displayColor = spawnColors[index % spawnColors.length];

          return (
            <button
              key={item.key}
              id={`spawn-btn-${item.key}`}
              onClick={() => handleSpawn(item.key, index)}
              className={`flex flex-col items-center p-2 bg-white hover:bg-[#FFFBEB] active:scale-95 border-2 border-[#3D2B1F] rounded-2xl cursor-pointer transition-all shadow-[2px_2px_0px_rgba(61,43,31,1)] ${
                !reducedMotion ? "duration-200" : ""
              }`}
              title={`Spawn a ${t.label}`}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl relative">
                <svg width={38} height={38} viewBox="0 0 38 38">
                  {drawThumbnail(t, displayColor)}
                </svg>
                {/* Plus badge */}
                <span className="absolute -bottom-1 -right-1 bg-[#4D96FF] text-white rounded-full p-0.5 border border-[#3D2B1F]">
                  <Plus className="w-2 h-2 stroke-[3]" />
                </span>
              </div>
              <span className="text-[9px] font-black text-[#3D2B1F] mt-1.5 truncate w-full text-center uppercase">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
