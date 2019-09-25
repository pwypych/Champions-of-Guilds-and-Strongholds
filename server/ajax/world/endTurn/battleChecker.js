// @format

'use strict';

const debug = require('debug')('cogs:battleChecker');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Middleware, change game state to battleState if there are battle entities'
      );

      const gameId = res.locals.entities._id;
      const entities = res.locals.entities;

      checkBattleExists(gameId, entities);
    })();

    function checkBattleExists(gameId, entities) {
      debug('checkBattleExists');
      let isBattleEntity = false;
      _.forEach(entities, (entitiy) => {
        if (entitiy.battleStatus) {
          debug('checkBattleExists: attackerId:', entitiy.attackerId);
          isBattleEntity = true;
        }
      });

      if (isBattleEntity) {
        updateGameState(gameId);
        return;
      }

      debug('checkBattleExists: No battle entities found!');
      next();
    }

    function updateGameState(gameId) {
      const query = { _id: gameId };
      const field = gameId + '.state';
      const $set = {};
      $set[field] = 'battleState';
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameState: error: ', error);
          }

          debug('updateGameState: battleState');
          next();
        }
      );
    }
  };
};
