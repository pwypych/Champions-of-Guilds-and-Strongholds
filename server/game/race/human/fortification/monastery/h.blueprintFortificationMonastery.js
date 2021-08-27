// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.monastery = {
      fortificationName: 'monastery',
      namePretty: 'Monastery',
      race: 'human',
      cost: {
        gold: 5000,
        wood: 10,
        stone: 10,
        crystal: 5
      }
    };

    done();
  });
};
