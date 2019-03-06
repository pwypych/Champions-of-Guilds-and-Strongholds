// @format

'use strict';

const deepFreeze = require('deep-freeze');

// What does this module do?
// Returns object with all unit stats
const unitStats = {
  // Tier 1
  goblin: {
    tier: 1,
    damageMin: 2,
    damageMax: 2,
    life: 5,
    initiative: 35,
    movement: 5,
    maneuver: 2,
    recruitCost: 50
  },

  spearbarer: {
    tier: 1,
    damageMin: 3,
    damageMax: 3,
    life: 7,
    initiative: 42,
    movement: 3,
    maneuver: 2,
    recruitCost: 60
  },

  butterfly: {
    tier: 1,
    damageMin: 1,
    damageMax: 1,
    life: 4,
    initiative: 75,
    movement: 8,
    maneuver: 2,
    recruitCost: 40
  },

  skeleton: {
    tier: 1,
    damageMin: 2,
    damageMax: 2,
    life: 6,
    initiative: 25,
    movement: 4,
    maneuver: 2,
    recruitCost: 60
  },

  rogue: {
    tier: 1,
    damageMin: 3,
    damageMax: 3,
    life: 5,
    initiative: 50,
    movement: 4,
    maneuver: 2,
    recruitCost: 80
  },

  // Tier 2
  archer: {
    tier: 2,
    damageMin: 4,
    damageMax: 4,
    life: 15,
    initiative: 60,
    movement: 5,
    maneuver: 2,
    recruitCost: 110
  },

  eyball: {
    tier: 2,
    damageMin: 5,
    damageMax: 5,
    life: 10,
    initiative: 35,
    movement: 6,
    maneuver: 2,
    recruitCost: 120
  },

  undeadRogue: {
    tier: 2,
    damageMin: 4,
    damageMax: 4,
    life: 13,
    initiative: 35,
    movement: 4,
    maneuver: 2,
    recruitCost: 110
  },

  warrior: {
    tier: 2,
    damageMin: 2,
    damageMax: 2,
    life: 17,
    initiative: 40,
    movement: 4,
    maneuver: 2,
    recruitCost: 130
  },

  // Tier 3
  alchemist: {
    tier: 3,
    damageMin: 6,
    damageMax: 6,
    life: 15,
    initiative: 55,
    movement: 4,
    maneuver: 2,
    recruitCost: 250
  },

  bear: {
    tier: 3,
    damageMin: 3,
    damageMax: 3,
    life: 30,
    initiative: 35,
    movement: 3,
    maneuver: 2,
    recruitCost: 150
  },

  plant: {
    tier: 3,
    damageMin: 5,
    damageMax: 5,
    life: 22,
    initiative: 40,
    movement: 4,
    maneuver: 2,
    recruitCost: 200
  },

  crazyWizard: {
    tier: 3,
    damageMin: 6,
    damageMax: 6,
    life: 17,
    initiative: 45,
    movement: 5,
    maneuver: 2,
    recruitCost: 240
  },

  ranger: {
    tier: 3,
    damageMin: 4,
    damageMax: 4,
    life: 20,
    initiative: 55,
    movement: 5,
    maneuver: 2,
    recruitCost: 200
  },

  // Tier 4
  worm: {
    tier: 4,
    damageMin: 8,
    damageMax: 8,
    life: 30,
    initiative: 60,
    movement: 6,
    maneuver: 2,
    recruitCost: 320
  },

  wizard: {
    tier: 4,
    damageMin: 8,
    damageMax: 8,
    life: 20,
    initiative: 30,
    movement: 6,
    maneuver: 2,
    recruitCost: 300
  },

  orc: {
    tier: 4,
    damageMin: 7,
    damageMax: 7,
    life: 35,
    initiative: 45,
    movement: 6,
    maneuver: 2,
    recruitCost: 350
  },

  // Tier 5
  minotaur: {
    tier: 5,
    damageMin: 10,
    damageMax: 10,
    life: 60,
    initiative: 50,
    movement: 5,
    maneuver: 2,
    recruitCost: 600
  },

  blackKnight: {
    tier: 5,
    damageMin: 15,
    damageMax: 15,
    life: 45,
    initiative: 55,
    movement: 5,
    maneuver: 2,
    recruitCost: 550
  },

  cleric: {
    tier: 5,
    damageMin: 13,
    damageMax: 13,
    life: 55,
    initiative: 70,
    movement: 6,
    maneuver: 2,
    recruitCost: 500
  }
};

deepFreeze(unitStats);
module.exports = unitStats;
