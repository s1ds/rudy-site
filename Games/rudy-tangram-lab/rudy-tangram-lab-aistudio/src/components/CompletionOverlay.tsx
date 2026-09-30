/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Sparkles, ArrowRight, RotateCcw, Award } from "lucide-react";
import { SHAPE_COLORS } from "../game/constants";

interface CompletionOverlayProps {
  onNextLevel: (() => void) | null;
  onRestart: () => void;
  levelTitle: string;
  reducedMotion: boolean;
}

interface ConfettiPiece {
  id: number;
  type: "triangle" | "square" | "circle" | "star";
  color: string;
  left: number; // percentage 0 - 100
  delay: number; // seconds
  size: number; // pixels
  duration: number; // seconds
}

export default function CompletionOverlay({
  onNextLevel,
  onRestart,
  levelTitle,
  reducedMotion,
}: CompletionOverlayProps) {
  const [particles, setParticles] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (reducedMotion) return;

    // Generate 25 playful floating pieces
    const colors = Object.values(SHAPE_COLORS);
    const types: ("triangle" | "square" | "circle" | "star")[] = ["triangle", "square", "circle", "star"];
    
    const count = 30;
    const items: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        type: types[i % types.length],
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 92 + 4, // 4% to 96%
        delay: Math.random() * 2.5, // stagger delays up to 2.5s
        size: Math.random() * 24 + 14, // 14px to 38px
        duration: Math.random() * 3 + 4, // 4s to 7s floating time
      });
    }
    setParticles(items);
  }, [reducedMotion]);

  const renderParticleSvg = (p: ConfettiPiece) => {
    const size = p.size;
    const color = p.color;
    
    switch (p.type) {
      case "square":
        return <rect width={size} height={size} fill={color} rx={4} transform="rotate(15)" />;
      case "circle":
        return <circle r={size / 2} cx={size / 2} cy={size / 2} fill={color} />;
      case "triangle":
        return (
          <polygon
            points={`0,${size} ${size / 2},0 ${size},${size}`}
            fill={color}
            transform="rotate(45)"
          />
        );
      case "star":
      default:
        return (
          <path
            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
            fill={color}
            transform={`scale(${size / 24})`}
          />
        );
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-hidden rounded-3xl animate-fade-in">
      
      {/* Drifting shapes celebratory animation */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute bottom-0"
              style={{
                left: `${p.left}%`,
                animationName: "float-shape-up",
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                animationTimingFunction: "ease-out",
                animationFillMode: "both",
                animationIterationCount: "infinite",
              }}
            >
              <svg
                width={p.size * 1.5}
                height={p.size * 1.5}
                viewBox={`0 0 ${p.size * 1.5} ${p.size * 1.5}`}
                className="opacity-75 blur-[0.3px]"
              >
                <g transform={`translate(${p.size * 0.25}, ${p.size * 0.25})`}>
                  {renderParticleSvg(p)}
                </g>
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Celebration Panel card */}
      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border-4 border-emerald-400 p-8 text-center transform scale-100 transition-transform duration-300 animate-bounce-gentle">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-emerald-400 text-white p-4 rounded-full shadow-lg">
          <Award className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div className="flex justify-center items-center gap-1.5 mt-4 text-emerald-600 font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 fill-emerald-200" />
          <span>Success! Geometry Mastered!</span>
          <Sparkles className="w-4 h-4 fill-emerald-200" />
        </div>

        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
          Awesome Job, Rudy!
        </h2>
        
        <p className="text-slate-500 font-medium text-sm mt-2">
          You matched all the pieces in <span className="font-bold text-slate-700">“{levelTitle}”</span> perfectly. They light up and sparkle because they fit!
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 mt-6">
          <button
            id="completion-restart-btn"
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-slate-500 stroke-[2.5]" />
            <span>Play Again</span>
          </button>
          
          {onNextLevel ? (
            <button
              id="completion-next-btn"
              onClick={onNextLevel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl transition-all cursor-pointer shadow-md active:scale-95 text-lg"
            >
              <span>Next Level</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5] animate-pulse" />
            </button>
          ) : (
            <div className="flex-1 text-center py-2 text-indigo-600 font-bold text-sm flex items-center justify-center gap-1 bg-indigo-50 border border-indigo-100 rounded-2xl">
              🎉 All Levels Done!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
