// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.rogue = {
      figureName: 'rogue',
      unitAmounts: { rogue: 8 }
    };

    done();
  });
};
