// shots.js — one clear job: the ?shot= hook for screenshots.
// A screenshot must show the real game mid-hunt, so each shot seeds a genuine
// playing state: a scene, a few differences already found (with their markers
// on both panels), several still unfound, and the counter showing the remainder.
// Nothing here changes the rules — it only fast-forwards a real game to a
// photogenic moment, the same way a player would reach it by clicking.
//
//   ?shot=cover   Scene 2 (Neon Night Street), 3 of 7 found, ~1:47 left
//   ?shot=beach   Scene 1 (Beach Cove), 2 of 7 found
//   ?shot=green   Scene 3 (Garden Greenhouse), 4 of 7 found
//   ?shot=start   The title screen
// No parameter: the title screen, as a fresh player sees it.

import { SCENES } from './differences.js';
import { SCREEN_PLAYING, SCREEN_TITLE, startScene } from './state.js';

const SHOTS = {
  cover: { scene: 1, found: ['moon-phase', 'ramen-sign', 'cat-tail'], timeLeft: 107, score: 375, combo: 3 },
  beach: { scene: 0, found: ['sun-glasses', 'crab-claw'], timeLeft: 118, score: 225, combo: 2 },
  green: { scene: 2, found: ['butterfly-wing', 'flower-colour', 'frog-eyes', 'bee-gone'], timeLeft: 74, score: 900, combo: 4 },
};

/** Apply a ?shot= preset to a fresh game. Returns the shot name, or null. */
export function applyShot(game) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (shot === 'start' || shot === null) {
    game.screen = SCREEN_TITLE;
    return shot;
  }
  const preset = SHOTS[shot];
  if (!preset) {
    game.screen = SCREEN_TITLE;
    return null;
  }
  startScene(game, preset.scene);
  game.found = [...preset.found];
  game.totalFound = preset.found.length;
  game.timeLeft = preset.timeLeft;
  game.score = preset.score;
  game.combo = preset.combo;
  game.bestCombo = preset.combo;
  game.screen = SCREEN_PLAYING;
  game.message = '';
  game.messageUntil = 0;
  return shot;
}

/** The scene names, for the screenshot driver's own logging. */
export function shotSceneName(shot) {
  const preset = SHOTS[shot];
  return preset ? SCENES[preset.scene].name : 'title';
}

/** The shot names this hook understands. */
export function shotNames() {
  return [...Object.keys(SHOTS), 'start'];
}
