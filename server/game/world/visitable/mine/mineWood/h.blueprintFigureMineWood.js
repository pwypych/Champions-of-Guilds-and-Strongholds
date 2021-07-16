// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.mineWood = {
      figureName: 'mineWood',
      visitableType: 'mine',
      income: {
        name: 'wood',
        amount: 2
      },
      landRandomizeLevelChances: {
        1: 30,
        2: 10,
        3: 5,
        4: 1,
        5: 0
      },
      landRandomizeConcentrationMax: 0.3
    };

    done();
  });
};
