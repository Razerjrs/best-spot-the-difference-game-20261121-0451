// render.js — one clear job: draw one frame of the game onto the canvas.
// It draws the two panels (left original, right changed twin), the found
// markers, the hint ring, wrong-click crosses, the progress dots and the
// on-canvas messages. All HUD numbers live in the DOM header (ui.js).

import { PANEL_W, PANEL_H } from './differences.js';
import { drawScene } from './scenes.js';
import { currentScene } from './state.js';

export const CANVAS_W = 1280;
export const CANVAS_H = 736;
export const PANEL_Y = 62;
export const LEFT_X = 20;
export const RIGHT_X = 652;

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Convert a click in canvas pixels to panel space, or null when outside both panels. */
export function canvasToPanel(cx, cy) {
  if (cy < PANEL_Y || cy > PANEL_Y + PANEL_H) return null;
  if (cx >= LEFT_X && cx <= LEFT_X + PANEL_W) {
    return { side: 'left', x: cx - LEFT_X, y: cy - PANEL_Y };
  }
  if (cx >= RIGHT_X && cx <= RIGHT_X + PANEL_W) {
    return { side: 'right', x: cx - RIGHT_X, y: cy - PANEL_Y };
  }
  return null;
}

function drawPanelFrame(ctx, x, label, accent) {
  ctx.save();
  roundRectPath(ctx, x - 4, PANEL_Y - 4, PANEL_W + 8, PANEL_H + 8, 14);
  ctx.fillStyle = '#0e1424';
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, x + 2, PANEL_Y - 12);
  ctx.restore();
}

function drawFoundMarker(ctx, px, py, x, y, pulse) {
  const r = 26 + pulse * 5;
  ctx.save();
  ctx.strokeStyle = '#37c978';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(px + x, py + y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(px + x, py + y, r - 5, 0, Math.PI * 2);
  ctx.stroke();
  // Check mark inside the ring.
  ctx.strokeStyle = '#37c978';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(px + x - 11, py + y + 1);
  ctx.lineTo(px + x - 3, py + y + 9);
  ctx.lineTo(px + x + 12, py + y - 9);
  ctx.stroke();
  ctx.restore();
}

function drawHintRing(ctx, px, py, diff, now) {
  const remaining = diff.until - now;
  const phase = (now % 500) / 500;
  const r = diff.r + 10 + phase * 12;
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, remaining / 500));
  ctx.strokeStyle = '#ffd94d';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(px + diff.x, py + diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 13px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LOOK HERE', px + diff.x, py + diff.y - diff.r - 16);
  ctx.restore();
}

function drawWrongCross(ctx, mark, now) {
  const age = now - mark.at;
  if (age > 700) return;
  const alpha = 1 - age / 700;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ff5e4d';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const s = 12;
  ctx.beginPath();
  ctx.moveTo(mark.x - s, mark.y - s); ctx.lineTo(mark.x + s, mark.y + s);
  ctx.moveTo(mark.x + s, mark.y - s); ctx.lineTo(mark.x - s, mark.y + s);
  ctx.stroke();
  ctx.fillStyle = '#ff5e4d';
  ctx.font = 'bold 13px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('-3s', mark.x, mark.y + 30);
  ctx.restore();
}

export function drawFrame(ctx, game, fx, now) {
  const scene = currentScene(game);
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#1c2333';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Scene title strip.
  ctx.fillStyle = '#f4ead8';
  ctx.font = 'bold 22px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(`Scene ${game.sceneIndex + 1} of 3 — ${scene.name}`, LEFT_X, 30);
  ctx.fillStyle = '#9fb0d8';
  ctx.font = '15px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(scene.difficulty, RIGHT_X + PANEL_W, 30);
  ctx.textAlign = 'left';

  // Panels.
  drawPanelFrame(ctx, LEFT_X, '◀  LEFT — the original', '#4ecdc4');
  drawPanelFrame(ctx, RIGHT_X, 'RIGHT — the changed twin  ▶', '#f2a007');
  ctx.save();
  ctx.beginPath();
  ctx.rect(LEFT_X, PANEL_Y, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(LEFT_X, PANEL_Y);
  drawScene(ctx, scene.id, 0);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(RIGHT_X, PANEL_Y, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(RIGHT_X, PANEL_Y);
  drawScene(ctx, scene.id, 1);
  ctx.restore();

  // Found markers on BOTH panels, so the pair always matches.
  const pulse = 0.5 + 0.5 * Math.sin(now / 180);
  for (const diffId of game.found) {
    const diff = scene.differences.find((d) => d.id === diffId);
    if (!diff) continue;
    const isNew = fx.lastFoundId === diffId && now - fx.lastFoundAt < 600;
    drawFoundMarker(ctx, LEFT_X, PANEL_Y, diff.x, diff.y, isNew ? pulse : 0);
    drawFoundMarker(ctx, RIGHT_X, PANEL_Y, diff.x, diff.y, isNew ? pulse : 0);
  }

  // Hint ring on both panels.
  if (game.hint && now < game.hint.until) {
    const diff = scene.differences.find((d) => d.id === game.hint.diffId);
    if (diff) {
      drawHintRing(ctx, LEFT_X, PANEL_Y, { ...diff, until: game.hint.until }, now);
      drawHintRing(ctx, RIGHT_X, PANEL_Y, { ...diff, until: game.hint.until }, now);
    }
  }

  // Wrong-click crosses.
  for (const mark of fx.wrongMarks) drawWrongCross(ctx, mark, now);

  // Bottom strip: progress dots + remaining counter + message.
  const dotsY = PANEL_Y + PANEL_H + 34;
  ctx.fillStyle = '#9fb0d8';
  ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'left';
  const remaining = scene.differences.length - game.found.length;
  ctx.fillText(`Differences: ${game.found.length} found · ${remaining} still hiding`, LEFT_X, dotsY + 5);
  for (let i = 0; i < scene.differences.length; i += 1) {
    const dx = 560 + i * 30;
    ctx.fillStyle = i < game.found.length ? '#37c978' : '#3d4a6b';
    ctx.beginPath();
    ctx.arc(dx, dotsY, 9, 0, Math.PI * 2);
    ctx.fill();
    if (i < game.found.length) {
      ctx.strokeStyle = '#0e1424';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(dx - 4, dotsY);
      ctx.lineTo(dx - 1, dotsY + 3);
      ctx.lineTo(dx + 4, dotsY - 3);
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 17px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(remaining === 0 ? 'All found!' : `${remaining} TO FIND`, RIGHT_X + PANEL_W, dotsY + 5);
  ctx.textAlign = 'left';

  // Transient message banner.
  if (game.message && now < game.messageUntil) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, (game.messageUntil - now) / 400);
    ctx.fillStyle = 'rgba(14,20,36,0.88)';
    const mw = ctx.measureText(game.message).width + 36;
    roundRectPath(ctx, (CANVAS_W - mw) / 2, CANVAS_H - 46, mw, 32, 16);
    ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(game.message, CANVAS_W / 2, CANVAS_H - 25);
    ctx.restore();
  }

  // (The 24 px gap between the panels is too narrow for text: the panel
  // labels above already say to click a difference on either side.)
}
