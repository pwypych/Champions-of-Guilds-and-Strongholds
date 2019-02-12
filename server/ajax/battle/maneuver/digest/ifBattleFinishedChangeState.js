// @format

'use strict';

const debug = require('debug')('cogs:ifBattleFinishedChangeState');
const _ = require('lodash');

// What does this module do?
// Check if all units in battle belong to the same boss. If true changes game state to summaryState.
module.exports = (findEntitiesByGameId, db) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug(
        '// Check if all units in battle belong to the same boss. If true changes game state to summaryState'
      );
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
        checkEveryUnitInBattleHasSameBoss(entities);
      });
    }

    function checkEveryUnitInBattleHasSameBoss(entities) {
      const bossNameInBattleArray = [];

      _.forEach(entities, (entity) => {
        if (entity.unitStats && entity.boss) {
          if (!_.includes(bossNameInBattleArray, entity.boss)) {
            bossNameInBattleArray.push(entity.boss);
          }
        }
      });

      if (bossNameInBattleArray.length > 1) {
        debug('checkEveryUnitInBattleHasSameBoss: No!');
        callback(false);
        return;
      }

      debug(
        'checkEveryUnitInBattleHasSameBoss: Yes, only units of one boss!:',
        bossNameInBattleArray
      );
      waitBeforeUpdateState();
    }

    function waitBeforeUpdateState() {
      setTimeout(() => {
        debug('waitBeforeUpdateState: Wait 2000Ms!');
        updateGameState();
      }, 2000);
    }

    function updateGameState() {
      const query = { _id: gameId };
      const field = gameId + '.state';
      const $set = {};
      $set[field] = 'summaryState';
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateGameState: error: ', error);
          debug('updateGameState: summaryState');
          callback(true);
        }
      );
    }
  };
};
