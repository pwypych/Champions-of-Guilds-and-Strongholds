// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.mineCrystal = {
      figureName: 'mineCrystal',
      visitableType: 'mine',
      income: {
        name: 'crystal',
        amount: 1
      },
      landRandomizeLevelChances: {
        1: 0,
        2: 1,
        3: 10,
        4: 20,
        5: 5
      },
      landRandomizeConcentrationMax: 0.1
    };

    done();
  });
};
