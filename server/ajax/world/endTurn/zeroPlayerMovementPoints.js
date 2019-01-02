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
      findHeroId(entities, playerId);
    })();

    function findHeroId(entities, playerId) {
      let heroId;

      _.forEach(entities, (entity, id) => {
        if (entity.heroStats && entity.owner === playerId) {
          heroId = id;
        }
      });

      debug('findHeroId: heroId:', heroId);
      updatePlayerMovementPoints(entities, playerId, heroId);
    }

    function updatePlayerMovementPoints(entities, playerId, heroId) {
      const gameId = entities._id;

      const query = { _id: gameId };
      const field = heroId + '.heroStats.movement';
      const $set = {};
      $set[field] = 0;
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

          debug('updatePlayerMovementPoints: playerId:', playerId);
          next();
        }
      );
    }
  };
};
