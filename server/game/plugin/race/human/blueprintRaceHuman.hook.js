// @format

'use strict';

// What does this module do?
// It attaches blueprint for this race
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.race.human = {
      unitAmounts: {
        ranger: 10,
        rogue: 5,
        warrior: 0,
        wizard: 0,
        cleric: 0
      },
      heroStats: { movement: 10 },
      heroFigure: 'humanHero',
      spriteOffset: { x: -5, y: -8 },
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
