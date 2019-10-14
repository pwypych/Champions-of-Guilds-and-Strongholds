// @format

'use strict';

// What does this module do?
// Returns object with buildings

module.exports = () => {
  return {
    humanCapitol: {
      namePretty: 'Town hall',
      race: 'human',
      buildingCost: {
        gold: 2500,
        crystal: 2,
        wood: 10
      },
      generatesDaily: {
        gold: 1000
      }
    },

    humanBarracks: {
      namePretty: 'Barracks',
      race: 'human',
      buildingCost: {
        gold: 1000,
        wood: 10,
        ore: 20
      }
    },

    beastCapitol: {
      namePretty: '',
      race: 'beast',
      buildingCost: {
        gold: 2000,
        crystal: 3,
        ore: 8
      },
      generatesDaily: {
        gold: 1000
      }
    },

    undeadCapitol: {
      namePretty: '',
      race: 'undead',
      buildingCost: {
        gold: 3000,
        wood: 10,
        ore: 12
      },
      generatesDaily: {
        gold: 1000
      }
    }
  };
};
