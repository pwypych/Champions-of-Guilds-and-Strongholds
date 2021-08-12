// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.garden = {
      fortificationName: 'garden',
      namePretty: 'Garden',
      race: 'beast',
      cost: {
        gold: 1500,
        wood: 5
      }
    };

    done();
  });
};
