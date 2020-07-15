// @format

'use strict';

// What does this module do?
// Returns object with fortifications

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
        stone: 20
      }
    },

    beastCapitol: {
      namePretty: 'Town hall',
      race: 'beast',
      buildingCost: {
        gold: 2000,
        crystal: 3,
        stone: 8
      },
      generatesDaily: {
        gold: 1000
      }
    },

    beastBarracks: {
      namePretty: 'Maze',
      race: 'beast',
      buildingCost: {
        gold: 2500,
        crystal: 2
      }
    },

    undeadCapitol: {
      namePretty: 'Town hall',
      race: 'undead',
      buildingCost: {
        gold: 3000,
        wood: 10,
        stone: 12
      },
      generatesDaily: {
        gold: 1000
      }
    },

    undeadBarracks: {
      namePretty: 'Graveyard',
      race: 'undead',
      buildingCost: {
        gold: 3000,
        wood: 8,
        stone: 5
      }
    }
  };
};
