// Child-friendly Sound Synthesizer using Web Audio API and Speech Synthesis
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

interface AudioSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  voiceEnabled: boolean;
  rate: number; // For speech synthesis rate
}

let settings: AudioSettings = {
  soundEnabled: true,
  musicEnabled: false, // Default disabled, soft background loops can be enabled
  voiceEnabled: true,
  rate: 0.9, // slightly slower for better comprehension
};

export function updateAudioSettings(newSettings: Partial<AudioSettings>) {
  settings = { ...settings, ...newSettings };
}

// Play sound synthesis
export function playSynthesizedSound(type: 'tap' | 'correct' | 'incorrect' | 'bingo' | 'reveal' | 'stars') {
  if (!settings.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  switch (type) {
    case 'tap': {
      // Gentle soft bubble pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.09);
      break;
    }
    case 'reveal': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.16);
      break;
    }
    case 'correct': {
      // Sweet ascending major chime (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const t = now + index * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.start(t);
        osc.stop(t + 0.3);
      });
      break;
    }
    case 'incorrect': {
      // Low-pitch, ultra-soft sliding neutral wave. Non-jarring and sweet.
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.25);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.26);
      break;
    }
    case 'bingo': {
      // Beautiful major fanfares!
      const chords = [
        [261.63, 329.63, 392.00, 523.25], // C Major
        [349.23, 440.00, 523.25, 698.46], // F Major
        [392.00, 489.99, 587.33, 783.99], // G Major
        [523.25, 659.25, 783.99, 1046.50] // C Major Octave
      ];

      chords.forEach((chord, chordIdx) => {
        const chordTime = now + chordIdx * 0.25;
        chord.forEach((freq, noteIdx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          // Use triangle for a rounder woodwind sound
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, chordTime + noteIdx * 0.02);

          gain.gain.setValueAtTime(0, chordTime);
          gain.gain.linearRampToValueAtTime(0.08, chordTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.35);

          osc.start(chordTime);
          osc.stop(chordTime + 0.4);
        });
      });
      break;
    }
    case 'stars': {
      // Light star sparkle
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.12);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.13);
      break;
    }
  }
}

// Speech Synthesis Manager for verbal prompts
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel(); // Stop talking first

  if (!settings.voiceEnabled) {
    if (onEnd) onEnd();
    return;
  }

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = settings.rate;
  currentUtterance.pitch = 1.25; // Sightly higher pitch to sound friendlier for kids

  // Find a nice friendly child-like or high quality female voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (voice) =>
      voice.lang.includes('en') &&
      (voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('natural') || voice.name.toLowerCase().includes('zira'))
  );
  if (preferredVoice) {
    currentUtterance.voice = preferredVoice;
  }

  if (onEnd) {
    currentUtterance.onend = () => {
      onEnd();
    };
    currentUtterance.onerror = () => {
      onEnd();
    };
  }

  window.speechSynthesis.speak(currentUtterance);
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
