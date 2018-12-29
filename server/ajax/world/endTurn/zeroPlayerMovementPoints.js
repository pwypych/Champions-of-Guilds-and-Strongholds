// @format

'use strict';

const debug = require('debug')('cogs:zeroPlayerMovementPoints.js');
const _ = require('lodash');

// What does this module do?
// Middleware that update hero.movementStats.movement to 0
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      getHeroEntity();
    })();

    function getHeroEntity() {
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;
      let heroId;

      _.forEach(entities, (entity, id) => {
        if (entity.owner === playerId) {
          heroId = id;
        }
      });

      debug('getHeroEntity: heroId:', heroId);
      updatePlayerMovementPoints(heroId);
    }

    function updatePlayerMovementPoints(heroId) {
      debug(
        'updatePlayerMovementPoints: res.locals.playerId:',
        res.locals.playerId
      );
      const gameId = res.locals.entities._id;

      const query = { _id: gameId };
      const string = heroId + '.heroStats.movement';
      const $set = {};
      $set[string] = 0;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updatePlayerMovementPoints: error:', error);
            return;
          }

          next();
        }
      );
    }
  };
};
