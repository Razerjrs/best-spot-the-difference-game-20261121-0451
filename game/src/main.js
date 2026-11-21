// main.js — one clear job: boot the game and run its loop.
// Wires the canvas, the HUD buttons and the keyboard to the state machine,
// runs requestAnimationFrame, and exposes window.__game so a play-test can
// drive the real game (read the counter, click a real difference).

import { playFound, playGameOver, playHint, playSceneClear, playTick, playWrong, setMuted, isMuted, unlockAudio } from './audio.js';
import { SCENES } from './differences.js';
import { drawFrame, canvasToPanel, CANVAS_W, CANVAS_H } from './render.js';
import { applyShot } from './shots.js';
import {
  SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAYING, SCREEN_ROUND, SCREEN_TITLE,
  clearScene, createGame, currentScene, finishGame, registerFound, registerWrong,
  startGame, startScene, tickClock, useHint,
} from './state.js';
import { renderOverlay, updateHud, announce } from './ui.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const game = createGame();

// Transient visual effects, kept outside the rules state.
const fx = {
  lastFoundId: null,
  lastFoundAt: 0,
  wrongMarks: [],
};

let lastTime = performance.now();
let lastOverlayScreen = null;

function refreshOverlay() {
  if (game.screen !== lastOverlayScreen) {
    renderOverlay(game);
    lastOverlayScreen = game.screen;
    wireOverlayButtons();
  }
}

function wireOverlayButtons() {
  const start = document.getElementById('ov-start');
  if (start) start.addEventListener('click', () => { startGame(game); announce('Game started. Find 7 differences.'); });
  const resume = document.getElementById('ov-resume');
  if (resume) resume.addEventListener('click', () => { game.screen = SCREEN_PLAYING; });
  const restart = document.getElementById('ov-restart');
  if (restart) restart.addEventListener('click', () => startGame(game));
  const next = document.getElementById('ov-next');
  if (next) next.addEventListener('click', () => startScene(game, game.sceneIndex + 1));
  const again = document.getElementById('ov-again');
  if (again) again.addEventListener('click', () => startGame(game));
}

/** Find the unfound difference under a panel-space point, or null. */
export function differenceAt(panelPoint) {
  if (!panelPoint) return null;
  const scene = currentScene(game);
  for (const diff of scene.differences) {
    if (game.found.includes(diff.id)) continue;
    const dx = panelPoint.x - diff.x;
    const dy = panelPoint.y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}

function handleCanvasClick(clientX, clientY) {
  if (game.screen !== SCREEN_PLAYING) return;
  const rect = canvas.getBoundingClientRect();
  const cx = ((clientX - rect.left) / rect.width) * CANVAS_W;
  const cy = ((clientY - rect.top) / rect.height) * CANVAS_H;
  const point = canvasToPanel(cx, cy);
  const diff = differenceAt(point);
  const now = performance.now();
  if (diff) {
    const points = registerFound(game, diff.id);
    fx.lastFoundId = diff.id;
    fx.lastFoundAt = now;
    playFound(game.combo);
    game.message = `Found it! +${points} points — ${currentScene(game).differences.length - game.found.length} to go`;
    game.messageUntil = now + 1800;
    announce(`Found ${diff.label}. ${currentScene(game).differences.length - game.found.length} differences remain.`);
    if (game.found.length === currentScene(game).differences.length) {
      playSceneClear();
      clearScene(game);
    }
  } else if (point) {
    registerWrong(game);
    playWrong();
    fx.wrongMarks.push({ x: cx, y: cy, at: now });
    if (fx.wrongMarks.length > 6) fx.wrongMarks.shift();
    game.message = 'Not a difference — 3 seconds lost!';
    game.messageUntil = now + 1500;
    announce('Wrong click. Three seconds lost.');
  }
}

canvas.addEventListener('click', (event) => { unlockAudio(); handleCanvasClick(event.clientX, event.clientY); });

document.getElementById('btn-hint').addEventListener('click', () => {
  const diff = useHint(game, performance.now());
  if (diff) {
    playHint();
    game.message = `Hint: ${diff.label}…`;
    game.messageUntil = performance.now() + 2600;
    announce(`Hint: ${diff.label}`);
  }
});

document.getElementById('btn-pause').addEventListener('click', () => {
  if (game.screen === SCREEN_PLAYING) game.screen = SCREEN_PAUSED;
  else if (game.screen === SCREEN_PAUSED) game.screen = SCREEN_PLAYING;
});

document.getElementById('btn-mute').addEventListener('click', (event) => {
  setMuted(!isMuted());
  event.currentTarget.textContent = isMuted() ? '🔇' : '🔊';
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') {
    document.getElementById('btn-hint').click();
  } else if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
    if (game.screen === SCREEN_PLAYING) game.screen = SCREEN_PAUSED;
    else if (game.screen === SCREEN_PAUSED) game.screen = SCREEN_PLAYING;
  } else if (event.key === 'm' || event.key === 'M') {
    document.getElementById('btn-mute').click();
  } else if (event.key === 'Enter' && game.screen === SCREEN_TITLE) {
    startGame(game);
  }
});

function frame(now) {
  const dt = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;
  if (game.screen === SCREEN_PLAYING) {
    const result = tickClock(game, dt);
    if (result === 'timeout') playGameOver();
    const whole = Math.ceil(game.timeLeft);
    if (game.timeLeft <= 10 && whole !== game.lastTickSecond) {
      game.lastTickSecond = whole;
      playTick();
    }
    if (game.hint && now > game.hint.until) game.hint = null;
  }
  fx.wrongMarks = fx.wrongMarks.filter((m) => now - m.at < 800);
  drawFrame(ctx, game, fx, now);
  updateHud(game);
  refreshOverlay();
  requestAnimationFrame(frame);
}

// Boot: title screen, unless a ?shot= preset seeds a mid-game frame.
applyShot(game);
refreshOverlay();
updateHud(game);
requestAnimationFrame(frame);

// Play-test hook: the real game state, for CDP-driven clicks and assertions.
window.__game = {
  game,
  differenceAt,
  handleCanvasClick,
  scenes: SCENES,
  canvasToPanel,
};
