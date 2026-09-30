/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  RotateCcw,
  Grid,
  Magnet,
  Volume2,
  VolumeX,
  Accessibility,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface ToolbarProps {
  gridSnap: boolean;
  onToggleGridSnap: () => void;
  targetSnap: boolean;
  onToggleTargetSnap: () => void;
  muted: boolean;
  onToggleMute: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onReset: () => void;
  onShowHint?: () => void;
  hintAvailable?: boolean;
  hintIndex?: number;
  totalHints?: number;
}

export default function Toolbar({
  gridSnap,
  onToggleGridSnap,
  targetSnap,
  onToggleTargetSnap,
  muted,
  onToggleMute,
  reducedMotion,
  onToggleReducedMotion,
  onReset,
  onShowHint,
  hintAvailable = false,
  hintIndex = 0,
  totalHints = 0,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border-4 border-[#3D2B1F] rounded-2xl shadow-[4px_4px_0px_rgba(61,43,31,0.15)] max-w-4xl mx-auto w-full text-[#3D2B1F]">
      {/* Target & Grid Snaps */}
      <div className="flex items-center gap-1.5">
        <button
          id="toolbar-btn-target-snap"
          onClick={onToggleTargetSnap}
          title="Toggle Target Magnetic Snapping"
          className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-extrabold rounded-xl border-2 transition-all cursor-pointer uppercase ${
            targetSnap
              ? "bg-[#4D96FF] border-[#3D2B1F] text-white shadow-sm"
              : "bg-white border-[#E2E8F0] text-[#3D2B1F]/70 hover:bg-slate-50"
          }`}
        >
          <Magnet className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Magnet Snap</span>
        </button>

        <button
          id="toolbar-btn-grid"
          onClick={onToggleGridSnap}
          title="Toggle Soft Placement Grid Alignment"
          className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-extrabold rounded-xl border-2 transition-all cursor-pointer uppercase ${
            gridSnap
              ? "bg-[#FFD93D] border-[#3D2B1F] text-[#3D2B1F] shadow-sm"
              : "bg-white border-[#E2E8F0] text-[#3D2B1F]/70 hover:bg-slate-50"
          }`}
        >
          <Grid className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Grid Snap</span>
        </button>
      </div>

      {/* Interactive Helper (Hint) & Reset */}
      <div className="flex items-center gap-1.5">
        {hintAvailable && onShowHint && (
          <button
            id="toolbar-btn-hint"
            onClick={onShowHint}
            className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-extrabold text-[#3D2B1F] bg-[#6BCB77] border-2 border-[#3D2B1F] hover:bg-[#5bb867] rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(61,43,31,1)] uppercase"
          >
            <HelpCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Hint ({hintIndex}/{totalHints})</span>
          </button>
        )}

        <button
          id="toolbar-btn-reset"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-black text-white bg-[#FF6B6B] hover:bg-[#e54848] border-2 border-[#3D2B1F] rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(61,43,31,1)] active:scale-95 uppercase"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>Reset Shapes</span>
        </button>
      </div>

      {/* Accessibility details & sound toggle */}
      <div className="flex items-center gap-1.5">
        {/* Motion Preference */}
        <button
          id="toolbar-btn-motion"
          onClick={onToggleReducedMotion}
          title={reducedMotion ? "Motion is simplified" : "Motion is enabled"}
          className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
            reducedMotion
              ? "bg-[#6BCB77] border-[#3D2B1F] text-white shadow-sm"
              : "bg-white border-[#E2E8F0] text-[#3D2B1F]/60 hover:bg-slate-50"
          }`}
        >
          <Accessibility className="w-4 h-4 stroke-[2.5] text-current" />
        </button>

        {/* Audio controls */}
        <button
          id="toolbar-btn-mute"
          onClick={onToggleMute}
          title={muted ? "Sound Effects Muted" : "Sound Effects ON"}
          className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
            muted
              ? "bg-white border-[#E2E8F0] text-[#3D2B1F]/40 hover:bg-slate-50"
              : "bg-[#FFD93D] border-[#3D2B1F] text-[#3D2B1F] shadow-sm"
          }`}
        >
          {muted ? <VolumeX className="w-4 h-4 stroke-[2.5]" /> : <Volume2 className="w-4 h-4 stroke-[2.5]" />}
        </button>
      </div>
    </div>
  );
}
