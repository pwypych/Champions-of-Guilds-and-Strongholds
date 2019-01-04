// @format

'use strict';

const debug = require('debug')('cogs:createBattle');
const _ = require('lodash');
const shortId = require('shortid');

// What does this module do?
// Checks if battle with battleStatus "pending" exists. Spawns units and obsticles. Changes battleStatus to "active".
module.exports = (db) => {
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
      next();
    }

    // instantiateUnits

    // changeStatusToActive
  };
};
