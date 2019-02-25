// @format

'use strict';

const debug = require('debug')('cogs:heroMovementPointsDecrement');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Decrements hero current movement based on path length');
      const entities = res.locals.entities;
      const gameId = entities._id;
      const entityId = res.locals.entityId;
      const path = res.locals.path;

      decrementHeroMovement(gameId, entityId, path);
    })();

    function decrementHeroMovement(gameId, entityId, path) {
      const query = { _id: gameId };

      const decrementBy = path.length - 1;

      const fieldMovement = entityId + '.heroStats.current.movement';
      const $inc = {};
      // should be negative to decrement
      $inc[fieldMovement] = decrementBy * -1;

      const update = { $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('decrementHeroMovement: mongo error:', error);
            return;
          }

          debug('decrementHeroMovement');
          next();
        }
      );
    }
  };
};
