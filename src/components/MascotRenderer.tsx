import React from 'react';

export type MascotMood = 'idle' | 'correct' | 'incorrect' | 'celebrate';

interface MascotRendererProps {
  id: string;
  mood: MascotMood;
  className?: string;
  size?: number;
}

export const MascotRenderer: React.FC<MascotRendererProps> = ({
  id,
  mood,
  className = '',
  size = 120,
}) => {
  const isCorrect = mood === 'correct';
  const isIncorrect = mood === 'incorrect';
  const isCelebrate = mood === 'celebrate';

  // Animation CSS helpers based on mood
  let animationClass = 'animate-[pulse_3s_infinite_ease-in-out]';
  if (isCorrect) {
    animationClass = 'animate-[bounce_0.5s_infinite]';
  } else if (isIncorrect) {
    animationClass = 'animate-[shake_0.4s_ease-in-out]';
  } else if (isCelebrate) {
    animationClass = 'animate-[bounce_0.4s_infinite] origin-center rotate-6';
  }

  // Draw actual vector character based on id
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative select-none flex items-center justify-center ${className} ${animationClass}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow under mascot */}
        <ellipse
          cx="50"
          cy="92"
          rx={isCelebrate ? '25' : '32'}
          ry="6"
          fill="rgba(0,0,0,0.12)"
          className="transition-all duration-300 transform origin-center"
          style={{
            transform: isCorrect || isCelebrate ? 'scale(0.85)' : 'scale(1)',
          }}
        />

        {(() => {
          switch (id) {
            case 'rudy_red':
            default:
              // Red/Fuchsia Cute Fuzzy Spike Mascot (as seen on the cover of game!)
              return (
                <g className="transition-all duration-300">
                  {/* Spiky hair rings */}
                  <g fill="#EC4899">
                    <circle cx="50" cy="50" r="33" />
                    {/* Spike petals around body */}
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 360) / 12;
                      return (
                        <circle
                          key={i}
                          cx={50 + 34 * Math.cos((angle * Math.PI) / 180)}
                          cy={50 + 34 * Math.sin((angle * Math.PI) / 180)}
                          r="10"
                        />
                      );
                    })}
                  </g>

                  {/* Inner rosy cheeks */}
                  <circle cx="28" cy="58" r="7" fill="#F472B6" opacity="0.6" />
                  <circle cx="72" cy="58" r="7" fill="#F472B6" opacity="0.6" />

                  {/* BIG FUNNY EYES */}
                  {/* Left Eye */}
                  <circle cx="34" cy="42" r="13" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                  {isIncorrect ? (
                    // dizzy swirls for incorrect
                    <path
                      d="M29 42 C29 38, 39 38, 39 42 C39 46, 29 46, 29 42 Z"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                  ) : isCorrect || isCelebrate ? (
                    // cute happy eye arches ^ ^
                    <path
                      d="M26 45 Q34 33 42 45"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    // normal giant eyes
                    <>
                      <circle cx="36" cy="42" r="5" fill="#000000" />
                      <circle cx="38" cy="39" r="2" fill="#FFFFFF" />
                    </>
                  )}

                  {/* Right Eye */}
                  <circle cx="66" cy="42" r="13" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                  {isIncorrect ? (
                    <path
                      d="M61 42 C61 38, 71 38, 71 42 C71 46, 61 46, 61 42 Z"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                  ) : isCorrect || isCelebrate ? (
                    <path
                      d="M58 45 Q66 33 74 45"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    <>
                      <circle cx="64" cy="42" r="5" fill="#000000" />
                      <circle cx="66" cy="39" r="2" fill="#FFFFFF" />
                    </>
                  )}

                  {/* Charming mouth */}
                  {isCorrect || isCelebrate ? (
                    // wide happy laughter mouth
                    <path
                      d="M36 58 Q50 78 64 58 Z"
                      fill="#EF4444"
                      stroke="#000000"
                      strokeWidth="2.5"
                    />
                  ) : isIncorrect ? (
                    // encouraging flat line smile
                    <path
                      d="M40 62 Q50 58 60 62"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    // friendly goofy gap-toothed smile
                    <path
                      d="M36 58 Q50 72 64 58"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Cute small white tooth */}
                  {!isIncorrect && !isCorrect && (
                    <rect x="47" y="60" width="6" height="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
                  )}

                  {/* Celebration Crown */}
                  {isCelebrate && (
                    <polygon
                      points="35,15 42,28 50,15 58,28 65,15 62,32 38,32"
                      fill="#F59E0B"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );

            case 'gloop_blue':
              // Blue Jelly/Slime Mascot with little feelers
              return (
                <g className="transition-all duration-300">
                  {/* Gel body */}
                  <path
                    d="M 18,72 C 12,50 18,25 50,22 C 82,19 88,50 82,72 C 78,85 64,88 50,88 C 36,88 22,85 18,72 Z"
                    fill="#3B82F6"
                    stroke="#1E40AF"
                    strokeWidth="3"
                  />

                  {/* Little sensory feelers / antennae */}
                  <path d="M 40,22 Q 35,10 28,12" fill="none" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="28" cy="12" r="4" fill="#60A5FA" />

                  <path d="M 60,22 Q 65,10 72,12" fill="none" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="72" cy="12" r="4" fill="#60A5FA" />

                  {/* Inner spot details */}
                  <circle cx="34" cy="34" r="5" fill="#2563EB" opacity="0.4" />
                  <circle cx="70" cy="40" r="7" fill="#2563EB" opacity="0.4" />
                  <circle cx="46" cy="78" r="4" fill="#2563EB" opacity="0.4" />

                  {/* Rosy blush */}
                  <circle cx="32" cy="62" r="5" fill="#F472B6" opacity="0.5" />
                  <circle cx="68" cy="62" r="5" fill="#F472B6" opacity="0.5" />

                  {/* EYES */}
                  {isCorrect || isCelebrate ? (
                    <>
                      {/* Squeezed joy arcs */}
                      <path d="M28 50 L38 46 L28 42" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                      <path d="M72 50 L62 46 L72 42" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                    </>
                  ) : isIncorrect ? (
                    <>
                      {/* Dizzy cross eyes x x */}
                      <path d="M28 42 L38 52 M38 42 L28 52" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M62 42 L72 52 M72 42 L62 52" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      {/* One big, one small eye (extremely expressive!) */}
                      <circle cx="33" cy="47" r="10" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                      <circle cx="33" cy="47" r="4.5" fill="#111827" />
                      <circle cx="35" cy="45" r="2.2" fill="#FFFFFF" />

                      <circle cx="67" cy="47" r="7" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
                      <circle cx="67" cy="47" r="3.2" fill="#111827" />
                      <circle cx="68" cy="45" r="1.5" fill="#FFFFFF" />
                    </>
                  )}

                  {/* Mouth */}
                  {isCorrect || isCelebrate ? (
                    <circle cx="50" cy="64" r="8" fill="#111827" />
                  ) : (
                    <path
                      d="M 44,60 Q 50,68 56,60"
                      fill="none"
                      stroke="#111827"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );

            case 'spike_green':
              // Green Friendly Alien/Spider, 6 cute little legs
              return (
                <g className="transition-all duration-300">
                  {/* Little crawling legs */}
                  <g stroke="#065F46" strokeWidth="3.5" fill="none" strokeLinecap="round">
                    {/* Left side legs */}
                    <path d="M25 65 Q10 65 8 82" />
                    <path d="M22 55 Q5 55 4 72" />
                    <path d="M25 45 Q8 35 12 55" />
                    {/* Right side legs */}
                    <path d="M75 65 Q90 65 92 82" />
                    <path d="M78 55 Q95 55 96 72" />
                    <path d="M75 45 Q92 35 88 55" />
                  </g>

                  {/* Main round fuzzy body */}
                  <circle cx="50" cy="50" r="32" fill="#10B981" stroke="#065F46" strokeWidth="3" />

                  {/* Star details on the body */}
                  <polygon points="50,22 52,27 57,27 53,30 55,35 50,32 45,35 47,30 43,27 48,27" fill="#6EE7B7" />

                  {/* Rosy cheeks */}
                  <circle cx="32" cy="56" r="4" fill="#34D399" />
                  <circle cx="68" cy="56" r="4" fill="#34D399" />

                  {/* EYES */}
                  {isCorrect || isCelebrate ? (
                    <>
                      <path d="M30 45 Q36 38 42 45" fill="none" stroke="#065F46" strokeWidth="4" strokeLinecap="round" />
                      <path d="M58 45 Q64 38 70 45" fill="none" stroke="#065F46" strokeWidth="4" strokeLinecap="round" />
                    </>
                  ) : isIncorrect ? (
                    <>
                      <path d="M30 42 L42 48 M42 42 L30 48" stroke="#065F46" strokeWidth="3" strokeLinecap="round" />
                      <path d="M58 42 L70 48 M70 42 L58 48" stroke="#065F46" strokeWidth="3" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      {/* Big glossy cartoon eyes */}
                      <circle cx="36" cy="44" r="9" fill="#FFFFFF" stroke="#065F46" strokeWidth="2" />
                      <circle cx="36" cy="44" r="4" fill="#111827" />
                      <ellipse cx="38" cy="41" rx="2" ry="1" fill="#FFFFFF" />

                      <circle cx="64" cy="44" r="9" fill="#FFFFFF" stroke="#065F46" strokeWidth="2" />
                      <circle cx="64" cy="44" r="4" fill="#111827" />
                      <ellipse cx="66" cy="41" rx="2" ry="1" fill="#FFFFFF" />
                    </>
                  )}

                  {/* Goofy wide mouth */}
                  {isCorrect || isCelebrate ? (
                    <path d="M38 56 Q50 72 62 56 Z" fill="#EF4444" stroke="#065F46" strokeWidth="2" />
                  ) : (
                    <path d="M38 56 Q50 64 62 56" fill="none" stroke="#065F46" strokeWidth="3.5" strokeLinecap="round" />
                  )}
                </g>
              );

            case 'sunny_yellow':
              // Sunny Sparkle Star Mascot
              return (
                <g className="transition-all duration-300">
                  {/* 8 points shiny star body */}
                  <g fill="#FBBF24" stroke="#B45309" strokeWidth="2.5">
                    <path d="M50 8 L60 30 L84 30 L66 46 L76 70 L50 56 L24 70 L34 46 L16 30 L40 30 Z" />
                  </g>

                  {/* Blush */}
                  <circle cx="36" cy="48" r="4" fill="#F87171" opacity="0.6" />
                  <circle cx="64" cy="48" r="4" fill="#F87171" opacity="0.6" />

                  {/* EYES */}
                  {isCorrect || isCelebrate ? (
                    <>
                      <path d="M30 42 Q36 34 42 42" fill="none" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M58 42 Q64 34 70 42" fill="none" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
                    </>
                  ) : isIncorrect ? (
                    <>
                      <path d="M32 40 Q40 40 40 45" fill="none" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
                      <path d="M68 40 Q60 40 60 45" fill="none" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <circle cx="36" cy="42" r="7.5" fill="#FFFFFF" stroke="#451A03" strokeWidth="2" />
                      <circle cx="36" cy="42" r="3.5" fill="#451A03" />
                      <circle cx="38" cy="40" r="1.5" fill="#FFFFFF" />

                      <circle cx="64" cy="42" r="7.5" fill="#FFFFFF" stroke="#451A03" strokeWidth="2" />
                      <circle cx="64" cy="42" r="3.5" fill="#451A03" />
                      <circle cx="66" cy="40" r="1.5" fill="#FFFFFF" />
                    </>
                  )}

                  {/* Happy dynamic tongue/smile */}
                  {isCorrect || isCelebrate ? (
                    <path d="M38 52 Q50 68 62 52 Z" fill="#EF4444" stroke="#451A03" strokeWidth="2" />
                  ) : (
                    <path d="M42 50 Q50 56 58 50" fill="none" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
                  )}
                </g>
              );
          }
        })()}
      </svg>
    </div>
  );
};
