// state.js — one clear job: the game's state machine and scoring rules.
// Screens: title, playing, paused, round (scene cleared), over (game over / win).
// Scoring: 100 points per find, +25 per combo step, +10 per second left at a
// scene clear. A wrong click costs 3 seconds and resets the combo. Hints are
// limited to 3 per scene and highlight one unfound difference for a few seconds.

import { SCENES, totalDifferences } from './differences.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAYING = 'playing';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_ROUND = 'round';
export const SCREEN_OVER = 'over';

export const BEST_KEY = 'twin-worlds-best-score';

export function loadBestScore() {
  try {
    const raw = window.localStorage.getItem(BEST_KEY);
    const n = raw === null ? 0 : Number.parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch (err) {
    return 0;
  }
}

export function saveBestScore(score) {
  try {
    window.localStorage.setItem(BEST_KEY, String(score));
  } catch (err) {
    // Best score is a nicety; a blocked localStorage must not break play.
  }
}

export function createGame() {
  return {
    screen: SCREEN_TITLE,
    sceneIndex: 0,
    found: [], // difference ids found in the current scene
    score: 0,
    combo: 0,
    bestCombo: 0,
    timeLeft: SCENES[0].timeLimit,
    hintsLeft: 3,
    hint: null, // { diffId, until } while a hint ring is showing
    totalFound: 0,
    wrongClicks: 0,
    best: loadBestScore(),
    roundStats: null, // { found, timeLeft, bonus, score } for the round screen
    finalStats: null, // { score, totalFound, bestCombo, won } for the game-over screen
    lastTickSecond: -1,
    message: '',
    messageUntil: 0,
  };
}

export function currentScene(game) {
  return SCENES[game.sceneIndex];
}

export function foundCount(game) {
  return game.found.length;
}

export function remainingCount(game) {
  return currentScene(game).differences.length - game.found.length;
}

export function startGame(game) {
  game.screen = SCREEN_PLAYING;
  game.sceneIndex = 0;
  game.found = [];
  game.score = 0;
  game.combo = 0;
  game.bestCombo = 0;
  game.timeLeft = SCENES[0].timeLimit;
  game.hintsLeft = 3;
  game.hint = null;
  game.totalFound = 0;
  game.wrongClicks = 0;
  game.roundStats = null;
  game.finalStats = null;
  game.lastTickSecond = -1;
  game.message = 'Find all 7 differences!';
  game.messageUntil = performance.now() + 2500;
}

export function startScene(game, index) {
  game.sceneIndex = index;
  game.found = [];
  game.combo = 0;
  game.timeLeft = SCENES[index].timeLimit;
  game.hintsLeft = 3;
  game.hint = null;
  game.screen = SCREEN_PLAYING;
  game.roundStats = null;
  game.message = `Scene ${index + 1}: ${SCENES[index].name} — find 7 differences!`;
  game.messageUntil = performance.now() + 2500;
}

/** Register a found difference. Returns the points earned, or 0 if already found. */
export function registerFound(game, diffId) {
  if (game.found.includes(diffId)) return 0;
  game.found.push(diffId);
  game.totalFound += 1;
  game.combo += 1;
  if (game.combo > game.bestCombo) game.bestCombo = game.combo;
  const points = 100 + (game.combo - 1) * 25;
  game.score += points;
  return points;
}

/** Register a wrong click: lose 3 seconds, combo resets. Returns the seconds lost. */
export function registerWrong(game) {
  game.wrongClicks += 1;
  game.combo = 0;
  game.timeLeft = Math.max(0, game.timeLeft - 3);
  return 3;
}

/** Use a hint: returns the hinted difference, or null when none are left. */
export function useHint(game, now) {
  if (game.hintsLeft <= 0 || game.screen !== SCREEN_PLAYING) return null;
  const remaining = currentScene(game).differences.filter((d) => !game.found.includes(d.id));
  if (remaining.length === 0) return null;
  game.hintsLeft -= 1;
  const diff = remaining[Math.floor(Math.random() * remaining.length)];
  game.hint = { diffId: diff.id, until: now + 2600 };
  return diff;
}

/** Finish the current scene: time bonus, then advance or end the game. */
export function clearScene(game) {
  const bonus = Math.round(game.timeLeft) * 10;
  game.score += bonus;
  game.roundStats = {
    found: game.found.length,
    timeLeft: Math.round(game.timeLeft),
    bonus,
    score: game.score,
  };
  if (game.sceneIndex + 1 < SCENES.length) {
    game.screen = SCREEN_ROUND;
  } else {
    finishGame(game, true);
  }
  return bonus;
}

export function finishGame(game, won) {
  game.screen = SCREEN_OVER;
  game.finalStats = {
    score: game.score,
    totalFound: game.totalFound,
    bestCombo: game.bestCombo,
    won,
  };
  if (game.score > game.best) {
    game.best = game.score;
    saveBestScore(game.score);
  }
}

/** Advance the clock. Returns 'timeout' when time runs out mid-play. */
export function tickClock(game, dtSeconds) {
  if (game.screen !== SCREEN_PLAYING) return null;
  game.timeLeft -= dtSeconds;
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    finishGame(game, false);
    return 'timeout';
  }
  return null;
}

export function totalScenes() {
  return SCENES.length;
}

export function totalDiffs() {
  return totalDifferences();
}
