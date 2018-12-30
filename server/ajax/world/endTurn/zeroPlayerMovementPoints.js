// @format

'use strict';

const debug = require('debug')('cogs:zeroPlayerMovementPoints.js');
const _ = require('lodash');

// What does this module do?
// Middleware that update hero.heroStats.movement to 0
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;
      findHeroEntity(entities, playerId);
    })();

    function findHeroEntity(entities, playerId) {
      let heroId;

      _.forEach(entities, (entity, id) => {
        if (entity.heroStats && entity.owner === playerId) {
          heroId = id;
        }
      });

      debug('findHeroEntity: heroId:', heroId);
      updatePlayerMovementPoints(entities, playerId, heroId);
    }

    function updatePlayerMovementPoints(entities, playerId, heroId) {
      debug('updatePlayerMovementPoints: playerId:', playerId);
      const gameId = entities._id;

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
