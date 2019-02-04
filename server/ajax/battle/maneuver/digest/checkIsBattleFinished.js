// @format

'use strict';

const debug = require('debug')('cogs:checkIsBattleFinished');
const _ = require('lodash');

// What does this module do?
// Check are units on battle belong to different boss.
module.exports = (findEntitiesByGameId) => {
  return (gameId, unitId, callback) => {
    (function init() {
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId: entities._id:', entities._id);
        findWhoIsUnitBoss(entities);
      });
    }

    function findWhoIsUnitBoss(entities) {
      const unit = entities[unitId];
      const unitBoss = unit.boss;

      checkAreUnitsInBattleBelongToDifferentBoss(entities, unitBoss);
    }

    function checkAreUnitsInBattleBelongToDifferentBoss(entities, unitBoss) {
      let allUnitsBelongToOneBoss = true;

      _.forEach(entities, (entity) => {
        if (entity.boss !== unitBoss) {
          allUnitsBelongToOneBoss = false;
        }
      });

      callback(allUnitsBelongToOneBoss);
    }
  };
};
