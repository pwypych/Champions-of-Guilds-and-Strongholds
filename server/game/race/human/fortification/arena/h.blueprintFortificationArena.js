// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.arena = {
      fortificationName: 'arena',
      namePretty: 'Arena',
      race: 'human',
      cost: {
        gold: 1500,
        wood: 4,
        stone: 7
      }
    };

    done();
  });
};
