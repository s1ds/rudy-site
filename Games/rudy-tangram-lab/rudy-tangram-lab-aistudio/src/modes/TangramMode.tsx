/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GameLevel } from "../game/levels";
import { GamePiece } from "../game/pieces";
import { Layers, Trophy, Sparkles, HelpCircle, Cat, Type, Compass } from "lucide-react";
import GameBoard from "../components/GameBoard";

interface TangramModeProps {
  levels: GameLevel[];
  activeLevelIndex: number;
  onSelectLevelIndex: (index: number) => void;
  activeCategory: "animals" | "abc" | "things";
  onChangeCategory: (category: "animals" | "abc" | "things") => void;
  pieces: GamePiece[];
  onSetPieces: (pieces: GamePiece[]) => void;
  completedLevelIds: string[];
  gridSnapEnabled: boolean;
  targetSnapEnabled: boolean;
  reducedMotion: boolean;
  selectedPieceId: string | null;
  onSelectPiece: (id: string | null) => void;
  onSnapPiece: (pieceId: string) => void;
  hintIndex: number;
}

export default function TangramMode({
  levels,
  activeLevelIndex,
  onSelectLevelIndex,
  activeCategory,
  onChangeCategory,
  pieces,
  onSetPieces,
  completedLevelIds,
  gridSnapEnabled,
  targetSnapEnabled,
  reducedMotion,
  selectedPieceId,
  onSelectPiece,
  onSnapPiece,
  hintIndex,
}: TangramModeProps) {
  // Graceful fallback if index goes out of range
  const currentLevel = levels[activeLevelIndex] || levels[0];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Category Selection Tabs - Large kid-friendly tactile buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full select-none">
        <button
          id="btn-cat-animals"
          onClick={() => onChangeCategory("animals")}
          className={`px-5 py-4 rounded-3xl font-black text-base flex items-center justify-center gap-2.5 border-4 transition-all cursor-pointer shadow-[4px_4px_0px_#3D2B1F] ${
            activeCategory === "animals"
              ? "bg-[#FF6B6B] border-[#3D2B1F] text-white -translate-y-1"
              : "bg-white hover:bg-[#FFF5F5] border-[#3D2B1F]/10 hover:border-[#3D2B1F] text-[#3D2B1F]"
          }`}
        >
          <Cat className="w-5.5 h-5.5" />
          <span>Animals 🦁</span>
        </button>

        <button
          id="btn-cat-abc"
          onClick={() => onChangeCategory("abc")}
          className={`px-5 py-4 rounded-3xl font-black text-base flex items-center justify-center gap-2.5 border-4 transition-all cursor-pointer shadow-[4px_4px_0px_#3D2B1F] ${
            activeCategory === "abc"
              ? "bg-[#4D96FF] border-[#3D2B1F] text-white -translate-y-1"
              : "bg-white hover:bg-[#EEF2FF] border-[#3D2B1F]/10 hover:border-[#3D2B1F] text-[#3D2B1F]"
          }`}
        >
          <Type className="w-5.5 h-5.5" />
          <span>Letters ABC 🔠</span>
        </button>

        <button
          id="btn-cat-things"
          onClick={() => onChangeCategory("things")}
          className={`px-5 py-4 rounded-3xl font-black text-base flex items-center justify-center gap-2.5 border-4 transition-all cursor-pointer shadow-[4px_4px_0px_#3D2B1F] ${
            activeCategory === "things"
              ? "bg-[#6BCB77] border-[#3D2B1F] text-white -translate-y-1"
              : "bg-white hover:bg-[#F3FEB8] border-[#3D2B1F]/10 hover:border-[#3D2B1F] text-[#3D2B1F]"
          }`}
        >
          <Compass className="w-5.5 h-5.5" />
          <span>Things 🎈</span>
        </button>
      </div>

      {/* Sequence Navigation Bar */}
      <div className="flex items-center justify-between bg-white border-4 border-[#3D2B1F] p-4 rounded-3xl shadow-[4px_4px_0px_#3D2B1F] select-none text-[#3D2B1F]">
        <button
          id="btn-level-back"
          disabled={activeLevelIndex === 0}
          onClick={() => {
            if (activeLevelIndex > 0) {
              onSelectLevelIndex(activeLevelIndex - 1);
            }
          }}
          className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-1.5 border-3 transition-all cursor-pointer ${
            activeLevelIndex === 0
              ? "bg-slate-100 border-[#3D2B1F]/10 text-gray-400 cursor-not-allowed opacity-50"
              : "bg-[#FFD93D] hover:bg-[#F9D026] border-[#3D2B1F] shadow-[3px_3px_0px_#3D2B1F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#3D2B1F]"
          }`}
        >
          <span>⬅ Back</span>
        </button>

        <span className="font-extrabold text-[#3D2B1F] uppercase text-xs sm:text-sm tracking-wide text-center">
          {activeCategory === "abc" ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="text-sm font-black hidden sm:inline">Letter</span>
              <span className="bg-[#4D96FF] text-white px-3 py-1 rounded-full text-base font-black border-2 border-[#3D2B1F]">
                {String.fromCharCode(65 + activeLevelIndex)}
              </span>
              <span>of 26</span>
            </span>
          ) : (
            <span>Puzzle {activeLevelIndex + 1} of {levels.length}</span>
          )}
        </span>

        <button
          id="btn-level-next"
          disabled={activeLevelIndex === levels.length - 1}
          onClick={() => {
            if (activeLevelIndex < levels.length - 1) {
              onSelectLevelIndex(activeLevelIndex + 1);
            }
          }}
          className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-1.5 border-3 transition-all cursor-pointer ${
            activeLevelIndex === levels.length - 1
              ? "bg-slate-100 border-[#3D2B1F]/10 text-gray-400 cursor-not-allowed opacity-50"
              : "bg-[#6BCB77] hover:bg-[#5CB868] border-[#3D2B1F] text-white shadow-[3px_3px_0px_#3D2B1F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#3D2B1F]"
          }`}
        >
          <span>Next ➡</span>
        </button>
      </div>

      {/* Level Header and Selector Row */}
      <div className="bg-[#FFFBEB] border-4 border-[#3D2B1F] p-5 rounded-3xl shadow-[4px_4px_0px_rgba(61,43,31,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4 text-[#3D2B1F]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#EEF2FF] text-[#4D96FF] border-2 border-[#4D96FF] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span className="capitalize">{activeCategory} Category</span>
            </span>
            <span className="text-slate-400 text-xs font-semibold">•</span>
            <span className="text-[#3D2B1F]/60 font-black text-xs uppercase">Difficulty: {currentLevel?.difficulty || "Easy"}</span>
          </div>
          
          <h2 className="text-xl font-black text-[#3D2B1F] tracking-tight mt-1.5 flex items-center gap-1.5 uppercase">
            <span>Puzzle {activeLevelIndex + 1}: {currentLevel?.title || "Loading..."}</span>
          </h2>
          <p className="text-[#3D2B1F]/80 font-bold text-xs sm:text-sm mt-0.5">
            {currentLevel?.description || ""} <strong className="text-[#3D2B1F] font-black underline">Drag</strong> the pieces into place or rotate using the ring/keyboard!
          </p>
        </div>

        {/* Level Selectors */}
        <div className="flex flex-wrap gap-2 self-start md:self-center">
          {levels.map((lvl, index) => {
            const isCompleted = completedLevelIds.includes(lvl.id);
            const isActive = index === activeLevelIndex;
            
            return (
              <button
                key={lvl.id}
                id={`level-pills-tangram-${index}`}
                onClick={() => onSelectLevelIndex(index)}
                className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border-2 transition-all cursor-pointer relative ${
                  isActive
                    ? "bg-[#4D96FF] border-[#3D2B1F] text-white shadow-[2px_2px_0px_rgba(61,43,31,1)] scale-105"
                    : "bg-white hover:bg-[#EEF2FF] border-[#E2E8F0] hover:border-[#3D2B1F] text-[#3D2B1F]/70"
                }`}
              >
                {index + 1}
                {isCompleted && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-0.5 shadow-sm border border-[#3D2B1F]">
                    <Trophy className="w-2.5 h-2.5 fill-white stroke-none" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary SVG Game Arena */}
      {currentLevel && (
        <GameBoard
          pieces={pieces}
          onChangePieces={onSetPieces}
          targets={currentLevel.targets}
          onSnapPiece={onSnapPiece}
          selectedPieceId={selectedPieceId}
          onSelectPiece={onSelectPiece}
          isLightBoxMode={false} // Solid classic silhouette style
          gridSnapEnabled={gridSnapEnabled}
          targetSnapEnabled={targetSnapEnabled}
          reducedMotion={reducedMotion}
          hintIndex={hintIndex}
        />
      )}
    </div>
  );
}
