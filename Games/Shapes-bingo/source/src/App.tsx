import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  ArrowLeft,
  X,
  Star as StarIcon,
  Play,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

import { SHAPES, COLORS, GAME_MODES, MASCOTS, GameMode, MascotInfo } from './data/assets';
import {
  BingoCell,
  generateBoard,
  selectNextTarget,
  checkBingo,
  TargetPrompt,
  updateStatsSummary,
  loadUserStats,
  UserStats,
} from './utils/gameLogic';
import { playSynthesizedSound, speakText, updateAudioSettings, stopSpeech } from './utils/audio';

import { ShapeTile } from './components/ShapeTile';
import { PromptBar } from './components/PromptBar';
import { FeedbackToast } from './components/FeedbackToast';
import { BingoOverlay } from './components/BingoOverlay';
import { ScoreReport } from './components/ScoreReport';
import { SettingsPanel, GameSettings } from './components/SettingsPanel';
import { MascotRenderer, MascotMood } from './components/MascotRenderer';

const GAME_LINKS = [
  { id: 'homepage', label: 'Homepage', href: 'https://rudraveer.com/' },
  { id: 'shapes-mat', label: 'Shapes Mat', href: 'https://rudraveer.com/shapes-mat/' },
  { id: 'shapes-bingo', label: 'Shapes Bingo', href: 'https://rudraveer.com/shapes-bingo/' },
] as const;

function GamesHeader() {
  const pathname = window.location.pathname.toLowerCase();
  const activeId = pathname.includes('shapes-bingo')
    ? 'shapes-bingo'
    : pathname.includes('shapes-mat')
      ? 'shapes-mat'
      : 'homepage';

  return (
    <header className="relative z-50 w-full bg-slate-900 text-white border-b-4 border-amber-300 shadow-lg px-3 py-3 sm:px-5">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-lg sm:text-xl font-black tracking-tight">
          <span aria-hidden="true" className="text-amber-300">★</span>
          <span>Rudy&apos;s Online Games</span>
        </div>
        <nav aria-label="Rudy's online games" className="grid grid-cols-3 gap-2 w-full sm:w-auto">
          {GAME_LINKS.map((link) => {
            const sharedClass =
              'min-h-10 px-3 py-2 rounded-xl text-center text-xs sm:text-sm font-extrabold border-2 transition-colors flex items-center justify-center';

            if (link.id === activeId) {
              return (
                <span
                  key={link.id}
                  aria-current="page"
                  className={`${sharedClass} bg-slate-500 border-slate-400 text-slate-200 cursor-default`}
                >
                  {link.label}
                </span>
              );
            }

            return (
              <a
                key={link.id}
                href={link.href}
                className={`${sharedClass} bg-white border-white text-slate-900 hover:bg-amber-200 hover:border-amber-200 focus-visible:outline-amber-300`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  // Game states
  const [screen, setScreen] = useState<'splash' | 'menu' | 'select_game' | 'select_grid' | 'game' | 'report'>('splash');
  const [gameMode, setGameMode] = useState<GameMode>('shapes_colors');
  const [gridSize, setGridSize] = useState<3 | 4>(3);

  // Settings state
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    voiceEnabled: true,
    musicEnabled: false,
    reducedMotion: false,
    highContrast: false,
    gridSize: 3,
    extraLargeTiles: false,
    repeatRate: 0.9,
    rudyMode: false,
  });

  const [showSettings, setShowSettings] = useState(false);

  // Core gameplay arrays
  const [board, setBoard] = useState<BingoCell[]>([]);
  const [currentTarget, setCurrentTarget] = useState<TargetPrompt | null>(null);

  // Correct / Incorrect counters for stats report
  const [correctClicks, setCorrectClicks] = useState(0);
  const [incorrectClicks, setIncorrectClicks] = useState(0);

  // Report statistics helpers
  const [sessionAccuracy, setSessionAccuracy] = useState(100);
  const [sessionAverage, setSessionAverage] = useState(100);

  // Feedback systems
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [pulsePrompt, setPulsePrompt] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [activeMascotIndex, setActiveMascotIndex] = useState(0);

  // Bingo completes
  const [hasCompletedBingo, setHasCompletedBingo] = useState(false);

  // Audio syncer tracking
  const stateRef = useRef({ settings, currentTarget });
  useEffect(() => {
    stateRef.current = { settings, currentTarget };
  }, [settings, currentTarget]);

  // Read voices or update settings in the audio utility
  useEffect(() => {
    updateAudioSettings({
      soundEnabled: settings.soundEnabled,
      voiceEnabled: settings.voiceEnabled,
      musicEnabled: settings.musicEnabled,
      rate: settings.repeatRate,
    });
  }, [settings]);

  // Speak the vocal prompt wrapper, utilizing correct configurations
  const speakCurrentPrompt = useCallback(() => {
    if (stateRef.current.currentTarget && stateRef.current.settings.voiceEnabled) {
      speakText(stateRef.current.currentTarget.speakText, () => {
        // speech complete callback
      });
    }
  }, []);

  // Update background star positions for a magical child atmosphere
  const backgroundStars = useRef<Array<{ id: number; left: number; top: number; size: number; delay: number }>>([]);
  if (backgroundStars.current.length === 0) {
    backgroundStars.current = Array.from({ length: 14 }).map((_, idx) => ({
      id: idx,
      left: Math.random() * 95,
      top: Math.random() * 95,
      size: Math.random() * 16 + 10,
      delay: Math.random() * 4,
    }));
  }

  // Handle splash click to transition to menu
  const handleSplashDismiss = () => {
    playSynthesizedSound('correct');
    setScreen('menu');

    // Give a small initial voice welcome
    setTimeout(() => {
      speakText("Welcome to Rudy's Shapes bingo! Tap Play to begin.");
    }, 400);
  };

  // Launch fresh board and targets
  const handleStartGame = (mode: GameMode, grid: 3 | 4) => {
    setGameMode(mode);
    setGridSize(grid);

    const freshBoard = generateBoard(mode, grid);
    setBoard(freshBoard);

    const firstTarget = selectNextTarget(freshBoard, mode);
    setCurrentTarget(firstTarget);

    setCorrectClicks(0);
    setIncorrectClicks(0);
    setHasCompletedBingo(false);
    setFeedbackStatus('idle');
    setMascotMood('idle');

    // Choose random mascot to guide this game
    setActiveMascotIndex(Math.floor(Math.random() * MASCOTS.length));

    setScreen('game');

    // Trigger vocal directions on start
    if (firstTarget) {
      setTimeout(() => {
        speakText(firstTarget.speakText);
      }, 500);
    }
  };

  // Sound toggler on main menu
  const toggleSoundMain = () => {
    const updatedSound = !settings.soundEnabled;
    const update = { ...settings, soundEnabled: updatedSound };
    setSettings(update);
    playSynthesizedSound('tap');
  };

  // Settings property changes
  const handleSettingsChange = (updated: Partial<GameSettings>) => {
    const merged = { ...settings, ...updated };
    setSettings(merged);

    // If grid size is updated during active settings change, let's sync local size variables
    if (updated.gridSize) {
      setGridSize(updated.gridSize);
    }
  };

  // Manage individual cell taps
  const handleCellTap = (cell: BingoCell, index: number) => {
    if (cell.marked || hasCompletedBingo || feedbackStatus === 'correct') return;

    const isMatch = (() => {
      if (!currentTarget) return false;
      if (gameMode === 'shapes_only') {
        return cell.shape === currentTarget.shape;
      } else if (gameMode === 'colors_only') {
        return cell.color === currentTarget.color;
      } else {
        return cell.shape === currentTarget.shape && cell.color === currentTarget.color;
      }
    })();

    if (isMatch) {
      // SUCCESS PIECE
      playSynthesizedSound('correct');
      setMascotMood('correct');
      setFeedbackStatus('correct');

      const successMsgs = ['Perfect!', 'Super Job!', 'Amazing Spotting!', 'Awesome!', 'Sensational!'];
      setFeedbackMessage(successMsgs[Math.floor(Math.random() * successMsgs.length)]);

      // Mark the cell
      const updatedBoard = board.map((c) => (c.id === cell.id ? { ...c, marked: true } : c));
      setBoard(updatedBoard);
      setCorrectClicks((prev) => prev + 1);

      // Check if this gives BINGO!
      const bingoResult = checkBingo(updatedBoard, gridSize);

      setTimeout(() => {
        if (bingoResult.hasBingo) {
          // BINGO ACCREDITED
          setHasCompletedBingo(true);
          setMascotMood('celebrate');
        } else {
          // Continue game - select next target
          const nextTarget = selectNextTarget(updatedBoard, gameMode);
          if (nextTarget) {
            setCurrentTarget(nextTarget);
            setFeedbackStatus('idle');
            setMascotMood('idle');
            // Speak next direction
            speakText(nextTarget.speakText);
          } else {
            // Board fully matching / finished
            setHasCompletedBingo(true);
            setMascotMood('celebrate');
          }
        }
      }, 1500);
    } else {
      // INCORRECT TAPPED
      playSynthesizedSound('incorrect');
      setMascotMood('incorrect');
      setFeedbackStatus('incorrect');

      // Rudy mode accommodation doesn't use standard hard try-again comments!
      setFeedbackMessage(settings.rudyMode ? 'Let&apos;s look for the matching one!' : 'Almost! Try again.');

      setIncorrectClicks((prev) => prev + 1);

      // Pulse correct prompt bar to redirect child eye focus
      setPulsePrompt(true);

      setTimeout(() => {
        setPulsePrompt(false);
        setMascotMood('idle');
        setFeedbackStatus('idle');
      }, 1800);
    }
  };

  // Move core calculations and local storage saves to completion
  const handleBingoOverCompleted = () => {
    // Write score and calculate averages
    const results = updateStatsSummary(correctClicks, incorrectClicks);
    setSessionAccuracy(results.currentAccuracy);
    setSessionAverage(results.overallAverage);

    setScreen('report');
  };

  const activeMascot = MASCOTS[activeMascotIndex % MASCOTS.length];

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden select-none flex flex-col justify-between font-sans ${
        settings.highContrast
          ? 'bg-slate-900 text-white'
          : 'bg-gradient-to-b from-amber-300 via-orange-300 to-orange-400 text-slate-800'
      }`}
    >
      <GamesHeader />

      {/* Visual background dotted swirling paths & layout decorations */}
      {!settings.reducedMotion && !settings.highContrast && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M -50,150 Q 80,300 240,120 T 500,280 T 800,200"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <path
            d="M 50,450 Q 180,550 340,320 T 600,480"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="3.5"
            strokeDasharray="6 6"
          />
          <circle cx="280" cy="180" r="1.5" fill="#FEF3C7" />
          <circle cx="80" cy="380" r="2" fill="#FEF3C7" />
        </svg>
      )}

      {/* Floating starry sky background */}
      {!settings.reducedMotion && !settings.highContrast && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {backgroundStars.current.map((star) => (
            <div
              key={star.id}
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                animationDelay: `${star.delay}s`,
              }}
              className="absolute text-yellow-100/40 animate-float-star"
            >
              <StarIcon className="w-full h-full fill-current" />
            </div>
          ))}
        </div>
      )}

      {/* ==================== SPLASH SCREEN ==================== */}
      {screen === 'splash' && (
        <div
          onClick={handleSplashDismiss}
          className="flex-1 flex flex-col items-center justify-center p-6 text-center cursor-pointer min-h-screen"
        >
          {/* Animated decorative Mascot Header */}
          <div className="mb-6 scale-110 pointer-events-none flex gap-2">
            <MascotRenderer id="gloop_blue" mood="idle" size={70} />
            <MascotRenderer id="rudy_red" mood="celebrate" size={90} className="relative -top-2" />
            <MascotRenderer id="spike_green" mood="idle" size={70} />
          </div>

          {/* Outlined BINGO graphic title */}
          <div className="relative mb-8 max-w-sm pointer-events-none">
            <span className="bg-orange-500 text-yellow-100 text-sm font-black px-4 py-1 rounded-full uppercase tracking-widest border-2 border-slate-700 shadow-md">
              Shapes & Colors
            </span>
            <div className="flex gap-1.5 sm:gap-2.5 justify-center items-center mt-3 filter drop-shadow-[0_6px_0_#1E293B]">
              {['B', 'I', 'N', 'G', 'O'].map((letter, idx) => {
                const colors = [
                  'bg-red-500 text-white',
                  'bg-blue-500 text-white',
                  'bg-yellow-400 text-slate-800',
                  'bg-green-500 text-white',
                  'bg-purple-500 text-white',
                ];
                return (
                  <span
                    key={idx}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-4 border-slate-800 text-2xl sm:text-3xl font-black flex items-center justify-center font-sans tracking-tight ${
                      colors[idx % colors.length]
                    } ${settings.reducedMotion ? '' : 'animate-[bounce_1.5s_infinite_ease-in-out]'}`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
            <p className="text-md font-bold text-slate-800 tracking-tight mt-6 px-4 bg-white/75 py-1.5 rounded-full inline-block border border-slate-200">
              Rudy&apos;s Preschool Shapes Lab
            </p>
          </div>

          {/* Action indicator */}
          <div className="space-y-4">
            <button
              id="tap_to_start_btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSplashDismiss();
              }}
              className="px-8 py-5 bg-green-500 hover:bg-green-600 border-b-6 border-green-700 rounded-3xl text-white font-extrabold text-2xl tracking-tight shadow-xl hover:translate-y-[2px] hover:border-b-4 active:translate-y-[6px] active:border-b-0 cursor-pointer transition-all flex items-center gap-2"
            >
              <Play className="fill-white" />
              PLAY NOW
            </button>
            <p className="text-sm font-bold text-slate-800 tracking-tight animate-pulse">
              [ Tap anywhere to start ]
            </p>
          </div>
        </div>
      )}

      {/* ==================== MAIN MENU ==================== */}
      {screen === 'menu' && (
        <div className="flex-1 flex flex-col justify-between p-6 max-w-md mx-auto w-full min-h-screen">
          {/* Header toolbar */}
          <div className="flex justify-between items-center w-full pt-2">
            <div className="flex items-center gap-1 bg-white/70 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Special Needs Friendly</span>
            </div>
            <button
              onClick={() => {
                playSynthesizedSound('tap');
                setShowSettings(true);
              }}
              aria-label="Open settings panel"
              className="p-3 bg-white hover:bg-slate-50 border-4 border-slate-700 shadow-[0_4px_0_#334155] rounded-2xl active:translate-y-[4px] active:shadow-none cursor-pointer transition-all"
            >
              <Sliders className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* Central Logo */}
          <div className="text-center my-6 flex-1 flex flex-col justify-center items-center">
            <span className="bg-orange-500 text-yellow-100 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-2 border-slate-700 shadow-md">
              Rudy&apos;s Shapes
            </span>
            <div className="flex gap-2 justify-center items-center mt-3 mb-6 filter drop-shadow-[0_5px_0_#1E293B]">
              {['B', 'I', 'N', 'G', 'O'].map((letter, idx) => {
                const colors = [
                  'bg-red-500 text-white',
                  'bg-blue-500 text-white',
                  'bg-yellow-400 text-slate-800',
                  'bg-green-500 text-white',
                  'bg-purple-500 text-white',
                ];
                return (
                  <span
                    key={idx}
                    className={`w-12 h-12 rounded-xl border-4 border-slate-800 text-2xl font-black flex items-center justify-center font-sans tracking-tight ${
                      colors[idx % colors.length]
                    } ${settings.reducedMotion ? '' : 'animate-[bounce_2s_infinite_ease-in-out]'}`}
                    style={{ animationDelay: `${idx * 0.15}s` }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>

            {/* Character decorations */}
            <div className="flex justify-center items-end gap-x-2 my-2 pointer-events-none scale-105">
              <MascotRenderer id="spike_green" mood="idle" size={90} />
              <MascotRenderer id="rudy_red" mood="celebrate" size={110} className="relative -top-2 z-10" />
              <MascotRenderer id="gloop_blue" mood="idle" size={90} />
            </div>
          </div>

          {/* Bottom interactive launchers */}
          <div className="space-y-4 w-full">
            <button
              id="main_menu_go_btn"
              onClick={() => {
                playSynthesizedSound('tap');
                setScreen('select_game');
              }}
              className="w-full py-5 px-8 bg-green-500 hover:bg-green-600 border-b-8 border-green-700 text-white rounded-3xl font-black text-3xl tracking-tight shadow-xl hover:translate-y-[2px] hover:border-b-6 active:translate-y-[8px] active:border-b-0 cursor-pointer transition-all flex items-center justify-center gap-3"
            >
              <Play className="fill-white w-6 h-6" />
              PLAY BINGO!
            </button>

            {/* Sub toolbar row */}
            <div className="flex gap-3 pt-1">
              {/* Audio controller shortcut */}
              <button
                id="main_menu_audio_toggle_btn"
                onClick={toggleSoundMain}
                aria-label={settings.soundEnabled ? 'Mute game music and sounds' : 'Unmute game music and sounds'}
                className="p-4 bg-white/90 hover:bg-white text-slate-800 rounded-2xl border-4 border-slate-700 shadow-[0_4px_0_#334155] active:translate-y-[4px] active:shadow-none flex items-center gap-2 flex-1 justify-center font-bold text-sm cursor-pointer transition-all"
              >
                {settings.soundEnabled ? (
                  <>
                    <Volume2 className="w-5 h-5 text-green-500" />
                    <span>Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-5 h-5 text-rose-500" />
                    <span>Muted</span>
                  </>
                )}
              </button>

              {/* Rudy mode toggler shortcut */}
              <button
                id="main_menu_rudy_preset_btn"
                onClick={() => {
                  playSynthesizedSound('correct');
                  handleSettingsChange({ rudyMode: !settings.rudyMode });
                  if (!settings.rudyMode) {
                    // Activate Rudy presets directly
                    handleSettingsChange({
                      rudyMode: true,
                      gridSize: 3,
                      reducedMotion: true,
                      extraLargeTiles: true,
                      repeatRate: 0.75,
                    });
                  }
                }}
                className={`p-4 rounded-2xl border-4 shadow-[0_4px_0_#334155] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2 flex-1 font-black text-sm cursor-pointer transition-all ${
                  settings.rudyMode
                    ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-[0_4px_0_#D97706]'
                    : 'bg-white/90 border-slate-700 text-slate-700'
                }`}
              >
                <Sparkles className={`w-5 h-5 ${settings.rudyMode ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>{settings.rudyMode ? 'Rudy Mode Active' : 'Calm Cozy Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SELECT GAME screen ==================== */}
      {screen === 'select_game' && (
        <div className="flex-1 flex flex-col justify-between p-6 max-w-sm mx-auto w-full min-h-screen">
          <div className="pt-2 flex items-center gap-2.5">
            <button
              onClick={() => {
                playSynthesizedSound('tap');
                setScreen('menu');
              }}
              aria-label="Go back to main menu"
              className="p-2.5 bg-white border-2 border-slate-400 hover:border-slate-600 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800">Select Game Category</h2>
          </div>

          {/* Responsive list of play modes */}
          <div className="space-y-4 my-6 flex-1 flex flex-col justify-center">
            {GAME_MODES.map((mode) => {
              const bgColors = {
                shapes_colors: 'hover:border-purple-400 border-slate-300',
                shapes_only: 'hover:border-blue-400 border-slate-300',
                colors_only: 'hover:border-emerald-400 border-slate-300',
              };

              // Make beautiful cartoonish graphic previews for selections
              const graphicPreview = () => {
                switch (mode.id) {
                  case 'shapes_colors':
                    return (
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-emerald-500 border border-slate-700 block" />
                        <span className="w-8 h-8 rounded-xs bg-pink-500 border border-slate-700 block" />
                        <span className="w-8 h-8 ml-1 block border-t-16 border-l-10 border-r-10 border-l-transparent border-r-transparent border-t-yellow-400" />
                      </div>
                    );
                  case 'shapes_only':
                    return (
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-400 border border-slate-700 block" />
                        <span className="w-8 h-8 rounded-xs bg-slate-400 border border-slate-700 block" />
                        <span className="w-8 h-8 rounded-xs rotate-45 scale-80 bg-slate-400 border border-slate-700 block" />
                      </div>
                    );
                  case 'colors_only':
                  default:
                    return (
                      <div className="flex items-center gap-1">
                        <span className="w-6 h-6 rounded-xs bg-blue-500 border block" />
                        <span className="w-6 h-6 rounded-xs bg-red-500 border block" />
                        <span className="w-6 h-6 rounded-xs bg-yellow-400 border block animate-bounce" />
                      </div>
                    );
                }
              };

              return (
                <button
                  key={mode.id}
                  id={`mode-select-${mode.id}`}
                  onClick={() => {
                    playSynthesizedSound('correct');
                    setGameMode(mode.id);

                    // Skip Grid selection in Rudy mode directly to 3x3 for simplicity
                    if (settings.rudyMode) {
                      handleStartGame(mode.id, 3);
                    } else {
                      setScreen('select_grid');
                    }
                  }}
                  className={`p-4 bg-white hover:bg-slate-50 border-4 shadow-md rounded-2xl text-left flex items-center justify-between cursor-pointer transition-all active:translate-y-[2px] active:shadow-xs ${
                    bgColors[mode.id]
                  }`}
                >
                  <div className="flex-1 pr-3">
                    <span className="text-lg font-black text-slate-800 tracking-tight block">
                      {mode.name}
                    </span>
                    <p className="text-xs text-slate-500 font-bold block mt-0.5">
                      {mode.modeText}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex-shrink-0">
                    {graphicPreview()}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-slate-500 text-xs font-bold leading-relaxed text-center px-4 bg-white/30 py-2 rounded-xl border border-slate-200">
            Choose if you want to identify shapes, practice your custom colors, or learn both together.
          </p>
        </div>
      )}

      {/* ==================== SELECT GRID screen ==================== */}
      {screen === 'select_grid' && (
        <div className="flex-1 flex flex-col justify-between p-6 max-w-sm mx-auto w-full min-h-screen">
          <div className="pt-2 flex items-center gap-2.5">
            <button
              onClick={() => {
                playSynthesizedSound('tap');
                setScreen('select_game');
              }}
              aria-label="Go back to category selection"
              className="p-2.5 bg-white border-2 border-slate-400 hover:border-slate-600 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800">Choose Grid Size</h2>
          </div>

          {/* Interactive grid cards helper */}
          <div className="space-y-4 my-6 flex-1 flex flex-col justify-center">
            {/* 3x3 Easy mode */}
            <button
              id="grid-size-3x3-card"
              onClick={() => handleStartGame(gameMode, 3)}
              className="p-5 bg-white hover:bg-slate-50 border-4 border-slate-300 shadow-md rounded-2xl flex items-center gap-4 text-left cursor-pointer transition-all active:translate-y-[2px]"
            >
              <div className="bg-orange-100 p-2 rounded-xl border border-orange-200 flex-shrink-0 grid grid-cols-3 gap-1 w-14 h-14">
                {[...Array(9)].map((_, i) => (
                  <span key={i} className="bg-orange-400 rounded-2xs block" />
                ))}
              </div>
              <div>
                <span className="text-lg font-black text-slate-800 tracking-tight block">
                  3×3 Easy Grid
                </span>
                <p className="text-xs text-slate-500 font-bold block mt-0.5">
                  Great for little beginners. Fewer distractors to process.
                </p>
              </div>
            </button>

            {/* 4x4 Advanced mode */}
            <button
              id="grid-size-4x4-card"
              onClick={() => handleStartGame(gameMode, 4)}
              className="p-5 bg-white hover:bg-slate-50 border-4 border-slate-300 shadow-md rounded-2xl flex items-center gap-4 text-left cursor-pointer transition-all active:translate-y-[2px]"
            >
              <div className="bg-indigo-100 p-2 rounded-xl border border-indigo-200 flex-shrink-0 grid grid-cols-4 gap-1 w-14 h-14">
                {[...Array(16)].map((_, i) => (
                  <span key={i} className="bg-indigo-400 rounded-2xs block" />
                ))}
              </div>
              <div>
                <span className="text-lg font-black text-slate-800 tracking-tight block">
                  4×4 Advanced Grid
                </span>
                <p className="text-xs text-slate-500 font-bold block mt-0.5">
                  Perfect for kids who want a cozy shapes match puzzle.
                </p>
              </div>
            </button>
          </div>

          <p className="text-slate-500 text-xs font-bold leading-relaxed text-center px-4 bg-white/30 py-2 rounded-xl border border-slate-200">
            The grid is populated immediately with random items, ensuring a different board layout every game!
          </p>
        </div>
      )}

      {/* ==================== GAMEPLAY BOARD ==================== */}
      {screen === 'game' && (
        <div className="flex-1 flex flex-col justify-between p-4 max-w-md mx-auto w-full min-h-screen gap-3">
          {/* Top Info Bar */}
          <div className="flex justify-between items-center w-full bg-white/60 p-2 rounded-2xl border border-white/40">
            <button
              onClick={() => {
                playSynthesizedSound('tap');
                stopSpeech();
                setScreen('select_game');
              }}
              aria-label="Exit game board and go back"
              className="py-2 px-3 text-xs bg-white text-slate-700 hover:text-slate-900 font-extrabold border-2 border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Quit Game
            </button>

            <span className="text-xs font-black bg-orange-500 text-white px-3 py-1 rounded-full border border-orange-600">
              Mode: {gameMode === 'shapes_colors' ? 'Colors & Shapes' : gameMode === 'shapes_only' ? 'Shapes' : 'Colors'}
            </span>

            <button
              onClick={() => {
                playSynthesizedSound('tap');
                setShowSettings(true);
              }}
              aria-label="Open settings panel"
              className="p-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer transition-all"
            >
              <SlidersHorizontal className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Interactive target helper character banner */}
          <PromptBar
            promptText={currentTarget?.text || ''}
            speakPrompt={speakCurrentPrompt}
            mascotMood={mascotMood}
            mascotId={activeMascot.id}
            pulseActive={pulsePrompt}
            reducedMotion={settings.reducedMotion}
          />

          {/* Bingo Grid Container */}
          <div className="flex-1 flex items-center justify-center py-2">
            <div
              className={`w-full bg-white rounded-3xl border-4 border-slate-700 p-3 shadow-xl ${
                gridSize === 3 ? 'grid-cols-3' : 'grid-cols-4'
              } grid ${settings.extraLargeTiles ? 'gap-4' : 'gap-3'}`}
            >
              {board.map((cell, idx) => (
                <ShapeTile
                  key={cell.id}
                  cell={cell}
                  index={idx}
                  highContrast={settings.highContrast}
                  extraLarge={settings.extraLargeTiles}
                  reducedMotion={settings.reducedMotion}
                  onClick={() => handleCellTap(cell, idx)}
                  isCorrectTarget={currentTarget?.cellId === cell.id}
                />
              ))}
            </div>
          </div>

          {/* Friendly directions hints */}
          <p className="text-center text-xs font-bold text-slate-700/80 bg-white/20 px-4 py-1.5 rounded-full border border-white/10 mx-auto">
            {hasCompletedBingo ? 'Bingo Achieved!' : 'Need aid? Tap the orange Repeat button anytime!'}
          </p>
        </div>
      )}

      {/* ==================== SCREEN REPORT CARD ==================== */}
      {screen === 'report' && (
        <div className="flex-1 flex flex-col justify-center p-6 max-w-sm mx-auto w-full min-h-screen">
          <ScoreReport
            correctCount={correctClicks}
            incorrectCount={incorrectClicks}
            currentAccuracy={sessionAccuracy}
            overallAverage={sessionAverage}
            rudyModeActive={settings.rudyMode}
            onPlayAgain={() => {
              setScreen('select_game');
            }}
          />
        </div>
      )}

      {/* Bingo victory animation blocker */}
      {hasCompletedBingo && screen === 'game' && (
        <BingoOverlay
          onContinue={handleBingoOverCompleted}
          reducedMotion={settings.reducedMotion}
        />
      )}

      {/* Accessibility Feedback toast */}
      <FeedbackToast
        status={feedbackStatus}
        message={feedbackMessage}
        onTimeout={() => {
          if (feedbackStatus === 'correct' || feedbackStatus === 'incorrect') {
            setFeedbackStatus('idle');
          }
        }}
        reducedMotion={settings.reducedMotion}
      />

      {/* Accessible slide-up Settings panel */}
      <SettingsPanel
        settings={settings}
        onChange={handleSettingsChange}
        onClose={() => setShowSettings(false)}
        open={showSettings}
      />
    </div>
  );
}
