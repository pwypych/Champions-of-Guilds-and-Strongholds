// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.blackCastle = {
      fortificationName: 'blackCastle',
      namePretty: 'Black castle',
      race: 'undead',
      cost: {
        gold: 6000,
        wood: 10,
        stone: 15,
        crystal: 2
      }
    };

    done();
  });
};
