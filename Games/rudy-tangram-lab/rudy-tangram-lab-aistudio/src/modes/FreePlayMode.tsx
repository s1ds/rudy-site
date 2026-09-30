/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GamePiece, createPieceFromTemplate, PRESCHOOL_TEMPLATES, getDefaultPreschoolPieces } from "../game/pieces";
import { SnapTarget } from "../game/snapping";
import { Trash2, Eraser, Sparkles, Wand2 } from "lucide-react";
import GameBoard from "../components/GameBoard";
import ShapeTray from "../components/ShapeTray";
import { sounds } from "../game/sounds";

interface FreePlayModeProps {
  pieces: GamePiece[];
  onSetPieces: (pieces: GamePiece[]) => void;
  gridSnapEnabled: boolean;
  targetSnapEnabled: boolean;
  reducedMotion: boolean;
  selectedPieceId: string | null;
  onSelectPiece: (id: string | null) => void;
}

export default function FreePlayMode({
  pieces,
  onSetPieces,
  gridSnapEnabled,
  targetSnapEnabled,
  reducedMotion,
  selectedPieceId,
  onSelectPiece,
}: FreePlayModeProps) {
  
  const handleSpawnShape = (shapeType: string, color: string) => {
    const template = PRESCHOOL_TEMPLATES[shapeType];
    if (!template) return;

    // Spawn slightly staggered in center of the board
    const staggeredOffset = (pieces.length * 15) % 80;
    const x = 450 + staggeredOffset;
    const y = 220 + staggeredOffset;

    const newPiece = createPieceFromTemplate(
      `free_${shapeType}_${Date.now()}`,
      template,
      color,
      x,
      y,
      0
    );

    sounds.playSnap();
    onSetPieces([...pieces, newPiece]);
    onSelectPiece(newPiece.id); // auto select newly spawned piece
  };

  const handleDeleteSelected = () => {
    if (!selectedPieceId) return;
    sounds.playBounce();
    onSetPieces(pieces.filter((p) => p.id !== selectedPieceId));
    onSelectPiece(null);
  };

  const handleClearSandbox = () => {
    sounds.playBounce();
    onSetPieces([]);
    onSelectPiece(null);
  };

  const handleScatterRandom = () => {
    sounds.playChime();
    const colors = [
      "#F43F5E", "#F97316", "#FBBF24", "#10B981", "#14B8A6", "#0EA5E9", "#8B5CF6", "#EC4899"
    ];
    
    onSetPieces(
      pieces.map((p) => {
        const randX = Math.floor(Math.random() * 560) + 170;
        const randY = Math.floor(Math.random() * 260) + 100;
        const randRot = Math.round((Math.random() * 360) / 45) * 45;
        const randColor = colors[Math.floor(Math.random() * colors.length)];
        return {
          ...p,
          x: randX,
          y: randY,
          rotation: randRot,
          color: randColor,
          layer: Date.now(),
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto">
      {/* Description header card */}
      <div className="bg-[#FFFBEB] border-4 border-[#3D2B1F] p-5 rounded-3xl shadow-[4px_4px_0px_rgba(61,43,31,0.15)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[#3D2B1F]">
        <div>
          <h2 className="text-xl font-black text-[#3D2B1F] tracking-tight flex items-center gap-1.5 uppercase">
            <Sparkles className="w-5 h-5 text-[#FFD93D] fill-[#FFD93D]/20 stroke-[2.5]" />
            <span>Rudy's Creative Toy Box</span>
          </h2>
          <p className="text-[#3D2B1F]/80 font-bold text-xs sm:text-sm mt-0.5 animate-pulse">
            There are NO target outlines here! Create as many shapes as you like, rotate them, and design houses, animals, or letters.
          </p>
        </div>

        {/* Rapid control sidebar actions */}
        <div className="flex gap-2 self-start sm:self-center">
          <button
            id="freeplay-scatter-btn"
            onClick={handleScatterRandom}
            disabled={pieces.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-[#FFD93D] text-[#3D2B1F] hover:bg-[#ffe66d] border-2 border-[#3D2B1F] rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(61,43,31,1)] disabled:opacity-40 disabled:cursor-not-allowed uppercase"
            title="Randomize coordinates of all pieces"
          >
            <Wand2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Mix Magic</span>
          </button>
          
          <button
            id="freeplay-delete-btn"
            onClick={handleDeleteSelected}
            disabled={!selectedPieceId}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-[#FF6B6B] text-white hover:bg-[#e54848] border-2 border-[#3D2B1F] rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(61,43,31,1)] disabled:opacity-40 disabled:cursor-not-allowed uppercase"
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Trash Block</span>
          </button>

          <button
            id="freeplay-clear-all-btn"
            onClick={handleClearSandbox}
            disabled={pieces.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-white text-[#FF6B6B] border-2 border-[#FF6B6B] hover:bg-rose-50 rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(255,107,107,0.15)] disabled:opacity-40 disabled:cursor-not-allowed uppercase"
          >
            <Eraser className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Clear Grid</span>
          </button>
        </div>
      </div>

      {/* Main Board Area */}
      <GameBoard
        pieces={pieces}
        onChangePieces={onSetPieces}
        targets={[]}
        onSnapPiece={() => {
          // No snapping targets in Free Play, grid fallback is evaluated by board
          if (gridSnapEnabled && selectedPieceId) {
            sounds.playTick();
            onSetPieces(
              pieces.map((p) => {
                if (p.id !== selectedPieceId) return p;
                const rx = Math.round(p.x / 20) * 20;
                const ry = Math.round(p.y / 20) * 20;
                const rr = Math.round(p.rotation / 45) * 45;
                return {
                  ...p,
                  x: rx,
                  y: ry,
                  rotation: rr % 360,
                };
              })
            );
          }
        }}
        selectedPieceId={selectedPieceId}
        onSelectPiece={onSelectPiece}
        isLightBoxMode={false}
        gridSnapEnabled={gridSnapEnabled}
        targetSnapEnabled={targetSnapEnabled}
        reducedMotion={reducedMotion}
        hintIndex={0}
      />

      {/* Spawners menu */}
      <ShapeTray onSpawnShape={handleSpawnShape} reducedMotion={reducedMotion} />
    </div>
  );
}
