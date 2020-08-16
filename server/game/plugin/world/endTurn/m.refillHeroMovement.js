// @format

'use strict';

const debug = require('debug')('cogs:refillHeroMovement.js');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Middleware, set heroStats.current.movement to heroStats.base.movement'
      );

      const entities = res.locals.entities;

      updateSetHeroMovementToMax(entities);
    })();

    function updateSetHeroMovementToMax(entities) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const $set = {};
      _.forEach(entities, (entity, id) => {
        if (entity.heroStats) {
          const field = id + '.heroStats.current.movement';
          $set[field] = entity.heroStats.base.movement;
        }
      });
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetHeroMovementToMax: error:', error);
            return;
          }

          debug('updateSetHeroMovementToMax');
          next();
        }
      );
    }
  };
};
