// @format

'use strict';

const debug = require('debug')('cogs:createBattle');
const _ = require('lodash');
const shortId = require('shortid');

// What does this module do?
// Checks if battle with battleStatus "pending" exists. Spawns units and obsticles. Changes battleStatus to "active".
module.exports = (db, unitStats) => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;

      debug('init');
      checkIfPendingBattleExists(entities);
    })();

    function checkIfPendingBattleExists(entities) {
      let battleId;

      _.forEach(entities, (entity, id) => {
        if (entity.battleStatus === 'pending') {
          battleId = id;
        }
      });

      if (!battleId) {
        debug('checkIfPendingBattleExists: No battle is pending!');
        next();
        return;
      }

      debug('checkIfPendingBattleExists: battleId:', battleId);
      generateUnits(entities, battleId);
    }

    function generateUnits(entities, battleId) {
      const battle = entities[battleId];
      const attackerId = battle.attackerId;
      const defenderId = battle.defenderId;

      const attackerUnits = entities[attackerId].units;
      const defenderUnits = entities[defenderId].units;

      debug('generateUnits:attackerUnits:', attackerUnits);
      debug('generateUnits:defenderUnits:', defenderUnits);

      // prepare attackerUnits
      // prepare defenderUnits

      // bear_unit__xxx3023: {
      //   unit: 'bear',
      //   owner: 'hero_xceetnrs',
      //   unitStats: {
      //     movment...
      //   }
      // }

      next();
    }

    // changeStatusToActive
  };
};
