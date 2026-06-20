import React from 'react';
import { Volume2 } from 'lucide-react';
import { MascotRenderer, MascotMood } from './MascotRenderer';
import { playSynthesizedSound } from '../utils/audio';

interface PromptBarProps {
  promptText: string;
  speakPrompt: () => void;
  mascotMood: MascotMood;
  mascotId: string;
  pulseActive: boolean; // Briefly pulse this bar on incorrect taps as an encouragement to try again
  reducedMotion: boolean;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  promptText,
  speakPrompt,
  mascotMood,
  mascotId,
  pulseActive,
  reducedMotion,
}) => {
  const handleRepeat = () => {
    playSynthesizedSound('tap');
    speakPrompt();
  };

  return (
    <div
      className={`w-full bg-white rounded-3xl border-4 border-slate-700 shadow-lg p-3 flex items-center justify-between gap-3 transition-all duration-300 ${
        pulseActive && !reducedMotion ? 'animate-[shake_0.5s_ease-in-out] border-orange-500 scale-[1.02]' : ''
      }`}
    >
      {/* Mascot character speaking */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="bg-slate-50 p-1.5 rounded-2xl border-2 border-slate-200 shadow-inner flex-shrink-0">
          <MascotRenderer id={mascotId} mood={mascotMood} size={76} />
        </div>

        {/* Written directions balloon bubble */}
        <div className="flex-1 text-left px-2 min-w-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            RUDY ASKS:
          </span>
          <p className="text-2xl font-black text-slate-800 font-sans tracking-tight truncate capitalize">
            {promptText || '...'}
          </p>
        </div>
      </div>

      {/* Repeating vocal speaker button */}
      <button
        id="repeat-voice-prompt-btn"
        onClick={handleRepeat}
        aria-label="Repeat vocal prompt"
        className="h-16 px-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-2xl border-4 border-amber-600 shadow-[0_4px_0_#D97706] hover:shadow-[0_2px_0_#D97706] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2 transition-all font-bold text-lg whitespace-nowrap cursor-pointer focus-visible:ring-4 focus-visible:ring-amber-500"
      >
        <Volume2 className="w-6 h-6 animate-pulse" />
        <span className="hidden sm:inline">Repeat</span>
      </button>
    </div>
  );
};
