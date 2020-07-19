// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.blackKnight = {
      figureName: 'blackKnight',
      unitAmounts: { blackKnight: 4 }
    };

    done();
  });
};
