// @format

'use strict';

const debug = require('debug')('cogs:refillUnitMovement');

// What does this module do?
// Middleware, set unit current movement to bese value
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const unitId = res.locals.unitId;
      const gameId = res.locals.entities._id;
      const entities = res.locals.entities;
      const unit = entities[res.locals.unitId];

      debug('init: unitId:', unitId);
      debug('init: gameId:', gameId);
      updateSetUnitCurrentMovemenToBase(gameId, unitId, unit);
    })();

    function updateSetUnitCurrentMovemenToBase(gameId, unitId, unit) {
      const query = { _id: gameId };

      const field = unitId + '.unitStats.current.movement';
      const $set = {};
      $set[field] = unit.unitStats.base.movement;

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: insert mongo error:', error);
            return;
          }

          debug('updateSetUnitCurrentMovemenToBase: Success');
          next();
        }
      );
    }
  };
};
