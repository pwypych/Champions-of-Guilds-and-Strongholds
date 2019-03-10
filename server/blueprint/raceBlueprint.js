// @format

'use strict';

// What does this module do?
// Returns object with all race stats

module.exports = () => {
  return {
    human: {
      unitAmounts: {
        rogue: 10,
        warrior: 5,
        ranger: 0,
        wizard: 0,
        cleric: 0
      },
      heroStats: { movement: 10 },
      heroFigure: 'humanHero',
      playerResources: {
        wood: 0,
        stone: 0,
        crystal: 0,
        gold: 500
      }
    },

    undead: {
      unitAmounts: {
        skeleton: 12,
        undeadRogue: 4,
        crazyWizard: 0,
        orc: 0,
        blackKnight: 0
      },
      heroStats: { movement: 9 },
      heroFigure: 'undeadHero',
      playerResources: {
        wood: 0,
        stone: 0,
        crystal: 0,
        gold: 500
      }
    },

    beast: {
      unitAmounts: {
        butterfly: 15,
        eyeball: 5,
        plant: 0,
        worm: 0,
        minotaur: 0
      },
      heroStats: { movement: 11 },
      heroFigure: 'beastHero',
      playerResources: {
        wood: 0,
        stone: 0,
        crystal: 0,
        gold: 500
      }
    }
  };
};
