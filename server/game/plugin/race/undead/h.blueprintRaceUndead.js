// @format

'use strict';

// What does this module do?
// It attaches blueprint for this race
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.race.undead = {
      unitAmounts: {
        skeleton: 10,
        undeadRogue: 5,
        crazyWizard: 0,
        orc: 0,
        blackKnight: 0
      },
      heroStats: { movement: 9 },
      heroFigure: 'undeadHero',
      spriteOffset: { x: -4, y: -8 },
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
