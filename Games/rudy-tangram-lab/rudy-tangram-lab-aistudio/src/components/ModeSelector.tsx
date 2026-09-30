/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Milestone, Layers, Lightbulb } from "lucide-react";

export type GameMode = "free_play" | "shape_match" | "tangram" | "light_box";

interface ModeSelectorProps {
  activeMode: GameMode;
  onChangeMode: (mode: GameMode) => void;
  reducedMotion?: boolean;
}

export default function ModeSelector({ activeMode, onChangeMode, reducedMotion = false }: ModeSelectorProps) {
  const modes = [
    {
      id: "free_play" as GameMode,
      name: "Free Play",
      desc: "Drag & Arrange Freely",
      icon: Sparkles,
      activeBg: "bg-[#FFD93D] border-4 border-[#3D2B1F] text-[#3D2B1F] shadow-[4px_4px_0px_rgba(61,43,31,1)]",
      inactiveBg: "bg-white hover:bg-[#FFFBEB] text-[#3D2B1F]/80 border-2 border-[#E2E8F0]",
    },
    {
      id: "shape_match" as GameMode,
      name: "Shape Match",
      desc: "Preschool Sorting Lab",
      icon: Milestone,
      activeBg: "bg-[#FF6B6B] border-4 border-[#3D2B1F] text-white shadow-[4px_4px_0px_rgba(61,43,31,1)]",
      inactiveBg: "bg-white hover:bg-[#FFF5F5] text-[#3D2B1F]/80 border-2 border-[#E2E8F0]",
    },
    {
      id: "tangram" as GameMode,
      name: "Classic Tangram",
      desc: "Solve Silhouette Puzzles",
      icon: Layers,
      activeBg: "bg-[#4D96FF] border-4 border-[#3D2B1F] text-white shadow-[4px_4px_0px_rgba(61,43,31,1)]",
      inactiveBg: "bg-white hover:bg-[#EEF2FF] text-[#3D2B1F]/80 border-2 border-[#E2E8F0]",
    },
    {
      id: "light_box" as GameMode,
      name: "Light Box",
      desc: "Glowing Translucent Glass",
      icon: Lightbulb,
      activeBg: "bg-[#6BCB77] border-4 border-[#3D2B1F] text-white shadow-[4px_4px_0px_rgba(61,43,31,1)]",
      inactiveBg: "bg-white hover:bg-[#ECFDF5] text-[#3D2B1F]/80 border-2 border-[#E2E8F0]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full max-w-4xl mx-auto p-3 bg-white border-4 border-[#F4B400] rounded-3xl shadow-sm">
      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        const Icon = mode.icon;
        
        return (
          <button
            key={mode.id}
            id={`mode-btn-${mode.id}`}
            onClick={() => onChangeMode(mode.id)}
            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border text-center font-bold tracking-tight transition-all ${
              !reducedMotion ? "duration-300 transform active:scale-95" : ""
            } ${isActive ? mode.activeBg : mode.inactiveBg} cursor-pointer relative group overflow-hidden`}
          >
            <div className={`p-2 rounded-xl mb-1.5 transition-colors ${isActive ? "bg-white/20 text-current" : "bg-slate-50 group-hover:bg-slate-100"}`}>
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
            </div>
            
            <span className="font-extrabold text-xs sm:text-sm tracking-tight uppercase">{mode.name}</span>
            <span className="text-[10px] opacity-75 hidden sm:inline mt-0.5 font-bold uppercase">{mode.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
