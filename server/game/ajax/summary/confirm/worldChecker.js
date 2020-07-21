// @format

'use strict';

const debug = require('debug')('cogs:worldChecker');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Middleware, change game state to worldState if there are no battle entities'
      );

      const gameId = res.locals.entities._id;
      const entities = res.locals.entities;

      checkBattleExists(gameId, entities);
    })();

    function checkBattleExists(gameId, entities) {
      let isBattleEntity = false;
      _.forEach(entities, (entitiy) => {
        if (entitiy.battleStatus) {
          isBattleEntity = true;
        }
      });

      if (isBattleEntity) {
        debug('checkBattleExists: Yes, battle entities found!');
        next();
        return;
      }

      debug('checkBattleExists: No battle entities found!');
      updateGameState(gameId);
    }

    function updateGameState(gameId) {
      const query = { _id: gameId };
      const field = gameId + '.state';
      const $set = {};
      $set[field] = 'worldState';
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

          debug('updateGameState: worldState');
          next();
        }
      );
    }
  };
};
