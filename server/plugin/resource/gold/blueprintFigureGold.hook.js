// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.figure.gold = {
      figureName: 'gold',
      resource: { name: 'gold', amount: 1000 }
    };

    done();
  });
};
