/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { GamePiece } from "../game/pieces";
import { SnapTarget } from "../game/snapping";
import { clampPieceToBoard } from "../game/collision";
import { sounds } from "../game/sounds";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../game/constants";
import ShapePiece from "./ShapePiece";
import TargetOutline from "./TargetOutline";

interface GameBoardProps {
  pieces: GamePiece[];
  onChangePieces: (pieces: GamePiece[]) => void;
  targets: SnapTarget[];
  onSnapPiece: (pieceId: string, targetId?: string) => void;
  selectedPieceId: string | null;
  onSelectPiece: (pieceId: string | null) => void;
  isLightBoxMode: boolean;
  gridSnapEnabled: boolean;
  targetSnapEnabled: boolean;
  reducedMotion: boolean;
  hintIndex: number; // For sequential hints
}

export default function GameBoard({
  pieces,
  onChangePieces,
  targets,
  onSnapPiece,
  selectedPieceId,
  onSelectPiece,
  isLightBoxMode,
  gridSnapEnabled,
  targetSnapEnabled,
  reducedMotion,
  hintIndex,
}: GameBoardProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragState, setDragState] = useState<{
    pieceId: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  // Convert client cursor coords to SVG custom viewBox coords
  const getSVGCoords = (clientX: number, clientY: number): { x: number; y: number } | null => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    
    // Proportional mapping works perfectly and handles aspects beautifully
    const x = ((clientX - rect.left) / rect.width) * BOARD_WIDTH;
    const y = ((clientY - rect.top) / rect.height) * BOARD_HEIGHT;
    return { x, y };
  };

  // Keyboard support: listen to Q and E to rotate the selected piece
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPieceId) return;
      
      const key = e.key.toLowerCase();
      if (key === "q" || key === "e") {
        e.preventDefault();
        const activePiece = pieces.find((p) => p.id === selectedPieceId);
        if (!activePiece || activePiece.isLocked) return;

        const delta = key === "e" ? 45 : -45;
        const updatedRotation = ((activePiece.rotation + delta % 360) + 360) % 360;

        sounds.playTick();
        onChangePieces(
          pieces.map((p) =>
            p.id === selectedPieceId ? { ...p, rotation: updatedRotation } : p
          )
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPieceId, pieces, onChangePieces]);

  // Handle Drag Initiations
  const handlePieceDown = (e: React.PointerEvent<SVGElement>, piece: GamePiece) => {
    if (piece.isLocked) return;
    
    const coords = getSVGCoords(e.clientX, e.clientY);
    if (!coords) return;

    onSelectPiece(piece.id);
    setDragState({
      pieceId: piece.id,
      offsetX: coords.x - piece.x,
      offsetY: coords.y - piece.y,
    });
    
    // Elevate on pointer down
    onChangePieces(
      pieces.map((p) => (p.id === piece.id ? { ...p, layer: Date.now() } : p))
    );

    // Capture pointer so dragging is smooth past viewport limits
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Handle Drag Motions
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragState) return;

    const coords = getSVGCoords(e.clientX, e.clientY);
    if (!coords) return;

    const piece = pieces.find((p) => p.id === dragState.pieceId);
    if (!piece || piece.isLocked) return;

    const rawX = coords.x - dragState.offsetX;
    const rawY = coords.y - dragState.offsetY;

    // Boundary clamp protection
    const clamped = clampPieceToBoard(piece, rawX, rawY, 15);

    onChangePieces(
      pieces.map((p) => (p.id === dragState.pieceId ? { ...p, x: clamped.x, y: clamped.y } : p))
    );
  };

  // Handle Drag Completions
  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragState) return;

    const activeId = dragState.pieceId;
    setDragState(null);

    // Perform snapping checks on release
    onSnapPiece(activeId);
  };

  const handleRotateCentroid = (pieceId: string, degree: number) => {
    const p = pieces.find((it) => it.id === pieceId);
    if (!p || p.isLocked) return;

    const newRot = ((p.rotation + degree % 360) + 360) % 360;
    sounds.playTick();
    onChangePieces(
      pieces.map((item) => (item.id === pieceId ? { ...item, rotation: newRot } : item))
    );
  };

  // Click on background cancels active selection
  const handleBackgroundClick = (e: React.MouseEvent<SVGSVGElement>) => {
    // If targeting actual grid spaces instead of puzzle shapes
    const targetElement = e.target as SVGElement;
    if (
      targetElement.tagName === "svg" || 
      targetElement.id === "board-bg-plate" || 
      targetElement.id === "lightbox-table" ||
      targetElement.id === "bottom-shelf-bg"
    ) {
      onSelectPiece(null);
    }
  };

  // LAYER SORTING: Make sure active dragged piece sits absolute last (on top) for professional mechanics
  const sortedPieces = [...pieces].sort((a, b) => {
    if (a.id === selectedPieceId) return 1;
    if (b.id === selectedPieceId) return -1;
    if (a.isLocked && !b.isLocked) return -1;
    if (!a.isLocked && b.isLocked) return 1;
    return (a.layer || 0) - (b.layer || 0);
  });

  return (
    <div className="relative w-full aspect-[900/580] bg-white rounded-[32px] border-8 border-[#F4B400] shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),4px_6px_0px_#3D2B1F] overflow-hidden select-none">
      <svg
        id="rudy-svg-canvas"
        ref={svgRef}
        viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
        className="w-full h-full select-none touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleBackgroundClick}
      >
        <defs>
          {/* Neon Light Box Gradients */}
          <radialGradient id="lightBoxCenterFilter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>
          
          <radialGradient id="neonLightOverlay" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#f0fdfa" />
            <stop offset="70%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#dbeafe" />
          </radialGradient>
          
          {/* Tactile Board Drop Shadow Filter */}
          <filter id="softToyShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* --- 1. LIGHT TABLE vs REGULAR BOARD GRID BACKGROUNDS --- */}
        {isLightBoxMode ? (
          // Illuminated Glow Area
          <g id="lightbox-bg-table">
            <rect
              id="lightbox-table"
              x={0}
              y={0}
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              fill="url(#neonLightOverlay)"
            />
            {/* Soft grid overlay inside lightbox */}
            <rect
              x={0}
              y={0}
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              fill="none"
              className="lightbox-grid-pattern opacity-[0.3]"
              pointerEvents="none"
            />
            {/* Glowing borders for the lightbox */}
            <rect
              x={6}
              y={6}
              width={BOARD_WIDTH - 12}
              height={BOARD_HEIGHT - 12}
              rx={20}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth={3}
              opacity={0.15}
              pointerEvents="none"
            />
            <rect
              x={12}
              y={12}
              width={BOARD_WIDTH - 24}
              height={BOARD_HEIGHT - 24}
              rx={16}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={1.5}
              opacity={0.25}
              pointerEvents="none"
            />
          </g>
        ) : (
          // Soft regular schoolroom board grid background
          <g id="regular-board-bg">
            <rect
              id="board-bg-plate"
              x={0}
              y={0}
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              fill="#FCF9EE"
            />
            {/* Faint placement grid dots/lines */}
            <rect
              x={0}
              y={0}
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              fill="none"
              className="lightbox-grid-pattern opacity-[0.12]"
              pointerEvents="none"
            />
          </g>
        )}

        {/* --- 2. SILHOUETTE OUTLINES (Under the pieces) --- */}
        <g id="silhouette-targets-layer">
          {targets.map((target, index) => {
            // Hint sequential highlighting: show outline glowing if index matches or is smaller
            // e.g. hintIndex = 1 reveals the 1st outline in target array, etc.
            const revealHint = hintIndex > index;
            return (
              <TargetOutline
                key={target.id}
                target={target}
                revealHintSlot={revealHint}
                isUnifiedSilhouetteMode={!isLightBoxMode && targets.length === 7} // 7 is criteria for Classic Tangram Silhouettes
              />
            );
          })}
        </g>

        {/* --- 3. THE KIDS BOTTOM STAGING SHELF DOCK (Only in level modes) --- */}
        {targets.length > 0 && (
          <g id="bottom-staging-dock-shelf" opacity={0.92}>
            {/* Frosted wooden acrylic tray base */}
            <rect
              id="bottom-shelf-bg"
              x={22}
              y={445}
              width={BOARD_WIDTH - 44}
              height={115}
              rx={24}
              fill="#FFFBEB"
              stroke="#F4B400"
              strokeWidth={4}
              filter="url(#softToyShadow)"
            />
            {/* Inside slot divider lines */}
            <line
              x1={40}
              y1={445}
              x2={BOARD_WIDTH - 40}
              y2={445}
              stroke="#F4B400"
              strokeWidth={2}
              opacity={0.3}
            />
            
            {/* Label instruction helper */}
            <text
              x={BOARD_WIDTH / 2}
              y={544}
              textAnchor="middle"
              className="font-display font-extrabold text-[12px] fill-[#3D2B1F] tracking-widest uppercase pointer-events-none"
            >
              🚀 RUDY'S PARTS DOCK • PLACE SHAPES ON THE OUTLINES! 🧩
            </text>
          </g>
        )}

        {/* --- 4. THE INTERACTIVE GAME PIECES (Drawn last/on top of backgrounds, outlines, shelf) --- */}
        <g id="pieces-main-rendering-layer">
          {sortedPieces.map((piece) => (
            <ShapePiece
              key={piece.id}
              piece={piece}
              isSelected={piece.id === selectedPieceId}
              isLightBoxMode={isLightBoxMode}
              onSelect={(e) => handlePieceDown(e, piece)}
              onRotateCentroid={(deg) => handleRotateCentroid(piece.id, deg)}
              reducedMotion={reducedMotion}
            />
          ))}
        </g>
      </svg>

      {/* Dynamic overlapping blend colors floating badge tracker for Light Box Mode */}
      {isLightBoxMode && pieces.length > 1 && (
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-sky-300 text-[10px] px-3 py-1.5 rounded-full font-mono font-semibold flex items-center gap-1.5 select-none pointer-events-none z-10 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span>Light Table Overlapping Blends ON</span>
        </div>
      )}

      {/* Bottom info banner on keyboard shortcuts */}
      {selectedPieceId && !pieces.find(p=>p.id === selectedPieceId)?.isLocked && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/75 backdrop-blur-md text-white text-[10px] px-4 py-1 rounded-full font-medium select-none pointer-events-none z-10 text-center flex items-center justify-center gap-2">
          <span>Keyboard active: Press</span>
          <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-indigo-300 font-bold">Q</kbd>
          <span>and</span>
          <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-indigo-300 font-bold">E</kbd>
          <span>to rotate selected piece!</span>
        </div>
      )}
    </div>
  );
}
