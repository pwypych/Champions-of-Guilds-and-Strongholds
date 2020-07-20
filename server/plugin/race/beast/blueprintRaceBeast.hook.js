// @format

'use strict';

// What does this module do?
// It attaches blueprint for this race
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.race.beast = {
      unitAmounts: {
        butterfly: 10,
        plant: 5,
        eyeball: 0,
        worm: 0,
        minotaur: 0
      },
      heroStats: { movement: 11 },
      heroFigure: 'beastHero',
      spriteOffset: { x: -3, y: -16 },
      playerResources: {
        wood: 0,
        stone: 0,
        crystal: 0,
        gold: 1500
      }
    };

    done();
  });
};
