// ui.js — one clear job: everything in the DOM around the canvas.
// The header HUD (scene, found counter, clock, score, combo, hint and pause
// buttons) and the full-screen overlay panels: title, pause, round cleared
// and game over. The canvas itself is drawn by render.js.

import { SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAYING, SCREEN_ROUND, SCREEN_TITLE, currentScene, remainingCount } from './state.js';

const $ = (id) => document.getElementById(id);

function formatClock(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function sceneDots(game) {
  let html = '<div class="scene-dots">';
  for (let i = 0; i < 3; i += 1) {
    const cls = i < game.sceneIndex ? 'done' : i === game.sceneIndex ? 'now' : '';
    html += `<span class="${cls}"></span>`;
  }
  return `${html}</div>`;
}

export function updateHud(game) {
  const scene = currentScene(game);
  $('hud-scene').textContent = `Scene ${game.sceneIndex + 1} · ${scene.name}`;
  $('hud-found').innerHTML = `Found <b>${game.found.length} / ${scene.differences.length}</b>`;
  const clock = $('hud-clock');
  clock.textContent = `⏱ ${formatClock(game.timeLeft)}`;
  clock.classList.toggle('low', game.timeLeft <= 10 && game.screen === SCREEN_PLAYING);
  const fill = $('timer-fill');
  fill.style.width = `${Math.max(0, (game.timeLeft / scene.timeLimit) * 100)}%`;
  fill.classList.toggle('low', game.timeLeft <= 10);
  $('hud-score').innerHTML = `Score <b>${game.score}</b>`;
  $('hud-combo').innerHTML = `Combo <b>×${Math.max(1, game.combo)}</b>`;
  $('hint-count').textContent = String(game.hintsLeft);
  $('btn-hint').disabled = game.hintsLeft <= 0 || game.screen !== SCREEN_PLAYING;
  $('btn-pause').disabled = game.screen !== SCREEN_PLAYING && game.screen !== SCREEN_PAUSED;
  $('btn-pause').textContent = game.screen === SCREEN_PAUSED ? '▶ Resume' : '⏸ Pause';
}

function titleHtml(game) {
  return `
  <div class="panel">
    <span class="tag">A spot-the-difference hunt</span>
    <h1>TWIN WORLDS</h1>
    <p>Two pictures. Seven sneaky differences. Three hand-drawn worlds to hunt through — a sunny beach cove, a neon night street, and a garden greenhouse.</p>
    <div class="rules">
      <b>How to play</b><br>
      🖱️ Click a difference on <b>either</b> picture — a green ring marks it on both.<br>
      ❌ A wrong click costs <b>3 seconds</b> and breaks your combo.<br>
      💡 <b>Hint (H)</b> circles one hiding difference — only 3 per scene.<br>
      ⏱️ Beat the clock: every second left at a scene clear is <b>+10 points</b>.<br>
      ⌨️ <b>P</b> pause · <b>M</b> sound · <b>H</b> hint
    </div>
    ${sceneDots(game)}
    <p>Best score: <b>${game.best}</b> &nbsp;·&nbsp; 21 differences across 3 scenes</p>
    <button class="big-btn" id="ov-start">▶ Start hunting</button>
  </div>`;
}

function pauseHtml(game) {
  return `
  <div class="panel">
    <span class="tag">Paused</span>
    <h2>Take a breath</h2>
    <p>The clock is stopped. The differences are still hiding exactly where you left them.</p>
    <p>Scene ${game.sceneIndex + 1} · ${currentScene(game).name} — ${game.found.length} of 7 found, ${remainingCount(game)} to go.</p>
    <button class="big-btn" id="ov-resume">▶ Keep hunting</button><br>
    <button class="big-btn" id="ov-restart" style="background:#e2e8f0">↺ Restart game</button>
  </div>`;
}

function roundHtml(game) {
  const stats = game.roundStats;
  const stars = stats.timeLeft >= 60 ? '★★★' : stats.timeLeft >= 30 ? '★★☆' : '★☆☆';
  return `
  <div class="panel">
    <span class="tag">Scene cleared!</span>
    <h2>${currentScene(game).name} — done</h2>
    <div class="stars">${stars}</div>
    <p>All 7 differences found with <b>${stats.timeLeft}s</b> to spare.</p>
    <p class="big-score">+${stats.bonus} time bonus</p>
    <p>Score: <b>${stats.score}</b></p>
    ${sceneDots(game)}
    <p>Next up: <b>${SCENES_NEXT[game.sceneIndex + 1] || ''}</b></p>
    <button class="big-btn" id="ov-next">Next scene ▶</button>
  </div>`;
}

const SCENES_NEXT = ['', 'Neon Night Street', 'Garden Greenhouse'];

function overHtml(game) {
  const stats = game.finalStats;
  const title = stats.won ? 'You found them all!' : "Time's up!";
  const sub = stats.won
    ? 'All 21 differences across all three worlds — a true eagle eye.'
    : `The clock ran out with ${remainingCount(game)} difference${remainingCount(game) === 1 ? '' : 's'} still hiding in ${currentScene(game).name}.`;
  return `
  <div class="panel">
    <span class="tag">${stats.won ? '🏆 Complete' : 'Game over'}</span>
    <h2>${title}</h2>
    <p>${sub}</p>
    <p class="big-score">${stats.score} points</p>
    <p>Differences found: <b>${stats.totalFound} / 21</b> &nbsp;·&nbsp; Best combo: <b>×${Math.max(1, stats.bestCombo)}</b></p>
    <p>Best score: <b>${game.best}</b></p>
    <button class="big-btn" id="ov-again">↺ Play again</button>
  </div>`;
}

/** Show the overlay for the current screen, or hide it while playing. */
export function renderOverlay(game) {
  const overlay = $('overlay');
  let html = '';
  if (game.screen === SCREEN_TITLE) html = titleHtml(game);
  else if (game.screen === SCREEN_PAUSED) html = pauseHtml(game);
  else if (game.screen === SCREEN_ROUND) html = roundHtml(game);
  else if (game.screen === SCREEN_OVER) html = overHtml(game);
  if (html) {
    overlay.innerHTML = html;
    overlay.classList.add('show');
  } else {
    overlay.innerHTML = '';
    overlay.classList.remove('show');
  }
}

export function announce(message) {
  $('status').textContent = message;
}
