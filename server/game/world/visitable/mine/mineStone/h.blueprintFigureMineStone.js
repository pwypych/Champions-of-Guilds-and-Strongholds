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
      }
    };

    done();
  });
};
