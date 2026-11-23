// Web Audio API notification chime generator (zero external assets needed)
export function playChimeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // Friendly 2-tone melodic notification chime (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.12);

      // Smooth attack and release envelope
      gain.gain.setValueAtTime(0, startTime + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, startTime + index * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.12 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + index * 0.12);
      osc.stop(startTime + index * 0.12 + 0.5);
    });
  } catch (e) {
    console.warn('Audio chime playback was prevented or not supported:', e);
  }
}
