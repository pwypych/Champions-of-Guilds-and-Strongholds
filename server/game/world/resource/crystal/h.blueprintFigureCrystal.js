// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.crystal = {
      figureName: 'crystal',
      resource: { name: 'crystal', amount: 3 },
      landRandomizeLevelChances: {
        1: 0,
        2: 0,
        3: 10,
        4: 20,
        5: 30
      },
      landRandomizeConcentrationMax: 0.4
    };

    done();
  });
};
