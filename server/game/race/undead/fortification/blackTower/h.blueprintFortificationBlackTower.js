// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.blackTower = {
      fortificationName: 'blackTower',
      namePretty: 'Black tower',
      race: 'undead',
      cost: {
        gold: 2000,
        wood: 3,
        stone: 5
      }
    };

    done();
  });
};
