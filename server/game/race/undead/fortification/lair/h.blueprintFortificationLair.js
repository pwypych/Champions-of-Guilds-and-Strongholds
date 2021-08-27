// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.lair = {
      fortificationName: 'lair',
      namePretty: 'Lair',
      race: 'undead',
      cost: {
        gold: 3500,
        wood: 5,
        stone: 15
      }
    };

    done();
  });
};
