// @format

'use strict';

const debug = require('debug')('cogs:refillUnitMovement');

module.exports = (db, findEntitiesByGameId) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('// Middleware, set unit current movement to its base value');

      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
        updateSetUnitCurrentMovementToBase(entities);
      });
    }

    function updateSetUnitCurrentMovementToBase(entities) {
      const unit = entities[unitId];
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
          debug('ERROR: insert mongo error:', error);
          debug('updateSetUnitCurrentMovementToBase: Success!');
          callback(null);
        }
      );
    }
  };
};
