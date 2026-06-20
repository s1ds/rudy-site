import React, { useEffect, useState } from 'react';
import { Star, Trophy, ArrowRight } from 'lucide-react';
import { playSynthesizedSound } from '../utils/audio';

interface BingoOverlayProps {
  onContinue: () => void;
  reducedMotion: boolean;
}

interface ConfettiItem {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'star';
  rotation: number;
  delay: number;
}

export const BingoOverlay: React.FC<BingoOverlayProps> = ({
  onContinue,
  reducedMotion,
}) => {
  const [particles, setParticles] = useState<ConfettiItem[]>([]);

  useEffect(() => {
    // Generate lovely colorful confetti stars/circles/rectangles
    const colors = [
      '#FFDE4D', // Yellow
      '#FF4C4C', // Red
      '#FF3EA5', // Pink
      '#00D7FF', // Cyan
      '#00FF66', // Green
      '#BB3BFF', // Purple
      '#FF9F43', // Orange
    ];
    const shapes: ('circle' | 'square' | 'star')[] = ['circle', 'square', 'star'];

    const items: ConfettiItem[] = Array.from({ length: 60 }).map((_, idx) => ({
      id: idx,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20, // Start above screen
      size: Math.random() * 12 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      delay: Math.random() * 1.5,
    }));
    setParticles(items);

    // Play synthesis fanfares on trigger!
    playSynthesizedSound('bingo');
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-orange-600/90 overflow-hidden">
      {/* Falling Confetti Layer */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => {
            const animationStyle = {
              left: `${p.x}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${2.5 + Math.random() * 2}s`,
            };

            return (
              <div
                key={p.id}
                style={animationStyle}
                className="absolute animate-[confettiFall_3.5s_infinite_linear] origin-center"
              >
                {p.shape === 'star' ? (
                  <Star
                    style={{
                      width: p.size,
                      height: p.size,
                      fill: p.color,
                      color: p.color,
                      transform: `rotate(${p.rotation}deg)`,
                    }}
                  />
                ) : p.shape === 'circle' ? (
                  <div
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                    }}
                    className="rounded-full"
                  />
                ) : (
                  <div
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      transform: `rotate(${p.rotation}deg)`,
                    }}
                    className="rounded-xs"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Triumphant visual banner */}
      <div
        className={`w-full max-w-sm text-center bg-white rounded-3xl border-4 border-slate-800 shadow-2xl p-6 flex flex-col items-center gap-5 relative group z-10 ${
          reducedMotion ? '' : 'animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]'
        }`}
      >
        {/* Giant floating trophy sticker */}
        <div className="bg-amber-100 p-4 rounded-full border-4 border-amber-400 -mt-16 shadow-lg animate-bounce">
          <Trophy className="w-14 h-14 text-amber-500" />
        </div>

        {/* B-I-N-G-O! Dynamic Letters */}
        <div className="flex gap-2.5 justify-center items-center py-2">
          {['B', 'I', 'N', 'G', 'O', '!'].map((letter, idx) => {
            const badgeColors = [
              'bg-red-500 border-red-700 text-red-100',
              'bg-blue-500 border-blue-700 text-blue-100',
              'bg-yellow-500 border-yellow-700 text-yellow-950',
              'bg-green-500 border-green-700 text-green-100',
              'bg-purple-500 border-purple-700 text-purple-100',
              'bg-orange-500 border-orange-700 text-orange-100',
            ];
            const letterStyle = reducedMotion
              ? {}
              : { animationDelay: `${idx * 0.1}s`, animationDuration: '0.6s' };

            return (
              <span
                key={idx}
                style={letterStyle}
                className={`w-12 h-12 rounded-xl border-4 text-2xl font-black flex items-center justify-center font-sans tracking-tight shadow-md ${
                  badgeColors[idx % badgeColors.length]
                } ${reducedMotion ? '' : 'animate-[bounce_0.6s_infinite_ease-in-out]'}`}
              >
                {letter}
              </span>
            );
          })}
        </div>

        {/* Super Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight font-sans">
            BINGO COMPLETED!
          </h1>
          <p className="text-sm font-bold text-slate-600 leading-relaxed px-2">
            You matched a full row on the board! Excellent shapes spotting, you matched like a champion!
          </p>
        </div>

        {/* Go to results */}
        <button
          onClick={() => {
            playSynthesizedSound('correct');
            onContinue();
          }}
          className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 border-b-6 border-green-700 hover:translate-y-[2px] hover:border-b-4 active:translate-y-[6px] active:border-b-0 cursor-pointer rounded-2xl text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          See My Stars
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
