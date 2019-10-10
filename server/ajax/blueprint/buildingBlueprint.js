// @format

'use strict';

// What does this module do?
// Returns object with buildings

module.exports = () => {
  return {
    humanCapitol: {
      buildingCost: {
        gold: 2500,
        crystal: 2,
        wood: 10
      },
      generatesDaily: {
        gold: 1000
      }
    },
    beastCapitol: {
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
