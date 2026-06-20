import React from 'react';
import { BingoCell } from '../utils/gameLogic';
import { ShapeRenderer } from './ShapeRenderer';
import { playSynthesizedSound } from '../utils/audio';

interface ShapeTileProps {
  cell: BingoCell;
  index: number;
  highContrast: boolean;
  extraLarge: boolean;
  reducedMotion: boolean;
  onClick: () => void;
  isCorrectTarget: boolean; // For accessibility screen reader hints
}

export const ShapeTile: React.FC<ShapeTileProps> = ({
  cell,
  index,
  highContrast,
  extraLarge,
  reducedMotion,
  onClick,
  isCorrectTarget,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  // Select a cute stamp character based on tile index so they get a variety
  const getStampColor = (idx: number) => {
    const stamps = [
      { fill: '#F43F5E', border: '#BE123C' }, // Cherry red
      { fill: '#3B82F6', border: '#1D4ED8' }, // Sapphire blue
      { fill: '#10B981', border: '#047857' }, // Emerald green
      { fill: '#F59E0B', border: '#B45309' }, // Amber yellow
      { fill: '#EC4899', border: '#BE185D' }, // Hot pink
      { fill: '#8B5CF6', border: '#6D28D9' }, // Purple
    ];
    return stamps[idx % stamps.length];
  };

  const stampColors = getStampColor(index);

  return (
    <button
      id={`tile-${index}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={cell.marked}
      aria-label={`${cell.colorInfo.name} ${cell.shapeInfo.name} tile, ${cell.marked ? 'covered' : 'active'}`}
      className={`relative w-full aspect-square bg-white rounded-2xl border-4 text-center flex items-center justify-center transition-all ${
        cell.marked
          ? 'border-emerald-400 bg-emerald-50 cursor-default shadow-inner'
          : 'border-slate-300 hover:border-slate-400 hover:scale-[1.03] active:scale-[0.97] hover:shadow-lg active:shadow-sm cursor-pointer shadow-md'
      } ${extraLarge ? 'p-1.5' : 'p-3'} outline-none focus-visible:ring-4 focus-visible:ring-orange-500`}
    >
      {/* Background shape path swirls for texture (optional, subtle) */}
      <div className="absolute inset-0 bg-radial from-slate-50 to-white rounded-xl pointer-events-none opacity-80" />

      {/* Render the core shape vector */}
      <div
        className={`w-11/12 h-11/12 flex items-center justify-center transition-all duration-300 ${
          cell.marked ? 'opacity-35 scale-90 filter blur-[0.5px]' : 'scale-100'
        }`}
      >
        <ShapeRenderer
          type={cell.shape}
          colorHex={cell.colorInfo.hex}
          highContrast={highContrast}
        />
      </div>

      {/* Cheerful Mascot Cover Stamp (Tactile Pop-in marker) */}
      {cell.marked && (
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            reducedMotion ? '' : 'animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]'
          }`}
        >
          {/* Circular cartoon face sticker */}
          <div
            style={{
              backgroundColor: stampColors.fill,
              borderColor: stampColors.border,
            }}
            className="w-4/5 h-4/5 rounded-full border-4 flex flex-col items-center justify-center shadow-lg transform rotate-6 scale-105"
          >
            {/* Googly Eyes wrapper */}
            <div className="flex gap-2.5 items-center justify-center -mt-1.5">
              {/* Left googly eye */}
              <div className="w-5 h-5 bg-white rounded-full border border-slate-800 flex items-center justify-center relative">
                <div className="w-2 h-2 bg-slate-900 rounded-full abs pointer-events-none transform -translate-x-[2px] translate-y-[1px]" />
              </div>
              {/* Right googly eye */}
              <div className="w-5 h-5 bg-white rounded-full border border-slate-800 flex items-center justify-center relative">
                <div className="w-2 h-2 bg-slate-900 rounded-full abs pointer-events-none transform translate-x-[1px] translate-y-[2px]" />
              </div>
            </div>

            {/* Hugely happy wide visual tooth/giggle */}
            <div className="w-7 h-2.5 bg-yellow-100 rounded-b-full border-2 border-slate-800 -mb-0.5 mt-1 flex items-start justify-center overflow-hidden">
              <div className="w-2.5 h-1.5 bg-white rounded-b-xs border-r border-l border-slate-800" />
            </div>

            {/* Glowing rosy cheeks */}
            <div className="absolute w-[80%] h-1 bg-white/40 blur-[1px] top-4 rounded-full" />
          </div>
        </div>
      )}
    </button>
  );
};
