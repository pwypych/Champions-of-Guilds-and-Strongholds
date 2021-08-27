// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.brotherhood = {
      fortificationName: 'brotherhood',
      namePretty: 'Brotherhood',
      race: 'undead',
      cost: {
        gold: 2000,
        wood: 5
      }
    };

    done();
  });
};
