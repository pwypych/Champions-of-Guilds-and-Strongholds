// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.beastTownHall = {
      fortificationName: 'beastTownHall',
      namePretty: 'Town hall',
      race: 'beast',
      buildingCost: {
        gold: 2000,
        crystal: 3,
        stone: 8
      },
      income: {
        name: 'gold',
        amount: 1000
      }
    };

    done();
  });
};
