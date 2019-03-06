// @format

'use strict';

const deepFreeze = require('deep-freeze');

// What does this module do?
// Returns object with all figures stats
const figureBlueprint = {
  alchemist: {
    unitAmounts: {
      alchemist: 5
    }
  },
  archer: {
    unitAmounts: {
      archer: 5
    }
  },
  bear: {
    unitAmounts: {
      bear: 5
    }
  },
  castleRandom: {
    spriteOffset: { x: -32, y: -64 },
    collision: true
  },
  crystal: {
    resource: { name: 'crystal', amount: 3 }
  },
  dirt: { collision: true },
  goblin: {
    unitAmounts: {
      goblin: 5
    }
  },
  gold: { resource: { name: 'gold', amount: 1500 } },
  rock: { collision: true },
  rogue: {
    unitAmounts: {
      rogue: 5
    }
  },
  spearbarer: {
    unitAmounts: {
      spearbarer: 5
    }
  },
  stone: { resource: { name: 'stone', amount: 7 } },
  tree: {
    spriteOffset: { x: 0, y: -10 },
    collision: true
  },
  wood: { resource: { name: 'wood', amount: 5 } }
};

deepFreeze(figureBlueprint);
module.exports = figureBlueprint;
