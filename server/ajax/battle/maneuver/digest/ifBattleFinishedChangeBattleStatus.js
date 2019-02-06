// @format

'use strict';

const debug = require('debug')('cogs:ifBattleFinishedChangeBattleStatus');
const _ = require('lodash');

// What does this module do?
// Check if all units in battle belong to the same boss.
module.exports = (findEntitiesByGameId, db) => {
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
        findBattleId(entities);
        return;
      }

      callback(false);
    }

    function findBattleId(entities) {
      let battleId;
      _.forEach(entities, (entity, id) => {
        if (entity.battleStatus === 'active') {
          debug('findBattleId: entity.battleStatus', entity.battleStatus);
          debug('findBattleId: id', id);
          battleId = id;
        }
      });

      updateBattlestate(battleId);
    }

    function updateBattlestate(battleId) {
      const query = { _id: gameId };

      const field = battleId + '.battleStatus';
      const $set = {};
      $set[field] = 'finished';

      const update = { $set: $set };
      const options = {};
      debug('findBattleId: update', update);

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateBattlestate: error: ', error);
          debug('updateBattlestate: Success!');
          callback(true);
        }
      );
    }
  };
};
