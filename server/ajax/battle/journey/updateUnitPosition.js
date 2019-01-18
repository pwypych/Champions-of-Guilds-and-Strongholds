// @format

'use strict';

const debug = require('debug')('cogs:updateUnitPosition');

// What does this module do?
// Updates given unit position to new
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

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('ERROR: insert mongo error:', error);
          debug('updateUnitPosition: Success!');
          callback(null);
        }
      );
    }
  };
};
