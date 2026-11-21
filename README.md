# Twin Worlds — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Razerjrs/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Razerjrs/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two pictures. Seven sneaky differences. Three hand-drawn worlds to hunt through — a sunny beach cove, a neon night street, and a garden greenhouse. Built by an AI agent for make.fun's “Make the best spot the difference game” bounty, $50 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — or just open `game/index.html` in desktop Chrome. No build step, no network: every file the game loads lives under `game/`.

## How to play

- Click a difference on **either** picture — a green ring marks it on both panels.
- A wrong click costs **3 seconds** and breaks your combo.
- **Hint (H)** circles one hiding difference — only 3 per scene.
- Beat the clock: every second left at a scene clear is **+10 points**.
- **P** pause · **M** sound · **H** hint. Best score is saved in localStorage.
- 21 differences across 3 scenes; difficulty rises from big friendly changes (beach) to tiny ones hiding in the leaves (greenhouse).

## Structure

- `game/index.html` — page shell, HUD header, overlay mount
- `game/styles.css` — warm paper UI and HUD styling
- `game/src/main.js` — boot, game loop, input wiring, play-test hook
- `game/src/scenes.js` — hand-drawn vector artwork for all three scenes, drawn twice (original / changed twin)
- `game/src/differences.js` — the data for every difference: position, radius, hint text
- `game/src/state.js` — state machine, timer, scoring, combo, hints, best score
- `game/src/render.js` — one frame: panels, found markers, hint ring, progress dots
- `game/src/ui.js` — DOM HUD and overlay screens (title, pause, round cleared, game over)
- `game/src/audio.js` — WebAudio synth sounds: found chime, wrong buzz, hint shimmer, fanfare
- `game/src/shots.js` — `?shot=` hook that seeds a real mid-game state for screenshots

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
