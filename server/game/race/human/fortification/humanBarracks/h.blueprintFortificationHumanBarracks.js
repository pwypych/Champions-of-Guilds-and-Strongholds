// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.humanBarracks = {
      fortificationName: 'humanBarracks',
      namePretty: 'Barracks',
      race: 'human',
      cost: {
        gold: 1000,
        wood: 10,
        stone: 20
      }
    };

    done();
  });
};
