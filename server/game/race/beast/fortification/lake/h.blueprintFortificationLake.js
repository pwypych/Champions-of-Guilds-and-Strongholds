// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.lake = {
      fortificationName: 'lake',
      namePretty: 'Lake',
      race: 'beast',
      cost: {
        gold: 2500,
        crystal: 4,
        stone: 1
      }
    };

    done();
  });
};
