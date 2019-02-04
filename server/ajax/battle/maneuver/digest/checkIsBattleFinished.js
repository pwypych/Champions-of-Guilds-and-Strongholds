// @format

'use strict';

const debug = require('debug')('cogs:checkIsBattleFinished');
const _ = require('lodash');

// What does this module do?
// Check if all units in battle belong to the same boss.
module.exports = (findEntitiesByGameId) => {
  return (gameId, unitId, callback) => {
    (function init() {
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId: entities._id:', entities._id);
        checkIsOnlyOneTypeOfBossInBattle(entities);
      });
    }

    function checkIsOnlyOneTypeOfBossInBattle(entities) {
      const bossNameInBattleArray = [];

      _.forEach(entities, (entity) => {
        if (entity.unitStats && entity.boss) {
          if (!_.includes(bossNameInBattleArray, entity.boss)) {
            bossNameInBattleArray.push(entity.boss);
          }
        }
      });

      debug(
        'checkIsOnlyOneTypeOfBossInBattle: bossNameInBattleArray.length:',
        bossNameInBattleArray.length
      );

      if (bossNameInBattleArray.length < 2) {
        callback(true);
        return;
      }

      callback(false);
    }
  };
};
