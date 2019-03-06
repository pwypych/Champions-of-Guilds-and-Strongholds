// @format

'use strict';

const deepFreeze = require('deep-freeze');

// What does this module do?
// Returns object with all race stats
const raceBlueprint = {
  human: {
    unitAmounts: {
      rogue: 10,
      warrior: 10,
      ranger: 10,
      wizard: 10,
      cleric: 10
    }
  },
  undead: {
    unitAmounts: {
      skeleton: 10,
      undeadRogue: 10,
      crazyWizard: 10,
      orc: 10,
      blackKnight: 10
    }
  },
  beast: {
    unitAmounts: {
      butterfly: 10,
      eyball: 10,
      plant: 10,
      worm: 10,
      minotaur: 10
    }
  }
};

deepFreeze(raceBlueprint);
module.exports = raceBlueprint;
