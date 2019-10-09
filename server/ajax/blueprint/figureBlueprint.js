// @format

'use strict';

// What does this module do?
// Returns object with all figures stats

module.exports = () => {
  return {
    // Units figures
    butterfly: {
      unitAmounts: {
        butterfly: 10
      }
    },

    skeleton: {
      unitAmounts: {
        skeleton: 10
      }
    },

    ranger: {
      unitAmounts: {
        ranger: 10
      }
    },

    plant: {
      unitAmounts: {
        plant: 8
      }
    },

    undeadRogue: {
      unitAmounts: {
        undeadRogue: 8
      }
    },

    rogue: {
      unitAmounts: {
        rogue: 8
      }
    },

    eyeball: {
      unitAmounts: {
        eyeball: 6
      }
    },

    crazyWizard: {
      unitAmounts: {
        crazyWizard: 6
      }
    },

    warrior: {
      unitAmounts: {
        warrior: 6
      }
    },

    worm: {
      unitAmounts: {
        worm: 5
      }
    },

    wizard: {
      unitAmounts: {
        wizard: 5
      }
    },

    orc: {
      unitAmounts: {
        orc: 5
      }
    },

    minotaur: {
      unitAmounts: {
        minotaur: 3
      }
    },

    blackKnight: {
      unitAmounts: {
        blackKnight: 3
      }
    },

    cleric: {
      unitAmounts: {
        cleric: 3
      }
    },

    // Resource figures
    crystal: { resource: { name: 'crystal', amount: 3 } },

    gold: { resource: { name: 'gold', amount: 1000 } },

    wood: { resource: { name: 'wood', amount: 5 } },

    stone: { resource: { name: 'stone', amount: 7 } },

    // Rest of figures
    castleRandom: {
      spriteOffset: { x: -32, y: -64 },
      collision: true
    },

    dirt: { collision: true },

    rock: { collision: true },

    tree: {
      spriteOffset: { x: 0, y: 0 },
      collision: true
    }
  };
};
