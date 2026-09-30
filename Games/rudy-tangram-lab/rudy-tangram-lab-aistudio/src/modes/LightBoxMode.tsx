/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { GamePiece, createPieceFromTemplate, PRESCHOOL_TEMPLATES } from "../game/pieces";
import { Sparkles, Trash2, Eraser, Lightbulb } from "lucide-react";
import GameBoard from "../components/GameBoard";
import ShapeTray from "../components/ShapeTray";
import { sounds } from "../game/sounds";
import { piecesOverlap } from "../game/collision";

interface LightBoxModeProps {
  pieces: GamePiece[];
  onSetPieces: (pieces: GamePiece[]) => void;
  gridSnapEnabled: boolean;
  targetSnapEnabled: boolean;
  reducedMotion: boolean;
  selectedPieceId: string | null;
  onSelectPiece: (id: string | null) => void;
}

interface OverlapPair {
  id: string;
  name1: string;
  name2: string;
  color1: string;
  color2: string;
}

export default function LightBoxMode({
  pieces,
  onSetPieces,
  gridSnapEnabled,
  targetSnapEnabled,
  reducedMotion,
  selectedPieceId,
  onSelectPiece,
}: LightBoxModeProps) {
  const [overlaps, setOverlaps] = useState<OverlapPair[]>([]);

  // Periodically check overlapping pieces to show a playful lab "color mixer readout"
  useEffect(() => {
    const pairs: OverlapPair[] = [];
    const checked = new Set<string>();

    for (let i = 0; i < pieces.length; i++) {
      for (let j = i + 1; j < pieces.length; j++) {
        const p1 = pieces[i];
        const p2 = pieces[j];
        if (piecesOverlap(p1, p2)) {
          const key = [p1.id, p2.id].sort().join("_");
          if (!checked.has(key)) {
            checked.add(key);
            pairs.push({
              id: key,
              name1: p1.label,
              name2: p2.label,
              color1: p1.color,
              color2: p2.color,
            });
          }
        }
      }
    }
    setOverlaps(pairs);
  }, [pieces]);

  const handleSpawnShape = (shapeType: string, color: string) => {
    const template = PRESCHOOL_TEMPLATES[shapeType];
    if (!template) return;

    // Spawn staggered in center of light table
    const staggeredOffset = (pieces.length * 20) % 100;
    const x = 450 + staggeredOffset;
    const y = 240 + staggeredOffset;

    const newPiece = createPieceFromTemplate(
      `lightbox_${shapeType}_${Date.now()}`,
      template,
      color,
      x,
      y,
      0
    );

    sounds.playSnap();
    onSetPieces([...pieces, newPiece]);
    onSelectPiece(newPiece.id);
  };

  const handleDeleteSelected = () => {
    if (!selectedPieceId) return;
    sounds.playBounce();
    onSetPieces(pieces.filter((p) => p.id !== selectedPieceId));
    onSelectPiece(null);
  };

  const handleClearTable = () => {
    sounds.playBounce();
    onSetPieces([]);
    onSelectPiece(null);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto animate-fade-in">
      
      {/* Lightbox controls & notifications row */}
      <div className="bg-slate-900 border-4 border-[#3D2B1F] p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#4D96FF]/20 rounded-2xl border-2 border-[#4D96FF] text-[#4D96FF] shrink-0">
            <Lightbulb className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 uppercase">
              <span>Magic Neon Light Table</span>
              <span className="text-[10px] bg-[#6BCB77] text-[#3D2B1F] border-2 border-[#3D2B1F] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Interactive
              </span>
            </h2>
            <p className="text-slate-350 font-bold text-xs sm:text-sm mt-0.5">
              Drag translucent plastic blocks over each other! Because they are transparent filters, they blend to formulate brand-new vibrant colors.
            </p>
          </div>
        </div>

        {/* Console panel controls */}
        <div className="flex gap-2.5 self-start md:self-center">
          <button
            id="lightbox-delete-btn"
            onClick={handleDeleteSelected}
            disabled={!selectedPieceId}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-[#FF6B6B] hover:bg-[#e54848] text-white border-2 border-[#3D2B1F] rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(61,43,31,1)] disabled:opacity-30 disabled:cursor-not-allowed uppercase"
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Trash Block</span>
          </button>

          <button
            id="lightbox-clear-btn"
            onClick={handleClearTable}
            disabled={pieces.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-[#4D96FF] hover:bg-[#3b82f6] text-white border-2 border-[#3D2B1F] rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(61,43,31,1)] disabled:opacity-30 disabled:cursor-not-allowed uppercase"
          >
            <Eraser className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Clear Table</span>
          </button>
        </div>
      </div>

      {/* Primary Lightbox Board Space */}
      <GameBoard
        pieces={pieces}
        onChangePieces={onSetPieces}
        targets={[]}
        onSnapPiece={() => {
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
        isLightBoxMode={true} // Triggers neon backlight & translucent alphas
        gridSnapEnabled={gridSnapEnabled}
        targetSnapEnabled={targetSnapEnabled}
        reducedMotion={reducedMotion}
        hintIndex={0}
      />

      {/* Lower catalogs spawning pad */}
      <ShapeTray onSpawnShape={handleSpawnShape} reducedMotion={reducedMotion} />

      {/* Scientific color mixer read-out console logs */}
      {overlaps.length > 0 && (
        <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl shadow-sm text-slate-400">
          <div className="text-slate-400 font-extrabold text-[10px] tracking-widest uppercase mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Color Interaction Readout Terminal:</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {overlaps.map((pair) => (
              <div
                key={pair.id}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-md shadow-sm border border-black/20"
                    style={{ backgroundColor: pair.color1 }}
                  />
                  <span>{pair.name1}</span>
                </div>
                <span className="text-indigo-400 font-bold">+</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-md shadow-sm border border-black/20"
                    style={{ backgroundColor: pair.color2 }}
                  />
                  <span>{pair.name2}</span>
                </div>
                <span className="text-slate-500 font-bold">blend</span>
                <span className="text-emerald-400">✨ vibrant overlay</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
