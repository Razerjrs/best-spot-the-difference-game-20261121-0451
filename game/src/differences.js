// differences.js — one clear job: the data for every difference in every scene.
// Coordinates are in panel space: each panel is 608 wide, 560 tall. x/y is the centre
// of the changed detail, r is the click radius in panel pixels, label is the hint text.

export const PANEL_W = 608;
export const PANEL_H = 560;

export const SCENES = [
  {
    id: 'beach',
    name: 'Beach Cove',
    tagline: 'Sun, sea and one sneaky crab',
    timeLimit: 150,
    difficulty: 'Easy · big, friendly changes',
    differences: [
      { id: 'sun-glasses', x: 92, y: 82, r: 36, label: 'The sun is wearing something' },
      { id: 'cloud-gone', x: 305, y: 66, r: 42, label: 'Look at the clouds up high' },
      { id: 'sail-colour', x: 472, y: 178, r: 38, label: 'The little boat out at sea' },
      { id: 'crab-claw', x: 196, y: 424, r: 32, label: 'The crab lost something' },
      { id: 'starfish-colour', x: 522, y: 468, r: 28, label: 'A starfish changed its outfit' },
      { id: 'umbrella-stripe', x: 148, y: 296, r: 42, label: 'The beach umbrella stripes' },
      { id: 'ball-stripe', x: 384, y: 432, r: 32, label: 'The beach ball pattern' },
    ],
  },
  {
    id: 'street',
    name: 'Neon Night Street',
    tagline: 'Rain, neon and a cat on the wall',
    timeLimit: 135,
    difficulty: 'Medium · smaller, sneakier changes',
    differences: [
      { id: 'moon-phase', x: 522, y: 68, r: 32, label: 'The moon looks different tonight' },
      { id: 'ramen-sign', x: 118, y: 148, r: 38, label: 'A neon sign changed colour' },
      { id: 'dark-window', x: 302, y: 198, r: 30, label: 'One window went dark' },
      { id: 'cat-tail', x: 452, y: 418, r: 32, label: 'The cat on the wall' },
      { id: 'bike-wheel', x: 178, y: 472, r: 36, label: 'The bicycle by the kerb' },
      { id: 'vending-row', x: 524, y: 302, r: 32, label: 'The vending machine drinks' },
      { id: 'puddle-star', x: 332, y: 502, r: 32, label: 'Something in the puddle' },
    ],
  },
  {
    id: 'greenhouse',
    name: 'Garden Greenhouse',
    tagline: 'Glass, leaves and a very calm frog',
    timeLimit: 120,
    difficulty: 'Hard · tiny changes hiding in the leaves',
    differences: [
      { id: 'butterfly-wing', x: 152, y: 148, r: 30, label: 'The butterfly wings' },
      { id: 'flower-colour', x: 424, y: 218, r: 28, label: 'One flower changed colour' },
      { id: 'mushroom-spots', x: 502, y: 452, r: 28, label: 'The mushrooms by the pot' },
      { id: 'frog-eyes', x: 302, y: 428, r: 28, label: 'The frog blinked' },
      { id: 'can-spout', x: 118, y: 382, r: 32, label: 'The watering can' },
      { id: 'hanging-pot', x: 282, y: 88, r: 28, label: 'A hanging pot up high' },
      { id: 'bee-gone', x: 482, y: 178, r: 24, label: 'A busy little bee' },
    ],
  },
];

/** Look up a difference by scene id and difference id. */
export function findDifference(sceneId, diffId) {
  const scene = sceneById(sceneId);
  return scene ? scene.differences.find((d) => d.id === diffId) ?? null : null;
}

/** Look up a whole scene by id, or null. */
export function sceneById(sceneId) {
  return SCENES.find((s) => s.id === sceneId) ?? null;
}

/** Total differences across the whole game (21: three scenes of seven). */
export function totalDifferences() {
  return SCENES.reduce((sum, s) => sum + s.differences.length, 0);
}
