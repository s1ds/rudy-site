/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  /**
   * Sound effect for pieces snapping into outlines (bubble pop)
   */
  public playSnap() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      // Fast glide upward frequency
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (err) {
      console.warn("Audio snap error:", err);
    }
  }

  /**
   * Sound effect for rotation changes (woodblock tap)
   */
  public playTick() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(450, now + 0.02);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (err) {}
  }

  /**
   * Sound effect for level completion (pentatonic star chime)
   */
  public playChime() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const playNote = (freq: number, start: number, length: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + start);

        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(0.12, now + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + length);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + length);
      };

      // Play C-Major Pentatonic Chord progression (C5 - D5 - E5 - G5 - C6)
      playNote(523.25, 0.00, 0.40); // C5
      playNote(587.33, 0.06, 0.40); // D5
      playNote(659.25, 0.12, 0.40); // E5
      playNote(783.99, 0.18, 0.50); // G5
      playNote(1046.50, 0.24, 0.60); // C6
    } catch (err) {
      console.warn("Audio chime error:", err);
    }
  }

  /**
   * Sound effect for dragging bumper contact / soft bounce
   */
  public playBounce() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (err) {}
  }

  /**
   * Mighty synthesized trumpetting fanfare for solving categories
   */
  public playFanfare() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Beautiful brassy pentatonic arpeggio: C4 -> G4 -> C5 -> E5 -> G5 -> C6
      const freqs = [261.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const start = idx * 0.07;
        const duration = 0.7 - idx * 0.04;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(freq, now + start);
        osc1.frequency.linearRampToValueAtTime(freq + 4, now + start + duration); // slight vibrato

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 1.004, now + start); // fat chorus

        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(0.06, now + start + 0.03); // crisp brass attack
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now + start);
        osc1.stop(now + start + duration);
        osc2.start(now + start);
        osc2.stop(now + start + duration);
      });

      // Majestic finishing chord at 0.45 seconds
      const finalChord = [523.25, 659.25, 783.99, 1318.51]; // C5, E5, G5, E6
      finalChord.forEach((freq, idx) => {
        const start = 0.42 + idx * 0.02;
        const duration = 1.3;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + start);

        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(0.08, now + start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + duration);
      });
    } catch (err) {
      console.warn("Fanfare sound error:", err);
    }
  }

  /**
   * Funny kid-friendly synthesized burrp sound for 2-minute timer limit
   */
  public playBurrp() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(95, now);
      osc1.frequency.linearRampToValueAtTime(75, now + 0.45);

      osc2.type = "square";
      osc2.frequency.setValueAtTime(97, now);
      osc2.frequency.linearRampToValueAtTime(76, now + 0.45);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.08); // quick swell
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.5);
      osc2.start(now);
      osc2.stop(now + 0.5);
    } catch (err) {
      console.warn("Burrp sound error:", err);
    }
  }
}

export const sounds = new SoundSystem();
