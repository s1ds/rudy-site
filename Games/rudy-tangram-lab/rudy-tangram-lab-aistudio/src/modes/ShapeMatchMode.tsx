/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GameLevel } from "../game/levels";
import { GamePiece } from "../game/pieces";
import { CheckCircle2, GraduationCap, Trophy, ChevronRight, HelpCircle } from "lucide-react";
import GameBoard from "../components/GameBoard";

interface ShapeMatchModeProps {
  levels: GameLevel[];
  activeLevelIndex: number;
  onSelectLevelIndex: (index: number) => void;
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

export default function ShapeMatchMode({
  levels,
  activeLevelIndex,
  onSelectLevelIndex,
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
}: ShapeMatchModeProps) {
  const currentLevel = levels[activeLevelIndex];

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto">
      {/* Level Header and Selector Row */}
      <div className="bg-[#FFFBEB] border-4 border-[#3D2B1F] p-5 rounded-3xl shadow-[4px_4px_0px_rgba(61,43,31,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4 text-[#3D2B1F]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF5F5] text-[#FF6B6B] border-2 border-[#FF6B6B] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Shape Sorter Lab</span>
            </span>
            <span className="text-slate-400 text-xs font-semibold">•</span>
            <span className="text-[#3D2B1F]/60 font-black text-xs uppercase">Difficulty: {currentLevel.difficulty}</span>
          </div>
          
          <h2 className="text-xl font-black text-[#3D2B1F] tracking-tight mt-1.5 flex items-center gap-1.5 uppercase">
            <span>Level {activeLevelIndex + 1}: {currentLevel.title}</span>
          </h2>
          <p className="text-[#3D2B1F]/80 font-bold text-xs sm:text-sm mt-0.5">
            {currentLevel.description}
          </p>
        </div>

        {/* Level Pager pills */}
        <div className="flex flex-wrap gap-2 self-start md:self-center">
          {levels.map((lvl, index) => {
            const isCompleted = completedLevelIds.includes(lvl.id);
            const isActive = index === activeLevelIndex;
            
            return (
              <button
                key={lvl.id}
                id={`level-pills-sorter-${index}`}
                onClick={() => onSelectLevelIndex(index)}
                className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border-2 transition-all cursor-pointer relative ${
                  isActive
                    ? "bg-[#FF6B6B] border-[#3D2B1F] text-white shadow-[2px_2px_0px_rgba(61,43,31,1)] scale-105"
                    : "bg-white hover:bg-[#FFF5F5] border-[#E2E8F0] text-[#3D2B1F]/70 hover:border-[#3D2B1F]"
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
      <GameBoard
        pieces={pieces}
        onChangePieces={onSetPieces}
        targets={currentLevel.targets}
        onSnapPiece={onSnapPiece}
        selectedPieceId={selectedPieceId}
        onSelectPiece={onSelectPiece}
        isLightBoxMode={false}
        gridSnapEnabled={gridSnapEnabled}
        targetSnapEnabled={targetSnapEnabled}
        reducedMotion={reducedMotion}
        hintIndex={hintIndex}
      />
    </div>
  );
}
