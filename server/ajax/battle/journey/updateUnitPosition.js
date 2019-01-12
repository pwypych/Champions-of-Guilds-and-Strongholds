// @format

'use strict';

const debug = require('debug')('cogs:updateUnitPosition');

// What does this module do?
// Library that works on callback. It update unit position and decrement unitStats.current.movement
module.exports = (db) => {
  return (gameId, unitId, position, callback) => {
    (function init() {
      debug('init');

      waitBefore();
    })();

    function waitBefore() {
      setTimeout(() => {
        debug('waitBefore: Waiting 250ms!');
        updateUnitPosition();
      }, 250);
    }

    function updateUnitPosition() {
      const query = { _id: gameId };

      const fieldUnitX = unitId + '.position.x';
      const fieldUnitY = unitId + '.position.y';
      const $set = {};
      $set[fieldUnitX] = position.x;
      $set[fieldUnitY] = position.y;

      const fieldMovement = unitId + '.unitStats.current.movement';
      const $inc = {};
      $inc[fieldMovement] = -1;

      const update = { $set: $set, $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: insert mongo error:', error);
            callback('ERROR: insert mongo error');
            return;
          }

          debug('updateUnitPosition');
          callback(null);
        }
      );
    }
  };
};
