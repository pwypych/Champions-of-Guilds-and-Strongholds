// @format

'use strict';

const debug = require('debug')('cogs:decrementUnitMovement');

// What does this module do?
// Decrements given unit movement by 1
module.exports = (db) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('init');
      updateDecrementUnitMovementByOne();
    })();

    function updateDecrementUnitMovementByOne() {
      const query = { _id: gameId };

      const field = unitId + '.unitStats.current.movement';
      const $inc = {};
      $inc[field] = -1;

      const update = { $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('ERROR: insert mongo error:', error);
          debug('updateDecrementUnitMovementByOne: Success!');
          callback(null);
        }
      );
    }
  };
};
