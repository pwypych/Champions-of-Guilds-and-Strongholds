// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.gold = {
      figureName: 'gold',
      resource: { name: 'gold', amount: 1000 },
      landRandomizeLevelChances: {
        1: 20,
        2: 20,
        3: 20,
        4: 20,
        5: 20
      },
      landRandomizeConcentrationMax: 0.8
    };

    done();
  });
};
