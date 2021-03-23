// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.undeadBarracks = {
      fortificationName: 'undeadBarracks',
      namePretty: 'Cementary',
      race: 'undead',
      cost: {
        gold: 3000,
        wood: 8,
        stone: 5
      }
    };

    done();
  });
};
