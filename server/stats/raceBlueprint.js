// @format

'use strict';

const deepFreeze = require('deep-freeze');

// What does this module do?
// Returns object with all race stats
const raceBlueprint = {
  human: {},
  undead: {},
  beast: {}
};

deepFreeze(raceBlueprint);
module.exports = raceBlueprint;
