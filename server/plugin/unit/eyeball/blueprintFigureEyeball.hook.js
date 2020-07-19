// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.eyeball = {
      figureName: 'eyeball',
      unitAmounts: { eyeball: 6 }
    };

    done();
  });
};
