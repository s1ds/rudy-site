/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { GamePiece, createPieceFromTemplate, PRESCHOOL_TEMPLATES, TANGRAM_TEMPLATES } from "../game/pieces";
import { SHAPE_COLORS } from "../game/constants";
import { GAME_LEVELS, GameLevel } from "../game/levels";
import { SnapTarget, findSnapResult } from "../game/snapping";
import { loadGameSettings, saveGameSettings, resetGameProgress } from "../game/progress";
import { sounds } from "../game/sounds";
import { Sparkles, Trophy, RotateCcw, AlertTriangle, GraduationCap, Flame, Clock } from "lucide-react";

import ModeSelector, { GameMode } from "./ModeSelector";
import Toolbar from "./Toolbar";
import CompletionOverlay from "./CompletionOverlay";

import FreePlayMode from "../modes/FreePlayMode";
import ShapeMatchMode from "../modes/ShapeMatchMode";
import TangramMode from "../modes/TangramMode";
import LightBoxMode from "../modes/LightBoxMode";

export default function GameShell() {
  // Configured states
  const [mode, setMode] = useState<GameMode>("shape_match");
  const [pieces, setPieces] = useState<GamePiece[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  
  // Levels indexing
  const [shapeMatchIndex, setShapeMatchIndex] = useState(0);
  const [tangramIndex, setTangramIndex] = useState(0);
  const [tangramCategory, setTangramCategory] = useState<"animals" | "abc" | "things">("animals");

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(0);
  
  const getActiveCategoryLevels = (): GameLevel[] => {
    if (tangramCategory === "abc") {
      return GAME_LEVELS.filter((l) => l.id.startsWith("tangram_abc_"));
    } else if (tangramCategory === "things") {
      return GAME_LEVELS.filter((l) => l.id.startsWith("tangram_thing_"));
    } else {
      return GAME_LEVELS.filter((l) => l.id.startsWith("tangram_animal_"));
    }
  };

  // Progress states
  const [completedLevelIds, setCompletedLevelIds] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  // Preference toggles
  const [gridSnap, setGridSnap] = useState(false);
  const [targetSnap, setTargetSnap] = useState(true);
  const [muted, setMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load progress and user settings from localStorage on initial bootup
  useEffect(() => {
    const backup = loadGameSettings();
    setMuted(backup.muted);
    sounds.setMuted(backup.muted);
    setReducedMotion(backup.reducedMotion);
    setGridSnap(backup.gridSnapEnabled);
    setTargetSnap(backup.targetSnapEnabled);
    setCompletedLevelIds(backup.completedLevelIds || []);

    // Route active level if saved
    const activeId = backup.selectedLevelId || "match_1";
    if (activeId.startsWith("tangram_")) {
      setMode("tangram");
      if (activeId.startsWith("tangram_abc_")) {
        setTangramCategory("abc");
        const idx = GAME_LEVELS.filter(l => l.id.startsWith("tangram_abc_")).findIndex(l => l.id === activeId);
        setTangramIndex(Math.max(0, idx));
      } else if (activeId.startsWith("tangram_thing_")) {
        setTangramCategory("things");
        const idx = GAME_LEVELS.filter(l => l.id.startsWith("tangram_thing_")).findIndex(l => l.id === activeId);
        setTangramIndex(Math.max(0, idx));
      } else {
        setTangramCategory("animals");
        const idx = GAME_LEVELS.filter(l => l.id.startsWith("tangram_animal_")).findIndex(l => l.id === activeId);
        setTangramIndex(Math.max(0, idx));
      }
    } else {
      setMode("shape_match");
      const idx = GAME_LEVELS.findIndex(l => l.id === activeId);
      setShapeMatchIndex(Math.max(0, idx));
    }
  }, []);

  // Fetch the active level based on current mode and indexes
  const getActiveLevel = (): GameLevel => {
    if (mode === "tangram") {
      const catLevels = getActiveCategoryLevels();
      return catLevels[tangramIndex] || catLevels[0];
    }
    return GAME_LEVELS[shapeMatchIndex]; // level 1 to 5
  };

  // Re-build or reload shapes whenever the mode, active level, or reset triggers
  useEffect(() => {
    initLevelShapes();
    setSelectedPieceId(null);
    setShowCompletion(false);
    setHintIndex(0);
    setTimerSeconds(0);
  }, [mode, shapeMatchIndex, tangramIndex, tangramCategory]);

  // Run countdown timer for the active level
  useEffect(() => {
    // Only run timer for active level-based puzzles, while the completion overlay is hidden
    if ((mode !== "shape_match" && mode !== "tangram") || showCompletion) {
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        const nextTime = prev + 1;
        // Trigger cute synthesized burrp sound at precisely 2 minutes (120 seconds)
        if (nextTime === 120) {
          sounds.playBurrp();
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, showCompletion, shapeMatchIndex, tangramIndex, tangramCategory]);

  // Format MM:SS helper
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Initializer for different modes
  const initLevelShapes = () => {
    if (mode === "free_play") {
      // Load standard pre-school template collection
      const templates = Object.keys(PRESCHOOL_TEMPLATES);
      const colors = Object.values(SHAPE_COLORS);
      const items = templates.map((key, i) => {
        const t = PRESCHOOL_TEMPLATES[key];
        const step = 800 / templates.length;
        const x = 70 + i * step;
        const col = colors[i % colors.length];
        return createPieceFromTemplate(`free_${key}_${i}`, t, col, x, 400 + (i % 2) * 12);
      });
      setPieces(items);
      return;
    }

    if (mode === "light_box") {
      // Spawns 3 default shapes in central table to showcase overlapping color glows
      const items = [
        createPieceFromTemplate(
          "init_lb_sq",
          PRESCHOOL_TEMPLATES["square"],
          SHAPE_COLORS.yellow,
          370,
          230
        ),
        createPieceFromTemplate(
          "init_lb_ci",
          PRESCHOOL_TEMPLATES["circle"],
          SHAPE_COLORS.blue,
          530,
          230
        ),
        createPieceFromTemplate(
          "init_lb_tr",
          PRESCHOOL_TEMPLATES["triangle"],
          SHAPE_COLORS.red,
          450,
          310
        ),
      ];
      setPieces(items);
      return;
    }

    // LEVEL-BASED MODES: Shape Match & Tangram Puzzle
    const level = getActiveLevel();
    const isTangram = mode === "tangram";

    if (isTangram) {
      // Scaffold standard 7 classic shapes staggered meticulously inside the staging tray shelf
      const orderKeys = [
        "large_triangle_1",
        "large_triangle_2",
        "medium_triangle",
        "small_triangle_1",
        "small_triangle_2",
        "tangram_square",
        "tangram_parallelogram",
      ];
      const items = orderKeys.map((key, i) => {
        const t = TANGRAM_TEMPLATES[key];
        const col = Object.values(SHAPE_COLORS)[i];
        
        // Distribute nicely inside x coordinates [100px, 800px], y = 502px centering bottom staging slot
        const step = 720 / 6;
        const x = 90 + i * step;
        const y = 502;

        // Tweak default start rotation so they look mixed
        const startRotChoices = [0, 90, 180, 270];
        const rot = startRotChoices[(i * 3) % startRotChoices.length];

        return createPieceFromTemplate(`tangram_puzz_${key}`, t, col, x, y, rot);
      });
      setPieces(items);
    } else {
      // Preschool Shape Match pieces: extract templates from currentLevel
      const reqs = level.requiredPieces;
      const count = reqs.length;
      const colors = Object.values(SHAPE_COLORS);
      
      const items = reqs.map((type, i) => {
        const template = PRESCHOOL_TEMPLATES[type];
        
        // Distribute nicely along bottom staging tray
        const step = Math.min(160, 680 / (count + 1));
        const x = count === 1 ? 450 : 450 + (i - (count - 1) / 2) * step;
        const y = 502;
        
        const col = colors[(i * 2 + 1) % colors.length];
        return createPieceFromTemplate(`match_puzz_${type}_${i}`, template, col, x, y);
      });
      setPieces(items);
    }
  };

  const handleResetCurrentLevel = () => {
    initLevelShapes();
    setSelectedPieceId(null);
    setShowCompletion(false);
    setHintIndex(0);
    setTimerSeconds(0);
    sounds.playBounce();
  };

  const handleToggleMute = () => {
    const updated = !muted;
    setMuted(updated);
    sounds.setMuted(updated);
    saveGameSettings({ muted: updated });
    sounds.playTick();
  };

  const handleToggleReducedMotion = () => {
    const updated = !reducedMotion;
    setReducedMotion(updated);
    saveGameSettings({ reducedMotion: updated });
    sounds.playTick();
  };

  const handleToggleGridSnap = () => {
    const updated = !gridSnap;
    setGridSnap(updated);
    saveGameSettings({ gridSnapEnabled: updated });
    sounds.playTick();
  };

  const handleToggleTargetSnap = () => {
    const updated = !targetSnap;
    setTargetSnap(updated);
    saveGameSettings({ targetSnapEnabled: updated });
    sounds.playTick();
  };

  // Handles consecutive hint reveals
  const handleShowHint = () => {
    const level = getActiveLevel();
    const totalTargets = level.targets.length;
    sounds.playTick();
    if (hintIndex < totalTargets) {
      setHintIndex(hintIndex + 1);
    } else {
      setHintIndex(0); // circular rotation
    }
  };

  // Coordinates the magnetic snapping calculations of a draggable item
  const handleSnapPiece = (activeId: string) => {
    const activePiece = pieces.find((p) => p.id === activeId);
    if (!activePiece || activePiece.isLocked) return;

    const level = (mode === "shape_match" || mode === "tangram") ? getActiveLevel() : null;
    const targetSlots = level ? level.targets : [];

    if (targetSnap && targetSlots.length > 0) {
      // Find targets representing the exact same piece families
      // We lock targets once a piece locks there
      const availableTargets = targetSlots.filter(
        (t) => !pieces.some((p) => p.isLocked && Math.hypot(p.x - t.x, p.y - t.y) < 2)
      );

      const isTangram = mode === "tangram";
      const snapResult = findSnapResult(
        activePiece,
        availableTargets,
        isTangram, // strict for tangram, forgiving for preschool
        gridSnap,
        20
      );

      if (snapResult.snapped) {
        if (snapResult.targetId) {
          // Snapped to outline target! Lock in place!
          const updatedPieces = pieces.map((p) =>
            p.id === activeId
              ? {
                  ...p,
                  x: snapResult.x,
                  y: snapResult.y,
                  rotation: snapResult.rotation,
                  isLocked: true,
                }
              : p
          );

          sounds.playSnap();
          setPieces(updatedPieces);
          setSelectedPieceId(null);

          // Completion solver check
          const levelSolved = targetSlots.every((target) =>
            updatedPieces.some((p) => p.isLocked && Math.hypot(p.x - target.x, p.y - target.y) < 2.5)
          );

          if (levelSolved && level) {
            handleLevelSolved(level.id);
          }
        } else {
          // Snapped to background grid fallback
          sounds.playTick();
          setPieces(
            pieces.map((p) =>
              p.id === activeId
                ? {
                    ...p,
                    x: snapResult.x,
                    y: snapResult.y,
                    rotation: snapResult.rotation,
                  }
                : p
            )
          );
        }
      }
    } else if (gridSnap) {
      // Align to grid if targetSnap is off
      const rx = Math.round(activePiece.x / 20) * 20;
      const ry = Math.round(activePiece.y / 20) * 20;
      const rr = Math.round(activePiece.rotation / 45) * 45;

      sounds.playTick();
      setPieces(
        pieces.map((p) =>
          p.id === activeId
            ? {
                ...p,
                x: rx,
                y: ry,
                rotation: rr % 360,
              }
            : p
        )
      );
    }
  };

  const handleLevelSolved = (levelId: string) => {
    sounds.playFanfare();
    setShowCompletion(true);
    
    // Save completion index in progress storage
    if (!completedLevelIds.includes(levelId)) {
      const updated = [...completedLevelIds, levelId];
      setCompletedLevelIds(updated);
      saveGameSettings({ completedLevelIds: updated });
    }
  };

  // Navigates to consecutive level in levels list
  const handleNextLevel = () => {
    if (mode === "tangram") {
      const catLevels = getActiveCategoryLevels();
      if (tangramIndex < catLevels.length - 1) {
        const nextIdx = tangramIndex + 1;
        setTangramIndex(nextIdx);
        saveGameSettings({ selectedLevelId: catLevels[nextIdx].id });
      } else {
        // Last level of this subcategory solved! Round-robin repeat or show triumph.
        setTangramIndex(0);
        saveGameSettings({ selectedLevelId: catLevels[0].id });
      }
    } else {
      // shape match mode progression
      if (shapeMatchIndex < 4) {
        const nextIdx = shapeMatchIndex + 1;
        setShapeMatchIndex(nextIdx);
        saveGameSettings({ selectedLevelId: GAME_LEVELS[nextIdx].id });
      }
    }
  };

  // Wipe progress
  const handleWipeAllProgress = () => {
    const confirmWipe = window.confirm(
      "Are you sure you want to reset all starglow achievements and start over?"
    );
    if (confirmWipe) {
      const d = resetGameProgress();
      setCompletedLevelIds([]);
      setShapeMatchIndex(0);
      setTangramIndex(0);
      setMode("shape_match");
      setPieces([]);
      setMuted(false);
      setGridSnap(false);
      setTargetSnap(true);
      sounds.setMuted(false);
      sounds.playChime();
    }
  };

  // Render components dynamically based on mode Selection
  const renderActiveModeComponent = () => {
    switch (mode) {
      case "free_play":
        return (
          <FreePlayMode
            pieces={pieces}
            onSetPieces={setPieces}
            gridSnapEnabled={gridSnap}
            targetSnapEnabled={targetSnap}
            reducedMotion={reducedMotion}
            selectedPieceId={selectedPieceId}
            onSelectPiece={setSelectedPieceId}
          />
        );
      case "light_box":
        return (
          <LightBoxMode
            pieces={pieces}
            onSetPieces={setPieces}
            gridSnapEnabled={gridSnap}
            targetSnapEnabled={targetSnap}
            reducedMotion={reducedMotion}
            selectedPieceId={selectedPieceId}
            onSelectPiece={setSelectedPieceId}
          />
        );
      case "tangram":
        return (
          <TangramMode
            levels={getActiveCategoryLevels()}
            activeLevelIndex={tangramIndex}
            onSelectLevelIndex={(idx) => {
              setTangramIndex(idx);
              const catLevels = getActiveCategoryLevels();
              saveGameSettings({ selectedLevelId: catLevels[idx].id });
              sounds.playTick();
            }}
            activeCategory={tangramCategory}
            onChangeCategory={(cat) => {
              setTangramCategory(cat);
              setTangramIndex(0);
              const catLevels = GAME_LEVELS.filter((l) => l.id.startsWith(`tangram_${cat === "things" ? "thing" : cat === "abc" ? "abc" : "animal"}_`));
              if (catLevels && catLevels.length > 0) {
                saveGameSettings({ selectedLevelId: catLevels[0].id });
              }
              sounds.playBounce();
            }}
            pieces={pieces}
            onSetPieces={setPieces}
            completedLevelIds={completedLevelIds}
            gridSnapEnabled={gridSnap}
            targetSnapEnabled={targetSnap}
            reducedMotion={reducedMotion}
            selectedPieceId={selectedPieceId}
            onSelectPiece={setSelectedPieceId}
            onSnapPiece={handleSnapPiece}
            hintIndex={hintIndex}
          />
        );
      case "shape_match":
      default:
        return (
          <ShapeMatchMode
            levels={GAME_LEVELS.slice(0, 5)} // level 1 to 5
            activeLevelIndex={shapeMatchIndex}
            onSelectLevelIndex={(idx) => {
              setShapeMatchIndex(idx);
              saveGameSettings({ selectedLevelId: GAME_LEVELS[idx].id });
              sounds.playTick();
            }}
            pieces={pieces}
            onSetPieces={setPieces}
            completedLevelIds={completedLevelIds}
            gridSnapEnabled={gridSnap}
            targetSnapEnabled={targetSnap}
            reducedMotion={reducedMotion}
            selectedPieceId={selectedPieceId}
            onSelectPiece={setSelectedPieceId}
            onSnapPiece={handleSnapPiece}
            hintIndex={hintIndex}
          />
        );
    }
  };

  const isLevelCompletedMode = mode === "shape_match" || mode === "tangram";
  const activeLevel = getActiveLevel();
  
  // Calculate index values for next buttons
  const isFinalOverallLevel = activeLevel.id === "tangram_5";

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#3D2B1F] flex flex-col p-4 md:p-6 overflow-y-auto font-sans">
      {/* 1. Header Branded Console */}
      <header className="max-w-4xl w-full mx-auto bg-[#FFD93D] border-4 border-[#F4B400] rounded-3xl flex flex-col md:flex-row md:items-center justify-between p-5 mb-5 select-none shadow-md text-[#3D2B1F] gap-3">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2.5 rounded-2xl shadow-inner border-4 border-[#F4B400] shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] via-[#4D96FF] to-[#6BCB77] rounded-lg rotate-12 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white stroke-[2.5] animate-bounce-gentle" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#3D2B1F] flex items-center gap-2 uppercase">
              <span>RUDY TANGRAM <span className="text-[#FF6B6B]">LAB</span></span>
            </h1>
            <p className="text-[#3D2B1F]/70 text-xs font-black tracking-wide mt-0.5 uppercase">
              Magical geometry & classic tangrams for little explorers
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-center">
          {/* Active Puzzle Timer */}
          {isLevelCompletedMode && (
            <div
              id="puzzle-timer-badge"
              className={`border-4 px-3.5 py-1.5 rounded-2xl shadow-sm flex items-center gap-2.5 transition-all duration-300 select-none ${
                timerSeconds >= 45
                  ? "bg-[#FF6B6B] border-[#3D2B1F] text-white animate-pulse"
                  : "bg-white border-[#F4B400] text-[#3D2B1F]"
              }`}
            >
              <div className={`p-1 rounded-full ${timerSeconds >= 45 ? "bg-white/20 animate-spin-slow text-white" : "bg-blue-50 text-[#4D96FF]"}`}>
                <Clock className="w-4 h-4 font-black stroke-[2.5]" />
              </div>
              <div className="flex flex-col font-black">
                <span className={`text-[8px] uppercase tracking-wider ${timerSeconds >= 45 ? "text-white/90" : "text-[#3D2B1F]/60"}`}>
                  {timerSeconds >= 45 ? "🔥 Hurry Up! Timer:" : "⏳ Puzzle Timer:"}
                </span>
                <span className="font-extrabold text-xs sm:text-sm tracking-widest font-mono">
                  {formatTime(timerSeconds)}
                </span>
              </div>
            </div>
          )}

          {/* Achievements display */}
          <div className="bg-white border-4 border-[#F4B400] px-4 py-1.5 rounded-2xl shadow-sm flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#FF6B6B] fill-[#FF6B6B]/10 stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-[#3D2B1F]/60 tracking-wider">Achievements:</span>
              <span className="text-[#3D2B1F] font-black text-xs">
                {completedLevelIds.length} of {GAME_LEVELS.length} stars earned!
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Core Game Canvas Arena */}
      <main className="flex-1 flex flex-col gap-5 justify-center relative items-center w-full max-w-4xl mx-auto">
        
        {/* Playable Mode Tabs */}
        <ModeSelector
          activeMode={mode}
          onChangeMode={(selected) => {
            setMode(selected);
            sounds.playTick();
          }}
          reducedMotion={reducedMotion}
        />

        {/* Global Action Utility Toolbars */}
        <Toolbar
          gridSnap={gridSnap}
          onToggleGridSnap={handleToggleGridSnap}
          targetSnap={targetSnap}
          onToggleTargetSnap={handleToggleTargetSnap}
          muted={muted}
          onToggleMute={handleToggleMute}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={handleToggleReducedMotion}
          onReset={handleResetCurrentLevel}
          onShowHint={isLevelCompletedMode ? handleShowHint : undefined}
          hintAvailable={isLevelCompletedMode}
          hintIndex={hintIndex}
          totalHints={isLevelCompletedMode ? activeLevel.targets.length : 0}
        />

        {/* Active game mode display (Free, Match, Tangram, Lightbox) */}
        <div className="relative w-full">
          {renderActiveModeComponent()}

          {/* Level completion overlays */}
          {showCompletion && (
            <CompletionOverlay
              onNextLevel={isFinalOverallLevel ? null : handleNextLevel}
              onRestart={() => {
                handleResetCurrentLevel();
                sounds.playTick();
              }}
              levelTitle={activeLevel.title}
              reducedMotion={reducedMotion}
            />
          )}
        </div>
      </main>

      {/* 3. Footer and Admin control */}
      <footer className="max-w-4xl w-full mx-auto mt-8 mb-4 bg-[#3D2B1F] rounded-2xl flex flex-col sm:flex-row items-center justify-between p-4 px-6 gap-3 select-none text-white/50 text-[10px] font-bold tracking-widest uppercase">
        <span className="text-center sm:text-left">
          RUDY TANGRAM LAB © 2026 • PREMIUM EDUCATIONAL SERIES
        </span>
        <button
          id="wipe-progress-btn"
          onClick={handleWipeAllProgress}
          className="text-[9px] font-black text-[#FF6B6B] hover:text-[#e54848] bg-white border-2 border-[#FF6B6B] px-3 py-1 rounded-full transition-all cursor-pointer uppercase shadow-sm tracking-normal"
        >
          Reset Achievements
        </button>
      </footer>
    </div>
  );
}
