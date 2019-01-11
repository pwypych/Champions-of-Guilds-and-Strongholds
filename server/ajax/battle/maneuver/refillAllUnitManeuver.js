// @format

'use strict';

const debug = require('debug')('cogs:refillAllUnitManeuvers.js');
const _ = require('lodash');

// What does this module do?
// Middleware, set hero.movement to hero.movementMax
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      const entities = res.locals.entities;
      updateSetHeroMovementToMax(entities);
    })();

    function updateSetHeroMovementToMax(entities) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const $set = {};
      _.forEach(entities, (entity, id) => {
        if (entity.heroStats) {
          const field = id + '.heroStats.movement';
          $set[field] = entity.heroStats.movementMax;
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
