// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.stone = {
      figureName: 'stone',
      resource: { name: 'stone', amount: 5 },
      landRandomizeLevelChances: {
        1: 10,
        2: 40,
        3: 20,
        4: 15,
        5: 5
      },
      landRandomizeConcentrationMax: 0.5
    };

    done();
  });
};
