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
      }
    };

    done();
  });
};
