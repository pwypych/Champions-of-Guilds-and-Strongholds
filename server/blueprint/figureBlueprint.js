// @format

'use strict';

// What does this module do?
// Returns object with all figures stats

module.exports = () => {
  return {
    // Units figures
    skeleton: {
      unitAmounts: {
        skeleton: 10
      }
    },

    undeadRogue: {
      unitAmounts: {
        undeadRogue: 8
      }
    },

    crazyWizard: {
      unitAmounts: {
        crazyWizard: 6
      }
    },

    orc: {
      unitAmounts: {
        orc: 4
      }
    },

    blackKnight: {
      unitAmounts: {
        blackKnight: 2
      }
    },

    minotaur: {
      unitAmounts: {
        minotaur: 2
      }
    },

    worm: {
      unitAmounts: {
        worm: 4
      }
    },

    plant: {
      unitAmounts: {
        plant: 6
      }
    },

    eyeball: {
      unitAmounts: {
        eyeball: 8
      }
    },

    butterfly: {
      unitAmounts: {
        butterfly: 10
      }
    },

    rogue: {
      unitAmounts: {
        rogue: 10
      }
    },

    warrior: {
      unitAmounts: {
        warrior: 8
      }
    },

    ranger: {
      unitAmounts: {
        ranger: 6
      }
    },

    wizard: {
      unitAmounts: {
        wizard: 4
      }
    },

    cleric: {
      unitAmounts: {
        cleric: 2
      }
    },

    // Resource figures
    crystal: { resource: { name: 'crystal', amount: 3 } },

    gold: { resource: { name: 'gold', amount: 500 } },

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
      spriteOffset: { x: 0, y: -10 },
      collision: true
    }
  };
};
