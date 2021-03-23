// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.beastBarracks = {
      fortificationName: 'beastBarracks',
      namePretty: 'Meadow',
      race: 'beast',
      cost: {
        gold: 2500,
        crystal: 2
      }
    };

    done();
  });
};
