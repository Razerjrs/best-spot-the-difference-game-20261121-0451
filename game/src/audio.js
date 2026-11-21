// audio.js — one clear job: every sound in the game, synthesised with WebAudio.
// No audio files, no network: a found chime, a wrong-click buzz, a hint shimmer,
// a tick as the clock runs low, and a little fanfare when a scene is cleared.

let audioContext = null;
let muted = false;

function ensureContext() {
  if (audioContext) return audioContext;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioContext = new AC();
  } catch (err) {
    audioContext = null;
  }
  return audioContext;
}

function tone(freq, startAt, duration, type, volume) {
  const ctx = ensureContext();
  if (!ctx || muted) return;
  try {
    if (ctx.state === 'suspended') void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + duration + 0.05);
  } catch (err) {
    // Sound is garnish: never let it break the game.
  }
}

/** A bright two-note chime when a difference is found; pitch climbs with the combo. */
export function playFound(combo) {
  const lift = Math.min(combo, 8) * 24;
  tone(660 + lift, 0, 0.18, 'sine', 0.22);
  tone(990 + lift, 0.09, 0.28, 'sine', 0.22);
  tone(1320 + lift, 0.16, 0.3, 'triangle', 0.1);
}

/** A low dull buzz for a wrong click. */
export function playWrong() {
  tone(150, 0, 0.22, 'sawtooth', 0.14);
  tone(110, 0.05, 0.25, 'sawtooth', 0.12);
}

/** A soft shimmer when a hint is used. */
export function playHint() {
  tone(880, 0, 0.15, 'sine', 0.14);
  tone(1174, 0.08, 0.2, 'sine', 0.14);
  tone(1568, 0.16, 0.25, 'sine', 0.1);
}

/** A short tick when the clock drops under ten seconds. */
export function playTick() {
  tone(1200, 0, 0.06, 'square', 0.06);
}

/** A rising fanfare when a scene is cleared. */
export function playSceneClear() {
  const notes = [523, 659, 784, 1046];
  notes.forEach((freq, i) => tone(freq, i * 0.11, 0.3, 'triangle', 0.18));
}

/** A gentle descending phrase for game over. */
export function playGameOver() {
  const notes = [392, 330, 262, 196];
  notes.forEach((freq, i) => tone(freq, i * 0.14, 0.32, 'sine', 0.16));
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

/** Create/resume the context on a real user gesture, so the first chime plays. */
export function unlockAudio() {
  const ctx = ensureContext();
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume();
  }
}
