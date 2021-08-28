// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.suburbs = {
      fortificationName: 'suburbs',
      namePretty: 'Town suburbs',
      race: 'human',
      cost: {
        gold: 1500,
        stone: 5
      }
    };

    done();
  });
};
