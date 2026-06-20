import React from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Sparkles, RefreshCw, X, Sliders, Check } from 'lucide-react';
import { playSynthesizedSound } from '../utils/audio';

export interface GameSettings {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  musicEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  gridSize: 3 | 4;
  extraLargeTiles: boolean;
  repeatRate: number; // 0.8 is slower, 1.0 is normal
  rudyMode: boolean; // Rudy mode preset!
}

interface SettingsPanelProps {
  settings: GameSettings;
  onChange: (update: Partial<GameSettings>) => void;
  onClose: () => void;
  open: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onChange,
  onClose,
  open,
}) => {
  if (!open) return null;

  const triggerToggle = (key: keyof GameSettings, val: any) => {
    playSynthesizedSound('tap');

    if (key === 'rudyMode' && val === true) {
      // Apply Rudy Mode Presets directly!
      onChange({
        rudyMode: true,
        gridSize: 3,
        reducedMotion: true,
        extraLargeTiles: true,
        repeatRate: 0.75, // lovely slower, calmer speech tempo
        highContrast: false, // gentle, high-visual warmth orange-peach gradients
      });
    } else if (key === 'rudyMode' && val === false) {
      onChange({ rudyMode: false });
    } else {
      // For any other toggle, if they change it away from Rudy Mode values, we turn off the Rudy Mode indicator
      const currentUpdate: Partial<GameSettings> = { [key]: val };
      if (
        (key === 'gridSize' && val !== 3) ||
        (key === 'reducedMotion' && val !== true) ||
        (key === 'extraLargeTiles' && val !== true)
      ) {
        currentUpdate.rudyMode = false;
      }
      onChange(currentUpdate);
    }
  };

  const handleClearStats = () => {
    playSynthesizedSound('correct');
    localStorage.removeItem('rudys_shapes_bingo_stats');
    alert('Stats have been reset. Beautiful fresh start!');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl border-4 border-slate-700 shadow-2xl p-6 overflow-y-auto max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-orange-500" />
            <h2 id="settings-title" className="text-2xl font-bold text-slate-800 font-sans tracking-tight">
              Parent & Settings
            </h2>
          </div>
          <button
            onClick={() => {
              playSynthesizedSound('tap');
              onClose();
            }}
            aria-label="Close settings window"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Rudy Mode Preset Button (Prominent, Cheerful) */}
        <div className="mb-6">
          <button
            onClick={() => triggerToggle('rudyMode', !settings.rudyMode)}
            className={`w-full py-4 px-5 rounded-2xl border-4 text-left flex items-start gap-3 transition-all cursor-pointer ${
              settings.rudyMode
                ? 'bg-amber-100 border-amber-500 shadow-[0_4px_0_#D97706]'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-[0_4px_0_#94A3B8]'
            }`}
          >
            <div
              className={`p-2 rounded-xl transition-colors ${
                settings.rudyMode ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-800">Rudy Mode (Calm Preset)</span>
                {settings.rudyMode && (
                  <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                Autism-friendly: 3×3 grid, reduced animation, extra-large tiles, custom slower speech sounds, and encouraging retries. No stats tracking.
              </p>
            </div>
          </button>
        </div>

        {/* Options Stack */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Sound and Voice Properties
          </h3>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-700 text-sm block">Sound Effects</span>
              <span className="text-xs text-slate-500 font-medium">Bubbly taps & correct alerts</span>
            </div>
            <button
              id="sound_fx_btn"
              onClick={() => triggerToggle('soundEnabled', !settings.soundEnabled)}
              aria-label={settings.soundEnabled ? "Disable sound effects" : "Enable sound effects"}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.soundEnabled ? 'bg-green-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                } flex items-center justify-center`}
              >
                {settings.soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>
          </div>

          {/* Voice Prompts Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-700 text-sm block">Spoken Prompts</span>
              <span className="text-xs text-slate-500 font-medium">Speech output: &quot;Find the red star&quot;</span>
            </div>
            <button
              id="voice_prompts_btn"
              onClick={() => triggerToggle('voiceEnabled', !settings.voiceEnabled)}
              aria-label={settings.voiceEnabled ? "Disable voice prompts" : "Enable voice prompts"}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.voiceEnabled ? 'bg-green-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.voiceEnabled ? 'translate-x-6' : 'translate-x-0'
                } flex items-center justify-center`}
              >
                {settings.voiceEnabled ? (
                  <Check className="w-3.5 h-3.5 text-green-600 font-bold" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>
          </div>

          {/* Speech Speed controls */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-700 text-sm block">Speech Pacing Rate</span>
                <span className="text-xs text-slate-500 font-medium">Slower fits younger children better</span>
              </div>
              <span className="text-xs font-bold text-slate-600">
                {settings.repeatRate === 0.75 ? 'Very Slow' : settings.repeatRate === 0.9 ? 'Calm / Normal' : 'Fast'}
              </span>
            </div>
            <div className="flex gap-2">
              {[0.75, 0.9, 1.1].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    playSynthesizedSound('tap');
                    onChange({ repeatRate: rate, rudyMode: settings.rudyMode && rate === 0.75 });
                  }}
                  className={`flex-1 py-1 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    settings.repeatRate === rate
                      ? 'bg-orange-500 text-white border-orange-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {rate === 0.75 ? 'Slower (0.75x)' : rate === 0.9 ? 'Calm (0.9x)' : 'Standard'}
                </button>
              ))}
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-4 mb-1">
            Display & Visual Accommodations
          </h3>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-700 text-sm block">High Contrast Mode</span>
              <span className="text-xs text-slate-500 font-medium">Black & White high visibility shapes</span>
            </div>
            <button
              id="high_contrast_btn"
              onClick={() => triggerToggle('highContrast', !settings.highContrast)}
              aria-label={settings.highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.highContrast ? 'bg-green-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-0'
                } flex items-center justify-center`}
              >
                {settings.highContrast ? (
                  <Eye className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-700 text-sm block">Reduced Motion</span>
              <span className="text-xs text-slate-500 font-medium">Removes floating and flashing effects</span>
            </div>
            <button
              id="reduced_motion_btn"
              onClick={() => triggerToggle('reducedMotion', !settings.reducedMotion)}
              aria-label={settings.reducedMotion ? "Disable reduced motion" : "Enable reduced motion"}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.reducedMotion ? 'bg-green-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                } flex items-center justify-center`}
              >
                {settings.reducedMotion ? (
                  <Check className="w-3.5 h-3.5 text-green-600 font-bold" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>
          </div>

          {/* Extra-Large Grid Tiles */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-700 text-sm block">Extra-Large Tiles</span>
              <span className="text-xs text-slate-500 font-medium">Larger target areas for young fingers</span>
            </div>
            <button
              id="extra_large_tiles_btn"
              onClick={() => triggerToggle('extraLargeTiles', !settings.extraLargeTiles)}
              aria-label={settings.extraLargeTiles ? "Disable extra large tiles" : "Enable extra large tiles"}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.extraLargeTiles ? 'bg-green-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.extraLargeTiles ? 'translate-x-6' : 'translate-x-0'
                } flex items-center justify-center`}
              >
                {settings.extraLargeTiles ? (
                  <Check className="w-3.5 h-3.5 text-green-600 font-bold" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>
          </div>

          {/* Grid Size Selector */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div>
              <span className="font-bold text-slate-700 text-sm block">Default Grid Size</span>
              <span className="text-xs text-slate-500 font-medium">3×3 is easy, 4×4 is advanced</span>
            </div>
            <div className="flex gap-2">
              {[3, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    playSynthesizedSound('tap');
                    onChange({
                      gridSize: size as 3 | 4,
                      rudyMode: settings.rudyMode && size === 3,
                    });
                  }}
                  className={`flex-1 py-2 font-bold rounded-xl border transition-all cursor-pointer ${
                    settings.gridSize === size
                      ? 'bg-orange-500 text-white border-orange-600 shadow-[0_2px_0_#C2410C]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {size} × {size} Grid
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clear Data Reset Button */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={handleClearStats}
            className="flex-1 py-3 px-4 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl font-bold font-sans text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-rose-200"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All Game Memory
          </button>
        </div>
      </div>
    </div>
  );
};
