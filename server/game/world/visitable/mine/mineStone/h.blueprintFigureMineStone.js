// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.mineStone = {
      figureName: 'mineStone',
      visitableType: 'mine',
      income: {
        name: 'stone',
        amount: 2
      },
      landRandomizeLevelChances: {
        1: 0,
        2: 30,
        3: 20,
        4: 5,
        5: 0
      },
      landRandomizeConcentrationMax: 0.2
    };

    done();
  });
};
