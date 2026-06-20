import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { playSynthesizedSound } from '../utils/audio';

interface FeedbackToastProps {
  status: 'idle' | 'correct' | 'incorrect';
  message: string;
  onTimeout: () => void;
  reducedMotion: boolean;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  status,
  message,
  onTimeout,
  reducedMotion,
}) => {
  useEffect(() => {
    if (status !== 'idle') {
      const timer = setTimeout(() => {
        onTimeout();
      }, 1800); // 1.8 seconds display time
      return () => clearTimeout(timer);
    }
  }, [status, onTimeout]);

  if (status === 'idle') return null;

  const isSuccess = status === 'correct';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm pointer-events-none"
    >
      <div
        className={`p-4 rounded-2xl border-4 shadow-xl flex items-center gap-3 justify-center transition-all ${
          isSuccess
            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-[0_6px_0_#10B981]'
            : 'bg-amber-100 border-amber-500 text-amber-800 shadow-[0_6px_0_#F59E0B]'
        } ${reducedMotion ? '' : 'animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]'}`}
      >
        <div
          className={`p-1.5 rounded-full ${
            isSuccess ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}
        >
          {isSuccess ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6 animate-bounce" />}
        </div>
        <div className="text-center">
          <p className="text-xl font-black tracking-tight">{message}</p>
          {!isSuccess && (
            <p className="text-xs font-bold text-amber-900 opacity-80 mt-0.5">
              Look up at the guide character for another go!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
