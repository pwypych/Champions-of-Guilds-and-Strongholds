// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.skeleton = {
      figureName: 'skeleton',
      unitAmounts: { skeleton: 10 }
    };

    done();
  });
};
