import React from 'react';
import { Award, Zap, RefreshCw, Heart } from 'lucide-react';
import { playSynthesizedSound } from '../utils/audio';

interface ScoreReportProps {
  correctCount: number;
  incorrectCount: number;
  currentAccuracy: number;
  overallAverage: number;
  rudyModeActive: boolean;
  onPlayAgain: () => void;
}

export const ScoreReport: React.FC<ScoreReportProps> = ({
  correctCount,
  incorrectCount,
  currentAccuracy,
  overallAverage,
  rudyModeActive,
  onPlayAgain,
}) => {
  const handleStartAgain = () => {
    playSynthesizedSound('correct');
    onPlayAgain();
  };

  const totalTaps = correctCount + incorrectCount;

  return (
    <div className="w-full max-w-sm mx-auto text-center bg-white rounded-3xl border-4 border-slate-700 shadow-xl p-6 relative flex flex-col gap-6">
      {/* Upper Award Shield decoration */}
      <div className="mx-auto bg-amber-400 p-4 rounded-3xl border-4 border-slate-700 shadow-md transform rotate-2 -mt-16 relative">
        <Award className="w-12 h-12 text-slate-800" />
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight font-sans">
          Shape Spotlight Report!
        </h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
          Rudy&apos;s Shapes Bingo
        </p>
      </div>

      {/* Accuracy stats card */}
      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col gap-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-bold text-xs">Accuracy This Game:</span>
          </div>
          <span className="font-extrabold text-orange-600 text-lg">
            {rudyModeActive ? '100% Super!' : `${currentAccuracy}%`}
          </span>
        </div>

        {/* Historical Stats, only logged if not strictly in Rudy Mode preset (as per prompt rules) */}
        <div className="flex items-center justify-between border-t border-amber-200 pt-2.5">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-bold text-xs block">All-Games Average:</span>
          </div>
          <span className="font-extrabold text-rose-600 text-sm">
            {rudyModeActive ? '100% Star!' : `${overallAverage}%`}
          </span>
        </div>
      </div>

      {/* Micro report counters */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase block mb-0.5">
            CORRECT TAPS
          </span>
          <span className="text-2xl font-black text-emerald-500">
            {correctCount}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase block mb-0.5">
            HELP TRIGGERS
          </span>
          <span className="text-2xl font-black text-slate-600">
            {rudyModeActive ? 0 : incorrectCount}
          </span>
        </div>
      </div>

      {/* Encouragement message */}
      <p className="text-sm font-semibold text-slate-700 leading-relaxed italic px-2">
        {rudyModeActive
          ? 'You played beautifully, Rudy! You found every single shape and covered the board. Ready to try again?'
          : 'You are matching shapes exceptionally well. Keep and support the focus! Let&apos;s play another game!'}
      </p>

      {/* CTA Button */}
      <button
        onClick={handleStartAgain}
        className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 border-b-6 border-orange-700 hover:translate-y-[2px] hover:border-b-4 active:translate-y-[6px] active:border-b-0 cursor-pointer rounded-2xl text-white font-black text-lg flex items-center justify-center gap-2.5 shadow-lg transition-all"
      >
        <RefreshCw className="w-5 h-5" />
        Play Bingo Again!
      </button>
    </div>
  );
};
