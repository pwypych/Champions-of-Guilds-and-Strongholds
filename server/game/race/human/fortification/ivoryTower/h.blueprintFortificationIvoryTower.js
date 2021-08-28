// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.ivoryTower = {
      fortificationName: 'ivoryTower',
      namePretty: 'Ivory tower',
      race: 'human',
      cost: {
        gold: 4000,
        wood: 10,
        stone: 10
      }
    };

    done();
  });
};
