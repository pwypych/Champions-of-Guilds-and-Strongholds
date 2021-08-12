// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.mound = {
      fortificationName: 'mound',
      namePretty: 'Mound',
      race: 'beast',
      cost: {
        gold: 3500,
        crystal: 4,
        stone: 1,
        wood: 10
      }
    };

    done();
  });
};
