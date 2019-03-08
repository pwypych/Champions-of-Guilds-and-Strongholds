// @format

'use strict';

// What does this module do?
// Returns object with all race stats

module.exports = () => {
  return {
    human: {
      unitAmounts: {
        rogue: 20,
        warrior: 10,
        ranger: 0,
        wizard: 0,
        cleric: 0
      },
      heroStats: { movement: 15 },
      playerResources: {
        wood: 10,
        stone: 5,
        crystal: 1,
        gold: 1500
      }
    },

    undead: {
      unitAmounts: {
        skeleton: 25,
        undeadRogue: 7,
        crazyWizard: 0,
        orc: 0,
        blackKnight: 0
      },
      heroStats: { movement: 15 },
      playerResources: {
        wood: 5,
        stone: 5,
        crystal: 3,
        gold: 1000
      }
    },

    beast: {
      unitAmounts: {
        butterfly: 30,
        eyeball: 10,
        plant: 0,
        worm: 0,
        minotaur: 0
      },
      heroStats: { movement: 15 },
      playerResources: {
        wood: 15,
        stone: 5,
        crystal: 5,
        gold: 500
      }
    }
  };
};
