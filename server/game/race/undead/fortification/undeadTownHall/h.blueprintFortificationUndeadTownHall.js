// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.undeadTownHall = {
      fortificationName: 'undeadTownHall',
      namePretty: 'Town hall',
      race: 'undead',
      cost: {
        gold: 3000,
        wood: 10,
        stone: 12
      },
      income: {
        name: 'gold',
        amount: 1000
      }
    };

    done();
  });
};
