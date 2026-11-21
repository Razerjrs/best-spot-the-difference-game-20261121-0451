// scenes.js — one clear job: draw each scene's artwork, twice.
// Every scene draws into the same 608x560 panel space. variant 0 is the original
// (left panel), variant 1 is the changed twin (right panel): each of the seven
// differences is applied only when variant === 1, so the two pictures are
// near-identical and every change is a deliberate, fair difference.

import { PANEL_W, PANEL_H } from './differences.js';

// The street's dashed centre line runs the full width of a panel.
const PANEL_RIGHT_EDGE = PANEL_W;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function cloud(ctx, x, y, s, colour) {
  ctx.fillStyle = colour;
  ellipse(ctx, x, y, 34 * s, 18 * s);
  ellipse(ctx, x - 26 * s, y + 6 * s, 22 * s, 13 * s);
  ellipse(ctx, x + 28 * s, y + 6 * s, 24 * s, 14 * s);
}

function star(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const ang = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(ang) * rad;
    const py = y + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function starfish(ctx, x, y, s, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const ang = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? 20 * s : 8 * s;
    const px = x + Math.cos(ang) * rad;
    const py = y + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  circle(ctx, x - 5, y - 3, 1.6);
  circle(ctx, x + 5, y - 3, 1.6);
}

// ---------------------------------------------------------------- beach cove
function drawBeach(ctx, v) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#7ec8f2');
  sky.addColorStop(1, '#cdeefb');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 300);
  // Sun (diff 1: sunglasses on the right)
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 92, 82, 34);
  ctx.strokeStyle = 'rgba(255,180,0,0.7)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(92 + Math.cos(a) * 42, 82 + Math.sin(a) * 42);
    ctx.lineTo(92 + Math.cos(a) * 54, 82 + Math.sin(a) * 54);
    ctx.stroke();
  }
  ctx.fillStyle = '#26304a';
  circle(ctx, 84, 78, 2.5);
  circle(ctx, 100, 78, 2.5);
  ctx.strokeStyle = '#26304a';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(92, 86, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  if (v === 1) {
    ctx.fillStyle = '#1c2333';
    roundRect(ctx, 72, 72, 16, 11, 4); ctx.fill();
    roundRect(ctx, 96, 72, 16, 11, 4); ctx.fill();
    ctx.fillRect(88, 76, 8, 3);
    ctx.strokeStyle = '#1c2333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(72, 76); ctx.lineTo(64, 70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(112, 76); ctx.lineTo(120, 70); ctx.stroke();
  }
  // Clouds (diff 2: middle cloud gone on the right)
  cloud(ctx, 180, 60, 1, 'rgba(255,255,255,0.95)');
  if (v === 0) cloud(ctx, 305, 66, 0.85, 'rgba(255,255,255,0.95)');
  cloud(ctx, 470, 48, 1.1, 'rgba(255,255,255,0.9)');
  // Seagulls
  ctx.strokeStyle = '#33415e'; ctx.lineWidth = 2.5;
  for (const [gx, gy] of [[250, 110], [400, 100], [540, 130]]) {
    ctx.beginPath(); ctx.arc(gx - 8, gy, 8, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(gx + 8, gy, 8, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  }
  // Sea
  const sea = ctx.createLinearGradient(0, 210, 0, 330);
  sea.addColorStop(0, '#2a9db5');
  sea.addColorStop(1, '#1d7f9e');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 210, PANEL_W, 120);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  for (const [wx, wy, wl] of [[60, 250, 70], [300, 235, 90], [480, 265, 80], [180, 300, 90], [420, 310, 70]]) {
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + wl / 2, wy - 8, wx + wl, wy);
    ctx.stroke();
  }
  // Boat (diff 3: sail red on the left, teal on the right)
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath(); ctx.moveTo(440, 205); ctx.lineTo(505, 205); ctx.lineTo(490, 222); ctx.lineTo(452, 222); ctx.closePath(); ctx.fill();
  ctx.fillStyle = v === 0 ? '#e4572e' : '#17a398';
  ctx.beginPath(); ctx.moveTo(472, 205); ctx.lineTo(472, 148); ctx.lineTo(500, 205); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath(); ctx.moveTo(468, 205); ctx.lineTo(468, 158); ctx.lineTo(444, 205); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5b3413'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(472, 148); ctx.lineTo(472, 205); ctx.stroke();
  // Distant island
  ctx.fillStyle = '#3f9e6b';
  ctx.beginPath(); ctx.moveTo(40, 212); ctx.quadraticCurveTo(90, 178, 140, 212); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2f7d4f';
  ctx.beginPath(); ctx.moveTo(88, 196); ctx.lineTo(96, 176); ctx.lineTo(104, 196); ctx.closePath(); ctx.fill();
  // Sand
  const sand = ctx.createLinearGradient(0, 330, 0, PANEL_H);
  sand.addColorStop(0, '#f6d998');
  sand.addColorStop(1, '#eec27a');
  ctx.fillStyle = sand;
  ctx.fillRect(0, 330, PANEL_W, PANEL_H - 330);
  ctx.fillStyle = 'rgba(190,150,80,0.5)';
  for (const [sx, sy] of [[40, 360], [300, 350], [560, 380], [90, 520], [420, 530], [250, 540]]) {
    ellipse(ctx, sx, sy, 14, 4);
  }
  // Umbrella (diff 6: one stripe orange on the left, purple on the right)
  ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(148, 300); ctx.lineTo(148, 400); ctx.stroke();
  const stripes = ['#e4572e', '#fdf6e3', v === 0 ? '#f2a007' : '#7b5ea7', '#fdf6e3', '#e4572e'];
  for (let i = 0; i < 5; i += 1) {
    ctx.fillStyle = stripes[i];
    ctx.beginPath();
    ctx.moveTo(148, 252);
    ctx.lineTo(68 + i * 32, 300);
    ctx.lineTo(68 + (i + 1) * 32, 300);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#e4572e';
  circle(ctx, 148, 250, 7);
  // Towel
  ctx.fillStyle = '#4ecdc4';
  roundRect(ctx, 210, 470, 120, 42, 8); ctx.fill();
  ctx.fillStyle = '#ff6b6b';
  ctx.fillRect(228, 470, 12, 42); ctx.fillRect(268, 470, 12, 42); ctx.fillRect(308, 470, 12, 42);
  // Bucket and spade
  ctx.fillStyle = '#e4572e';
  ctx.beginPath(); ctx.moveTo(56, 440); ctx.lineTo(96, 440); ctx.lineTo(90, 478); ctx.lineTo(62, 478); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f2a007';
  ctx.fillRect(52, 436, 48, 8);
  ctx.strokeStyle = '#f2a007'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(110, 452); ctx.lineTo(132, 424); ctx.stroke();
  ctx.fillStyle = '#4ecdc4';
  ctx.beginPath(); ctx.moveTo(132, 424); ctx.lineTo(146, 414); ctx.lineTo(140, 432); ctx.closePath(); ctx.fill();
  // Crab (diff 4: two claws on the left, one claw on the right)
  ctx.fillStyle = '#e4572e';
  ellipse(ctx, 196, 424, 26, 18);
  ctx.fillStyle = '#c7431f';
  circle(ctx, 184, 404, 6); circle(ctx, 208, 404, 6);
  ctx.fillStyle = '#fff';
  circle(ctx, 184, 404, 3); circle(ctx, 208, 404, 3);
  ctx.fillStyle = '#26304a';
  circle(ctx, 184, 404, 1.5); circle(ctx, 208, 404, 1.5);
  ctx.strokeStyle = '#e4572e'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(172, 424); ctx.lineTo(152, 436); ctx.stroke();
  ctx.fillStyle = '#e4572e';
  ctx.beginPath(); ctx.arc(150, 440, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f6d998';
  ctx.beginPath(); ctx.moveTo(144, 434); ctx.lineTo(156, 434); ctx.lineTo(150, 444); ctx.closePath(); ctx.fill();
  if (v === 0) {
    ctx.strokeStyle = '#e4572e'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(220, 424); ctx.lineTo(240, 436); ctx.stroke();
    ctx.fillStyle = '#e4572e';
    ctx.beginPath(); ctx.arc(242, 440, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f6d998';
    ctx.beginPath(); ctx.moveTo(236, 434); ctx.lineTo(248, 434); ctx.lineTo(242, 444); ctx.closePath(); ctx.fill();
  }
  // Beach ball (diff 7: yellow stripe on the left, plain white on the right)
  ctx.fillStyle = '#fdf6e3';
  circle(ctx, 384, 432, 30);
  ctx.save();
  ctx.beginPath(); ctx.arc(384, 432, 30, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = '#e4572e';
  ctx.beginPath(); ctx.moveTo(384, 402); ctx.lineTo(404, 462); ctx.lineTo(384, 462); ctx.lineTo(364, 402); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4ecdc4';
  ctx.beginPath(); ctx.moveTo(384, 402); ctx.lineTo(364, 402); ctx.lineTo(344, 462); ctx.lineTo(364, 462); ctx.closePath(); ctx.fill();
  if (v === 0) {
    ctx.fillStyle = '#f2a007';
    ctx.fillRect(404, 402, 18, 60);
  }
  ctx.restore();
  ctx.strokeStyle = '#26304a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(384, 432, 30, 0, Math.PI * 2); ctx.stroke();
  // Starfish (diff 5: orange on the left, purple on the right)
  starfish(ctx, 522, 468, 1, v === 0 ? '#f2a007' : '#7b5ea7');
  starfish(ctx, 70, 520, 0.7, '#ff8fa3');
  // Palm tree
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath(); ctx.moveTo(556, 560); ctx.quadraticCurveTo(566, 420, 540, 330); ctx.lineTo(556, 326); ctx.quadraticCurveTo(584, 420, 578, 560); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2f7d4f'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (const [fx, fy, tx, ty] of [[548, 330, 500, 300], [548, 330, 600, 296], [548, 330, 520, 270], [548, 330, 580, 268], [548, 330, 548, 262]]) {
    ctx.beginPath(); ctx.moveTo(548, 330); ctx.quadraticCurveTo((fx + tx) / 2, (fy + ty) / 2 - 14, tx, ty); ctx.stroke();
  }
  ctx.fillStyle = '#7a4a21';
  circle(ctx, 540, 336, 9); circle(ctx, 560, 342, 8);
  // Shells
  ctx.fillStyle = '#ff8fa3';
  ellipse(ctx, 460, 520, 12, 8);
  ctx.fillStyle = '#fdf6e3';
  ellipse(ctx, 330, 350, 10, 6);
}

// ------------------------------------------------------------- neon night street
function drawStreet(ctx, v) {
  // Night sky
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#0d1230');
  sky.addColorStop(1, '#2b3a6b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 300);
  for (const [sx, sy, sr] of [[40, 40, 2], [120, 90, 1.6], [220, 36, 2.2], [330, 70, 1.6], [430, 30, 2], [580, 110, 1.8], [280, 120, 1.5], [60, 160, 1.6]]) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    circle(ctx, sx, sy, sr);
  }
  // Moon (diff 1: full on the left, crescent on the right)
  ctx.fillStyle = '#f4ead8';
  circle(ctx, 522, 68, 26);
  if (v === 1) {
    ctx.fillStyle = '#1a2145';
    circle(ctx, 534, 62, 22);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  circle(ctx, 514, 60, 5); circle(ctx, 530, 76, 4);
  // Buildings
  const buildings = [
    { x: 0, w: 150, h: 300, c: '#232a4a', top: 190 },
    { x: 160, w: 130, h: 350, c: '#2c355e', top: 140 },
    { x: 300, w: 140, h: 320, c: '#1f2547', top: 170 },
    { x: 450, w: 158, h: 370, c: '#2a3054', top: 120 },
  ];
  for (const b of buildings) {
    ctx.fillStyle = b.c;
    ctx.fillRect(b.x, b.top, b.w, PANEL_H - b.top);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(b.x, b.top, b.w, 4);
  }
  // Windows: rows of lit windows (diff 3: one window dark on the right)
  ctx.fillStyle = '#ffd94d';
  for (const b of buildings) {
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const wx = b.x + 18 + col * 42;
        const wy = b.top + 24 + row * 62;
        const isDark = v === 1 && b.x === 300 && row === 1 && col === 0;
        ctx.fillStyle = isDark ? '#141a33' : ((row + col) % 3 === 0 ? '#ffd94d' : '#8fd8ff');
        ctx.fillRect(wx, wy, 24, 30);
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(wx, wy, 24, 30);
      }
    }
  }
  // Neon signs (diff 2: RAMEN sign pink on the left, green on the right)
  ctx.save();
  ctx.shadowColor = v === 0 ? '#ff5ea8' : '#39ff88';
  ctx.shadowBlur = 18;
  ctx.fillStyle = v === 0 ? '#ff5ea8' : '#39ff88';
  roundRect(ctx, 66, 128, 106, 42, 8); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#1c0a18';
  ctx.font = 'bold 24px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('RAMEN', 119, 150);
  ctx.save();
  ctx.shadowColor = '#39c5ff'; ctx.shadowBlur = 14;
  ctx.fillStyle = '#39c5ff';
  roundRect(ctx, 318, 96, 96, 34, 8); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#0a1c2c';
  ctx.font = 'bold 19px "Trebuchet MS", sans-serif';
  ctx.fillText('HOTEL', 366, 114);
  ctx.save();
  ctx.shadowColor = '#ffd94d'; ctx.shadowBlur = 12;
  ctx.fillStyle = '#ffd94d';
  roundRect(ctx, 470, 190, 64, 30, 8); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#1c2333';
  ctx.font = 'bold 17px "Trebuchet MS", sans-serif';
  ctx.fillText('24H', 502, 206);
  // Street
  ctx.fillStyle = '#171c30';
  ctx.fillRect(0, 440, PANEL_W, 120);
  ctx.fillStyle = '#2b3350';
  ctx.fillRect(0, 440, PANEL_W, 6);
  ctx.strokeStyle = '#ffd94d'; ctx.lineWidth = 4;
  ctx.setLineDash([26, 22]);
  ctx.beginPath(); ctx.moveTo(0, 500); ctx.lineTo(PANEL_RIGHT_EDGE, 500); ctx.stroke();
  ctx.setLineDash([]);
  // Puddle with a reflected star (diff 7: star present on the left, gone on the right)
  ctx.fillStyle = 'rgba(120,170,255,0.35)';
  ellipse(ctx, 332, 502, 62, 14);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ellipse(ctx, 300, 500, 30, 6);
  if (v === 0) star(ctx, 332, 500, 9, '#fff7c0');
  // Lamppost
  ctx.fillStyle = '#3d4a6b';
  ctx.fillRect(238, 330, 8, 130);
  ctx.fillStyle = '#ffd94d';
  ellipse(ctx, 242, 326, 18, 12);
  ctx.fillStyle = 'rgba(255,217,77,0.25)';
  ellipse(ctx, 242, 340, 42, 30);
  // Vending machine (diff 6: middle drink row orange on the left, blue on the right)
  ctx.fillStyle = '#c0392b';
  roundRect(ctx, 490, 250, 84, 130, 10); ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  roundRect(ctx, 500, 262, 64, 62, 6); ctx.fill();
  ctx.fillStyle = '#e4572e'; ctx.fillRect(504, 266, 12, 24);
  ctx.fillStyle = v === 0 ? '#f2a007' : '#39c5ff'; ctx.fillRect(522, 266, 12, 24);
  ctx.fillStyle = '#37c978'; ctx.fillRect(540, 266, 12, 24);
  ctx.fillStyle = '#7b5ea7'; ctx.fillRect(504, 296, 12, 24);
  ctx.fillStyle = '#e4572e'; ctx.fillRect(522, 296, 12, 24);
  ctx.fillStyle = '#39c5ff'; ctx.fillRect(540, 296, 12, 24);
  ctx.fillStyle = '#1c2333';
  ctx.fillRect(500, 336, 64, 10);
  ctx.fillStyle = '#fdf6e3';
  ctx.font = 'bold 11px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DRINKS', 532, 372);
  // Bicycle (diff 5: front wheel spokes on the left, solid disc on the right)
  ctx.strokeStyle = '#d7dbe3'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(150, 472); ctx.lineTo(196, 472); ctx.lineTo(220, 440); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(196, 472); ctx.lineTo(232, 472); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(220, 440); ctx.lineTo(232, 472); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(220, 440); ctx.lineTo(214, 424); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(214, 424); ctx.lineTo(238, 424); ctx.stroke();
  ctx.fillStyle = '#e4572e';
  circle(ctx, 150, 472, 20);
  circle(ctx, 232, 472, 20);
  if (v === 0) {
    ctx.strokeStyle = '#d7dbe3'; ctx.lineWidth = 2;
    for (let i = 0; i < 6; i += 1) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath(); ctx.moveTo(150, 472);
      ctx.lineTo(150 + Math.cos(a) * 18, 472 + Math.sin(a) * 18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(232, 472);
      ctx.lineTo(232 + Math.cos(a) * 18, 472 + Math.sin(a) * 18); ctx.stroke();
    }
  } else {
    ctx.fillStyle = '#8a93a8';
    circle(ctx, 150, 472, 12);
    circle(ctx, 232, 472, 12);
  }
  ctx.fillStyle = '#1c2333';
  circle(ctx, 150, 472, 4); circle(ctx, 232, 472, 4);
  // Cat on the wall (diff 4: tail up on the left, tail down on the right)
  ctx.fillStyle = '#2b3350';
  ctx.fillRect(400, 400, 130, 40);
  ctx.fillStyle = '#1a1f38';
  ctx.fillRect(400, 400, 130, 6);
  ctx.fillStyle = '#f2a007';
  ellipse(ctx, 452, 408, 34, 16);
  circle(ctx, 482, 398, 13);
  ctx.beginPath(); ctx.moveTo(474, 388); ctx.lineTo(478, 374); ctx.lineTo(484, 386); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(486, 386); ctx.lineTo(492, 374); ctx.lineTo(494, 388); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1c2333';
  circle(ctx, 486, 396, 2); circle(ctx, 492, 396, 2);
  ctx.strokeStyle = '#f2a007'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath();
  if (v === 0) { ctx.moveTo(420, 406); ctx.quadraticCurveTo(404, 396, 410, 378); }
  else { ctx.moveTo(420, 410); ctx.quadraticCurveTo(406, 420, 412, 436); }
  ctx.stroke();
  // Poster on the wall
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(24, 300, 56, 76);
  ctx.fillStyle = '#e4572e';
  ctx.fillRect(24, 300, 56, 18);
  ctx.fillStyle = '#1c2333';
  ctx.font = 'bold 10px "Trebuchet MS", sans-serif';
  ctx.fillText('GIG', 52, 312);
  ctx.fillStyle = '#7b5ea7';
  circle(ctx, 52, 344, 12);
  ctx.fillStyle = '#26304a';
  ctx.fillRect(34, 362, 36, 3); ctx.fillRect(38, 368, 28, 3);
}

// ------------------------------------------------------------- garden greenhouse
function drawGreenhouse(ctx, v) {
  // Glass sky
  const sky = ctx.createLinearGradient(0, 0, 0, 200);
  sky.addColorStop(0, '#a8e0f0');
  sky.addColorStop(1, '#dff5d8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
  // Sunbeams
  ctx.fillStyle = 'rgba(255,244,180,0.35)';
  for (const [bx, bw] of [[80, 60], [300, 90], [480, 60]]) {
    ctx.beginPath();
    ctx.moveTo(bx, 0); ctx.lineTo(bx + bw, 0); ctx.lineTo(bx + bw + 90, PANEL_H); ctx.lineTo(bx + 90, PANEL_H);
    ctx.closePath(); ctx.fill();
  }
  // Roof beams
  ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(PANEL_W, 150); ctx.stroke();
  for (const bx of [100, 250, 400, 540]) {
    ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx, 150); ctx.stroke();
  }
  // Hanging pots (diff 6: middle pot terracotta on the left, teal on the right)
  for (const [hx, pot] of [[140, '#e4572e'], [282, v === 0 ? '#e4572e' : '#17a398'], [430, '#f2a007']]) {
    ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(hx, 0); ctx.lineTo(hx, 62); ctx.stroke();
    ctx.fillStyle = pot;
    ctx.beginPath(); ctx.moveTo(hx - 26, 62); ctx.lineTo(hx + 26, 62); ctx.lineTo(hx + 20, 96); ctx.lineTo(hx - 20, 96); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3f9e6b';
    ellipse(ctx, hx - 14, 58, 16, 10);
    ellipse(ctx, hx + 12, 56, 15, 10);
    ellipse(ctx, hx, 50, 14, 12);
  }
  // Back wall + shelves
  ctx.fillStyle = '#e8d9b0';
  ctx.fillRect(0, 330, PANEL_W, 230);
  ctx.fillStyle = '#c9a86a';
  ctx.fillRect(0, 330, PANEL_W, 10);
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(30, 250, 240, 10);
  ctx.fillRect(330, 250, 240, 10);
  // Pots on shelves
  const shelfPots = [
    [60, 226, '#e4572e'], [130, 226, '#f2a007'], [200, 226, '#7b5ea7'],
    [360, 226, '#4ecdc4'], [430, 226, '#e4572e'], [510, 226, '#37c978'],
  ];
  for (const [px, py, pc] of shelfPots) {
    ctx.fillStyle = pc;
    ctx.beginPath(); ctx.moveTo(px - 20, py); ctx.lineTo(px + 20, py); ctx.lineTo(px + 15, py + 24); ctx.lineTo(px - 15, py + 24); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3f9e6b';
    ellipse(ctx, px, py - 6, 18, 10);
    ellipse(ctx, px - 10, py - 2, 10, 7);
  }
  // Big monstera leaves, left
  ctx.fillStyle = '#2f7d4f';
  for (const [lx, ly, s] of [[60, 420, 1], [110, 380, 0.8], [40, 480, 0.9]]) {
    ctx.save();
    ctx.translate(lx, ly); ctx.scale(s, s);
    ctx.beginPath();
    ctx.ellipse(0, 0, 46, 70, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = '#1d5c36'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(60, 420); ctx.lineTo(60, 500); ctx.stroke();
  // Flowers (diff 2: big flower red on the left, blue on the right)
  function flower(fx, fy, petal) {
    ctx.fillStyle = petal;
    for (let i = 0; i < 6; i += 1) {
      const a = (i * Math.PI) / 3;
      ellipse(ctx, fx + Math.cos(a) * 14, fy + Math.sin(a) * 14, 11, 8);
    }
    ctx.fillStyle = '#ffd94d';
    circle(ctx, fx, fy, 8);
  }
  flower(424, 218, v === 0 ? '#e4572e' : '#39c5ff');
  flower(360, 300, '#ff8fa3');
  flower(480, 300, '#f2a007');
  ctx.strokeStyle = '#2f7d4f'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(424, 232); ctx.lineTo(424, 330); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(360, 314); ctx.lineTo(360, 330); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(480, 314); ctx.lineTo(480, 330); ctx.stroke();
  // Butterfly (diff 1: wings orange on the left, purple on the right)
  const wing = v === 0 ? '#f2a007' : '#7b5ea7';
  ctx.fillStyle = wing;
  ellipse(ctx, 140, 140, 18, 24);
  ellipse(ctx, 164, 140, 18, 24);
  ellipse(ctx, 144, 164, 12, 14);
  ellipse(ctx, 160, 164, 12, 14);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  circle(ctx, 138, 136, 4); circle(ctx, 166, 136, 4);
  ctx.fillStyle = '#26304a';
  ellipse(ctx, 152, 150, 4, 14);
  ctx.strokeStyle = '#26304a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(150, 138); ctx.quadraticCurveTo(142, 126, 138, 122); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(154, 138); ctx.quadraticCurveTo(162, 126, 166, 122); ctx.stroke();
  // Bee (diff 7: present on the left, gone on the right)
  if (v === 0) {
    ctx.fillStyle = '#ffd94d';
    ellipse(ctx, 482, 178, 13, 9);
    ctx.fillStyle = '#26304a';
    ctx.fillRect(478, 170, 3, 16); ctx.fillRect(486, 170, 3, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ellipse(ctx, 476, 166, 7, 4);
    ellipse(ctx, 488, 166, 7, 4);
  }
  // Watering can (diff 5: long spout on the left, short stub on the right)
  ctx.fillStyle = '#37c978';
  roundRect(ctx, 84, 350, 76, 52, 10); ctx.fill();
  ctx.fillStyle = '#2aa85c';
  ctx.fillRect(84, 350, 76, 10);
  ctx.strokeStyle = '#37c978'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(84, 368);
  if (v === 0) ctx.lineTo(48, 340);
  else ctx.lineTo(66, 356);
  ctx.stroke();
  ctx.fillStyle = '#2aa85c';
  circle(ctx, v === 0 ? 46 : 64, v === 0 ? 338 : 354, 7);
  ctx.strokeStyle = '#37c978'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(160, 362); ctx.quadraticCurveTo(178, 362, 178, 344); ctx.stroke();
  // Frog on a lily pad (diff 4: eyes open on the left, closed on the right)
  ctx.fillStyle = '#3f9e6b';
  ellipse(ctx, 302, 452, 52, 12);
  ctx.fillStyle = '#37c978';
  ellipse(ctx, 302, 428, 30, 22);
  circle(ctx, 284, 408, 10); circle(ctx, 320, 408, 10);
  if (v === 0) {
    ctx.fillStyle = '#fff';
    circle(ctx, 284, 408, 6); circle(ctx, 320, 408, 6);
    ctx.fillStyle = '#26304a';
    circle(ctx, 284, 408, 3); circle(ctx, 320, 408, 3);
  } else {
    ctx.strokeStyle = '#26304a'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(278, 408); ctx.lineTo(290, 408); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(314, 408); ctx.lineTo(326, 408); ctx.stroke();
  }
  ctx.strokeStyle = '#1d5c36'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(302, 432, 10, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  // Mushrooms (diff 3: three spots on the left, one spot on the right)
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(492, 452, 8, 22);
  ctx.fillRect(516, 458, 7, 16);
  ctx.fillStyle = '#e4572e';
  ctx.beginPath(); ctx.arc(496, 452, 16, Math.PI, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(519, 458, 12, Math.PI, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff';
  circle(ctx, 490, 444, 3); circle(ctx, 500, 440, 2.5); circle(ctx, 496, 450, 2);
  if (v === 0) {
    circle(ctx, 516, 452, 2.5); circle(ctx, 522, 448, 2); circle(ctx, 512, 456, 2);
  }
  // Snail on the floor
  ctx.fillStyle = '#f2a007';
  ctx.beginPath(); ctx.arc(200, 520, 16, Math.PI, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e4572e';
  ctx.beginPath(); ctx.arc(200, 520, 9, Math.PI, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#26304a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(212, 520); ctx.lineTo(224, 512); ctx.stroke();
  // Floor
  ctx.fillStyle = 'rgba(122,90,58,0.25)';
  ctx.fillRect(0, 540, PANEL_W, 20);
}

/** Draw one scene into the current transform. `variant` 0 = left, 1 = right. */
export function drawScene(ctx, sceneId, variant) {
  ctx.save();
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  if (sceneId === 'beach') drawBeach(ctx, variant);
  else if (sceneId === 'street') drawStreet(ctx, variant);
  else drawGreenhouse(ctx, variant);
  ctx.restore();
}
