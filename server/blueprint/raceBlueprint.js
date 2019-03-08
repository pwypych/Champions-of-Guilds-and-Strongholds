// @format

'use strict';

// What does this module do?
// Returns object with all race stats

module.exports = () => {
  return {
    human: {
      unitAmounts: {
        rogue: 25,
        warrior: 15,
        ranger: 10,
        wizard: 10,
        cleric: 5
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
        undeadRogue: 15,
        crazyWizard: 10,
        orc: 10,
        blackKnight: 5
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
        butterfly: 25,
        eyball: 15,
        plant: 10,
        worm: 10,
        minotaur: 5
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
