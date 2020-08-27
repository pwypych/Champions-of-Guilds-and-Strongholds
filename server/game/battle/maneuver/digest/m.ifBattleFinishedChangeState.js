// @format

'use strict';

const debug = require('debug')('cogs:ifBattleFinishedChangeState');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Check if all units in battle belong to the same boss. If true changes game state to summaryState'
      );

      const entities = res.locals.entities;
      debug('init', entities._id);
      const gameId = entities._id;

      checkEveryUnitInBattleHasSameBoss(entities, gameId);
    })();

    function checkEveryUnitInBattleHasSameBoss(entities, gameId) {
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
        next();
        return;
      }

      debug(
        'checkEveryUnitInBattleHasSameBoss: Yes, only units of one boss!:',
        bossNameInBattleArray
      );
      waitBeforeUpdateState(gameId);
    }

    function waitBeforeUpdateState(gameId) {
      setTimeout(() => {
        debug('waitBeforeUpdateState: Wait 2000Ms!');
        updateGameState(gameId);
      }, 2000);
    }

    function updateGameState(gameId) {
      const query = { _id: gameId };
      const field = gameId + '.state';
      const $set = {};
      $set[field] = 'summaryState';
      const update = { $set: $set };
      const options = {};

      debug('updateGameState', query, update);

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameState: error: ', error);
          }
          debug('updateGameState: summaryState');
        }
      );
    }
  };
};
