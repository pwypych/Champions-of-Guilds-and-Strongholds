// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.humanTownHall = {
      fortificationName: 'humanTownHall',
      namePretty: 'Town hall',
      race: 'human',
      cost: {
        gold: 1500,
        crystal: 2,
        wood: 10
      },
      income: {
        name: 'gold',
        amount: 1000
      }
    };

    done();
  });
};
