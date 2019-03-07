// @format

'use strict';

// What does this module do?
// Returns object with all race stats

module.exports = () => {
  return {
    human: {
      unitAmounts: {
        rogue: 10,
        warrior: 10,
        ranger: 10,
        wizard: 10,
        cleric: 10
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
        skeleton: 10,
        undeadRogue: 10,
        crazyWizard: 10,
        orc: 10,
        blackKnight: 10
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
        butterfly: 10,
        eyball: 10,
        plant: 10,
        worm: 10,
        minotaur: 10
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
