// @format

'use strict';

const debug = require('debug')('cogs:updateUnitPosition');

module.exports = (db) => {
  return (gameId, unitId, position, callback) => {
    (function init() {
      debug('// Updates given unit position to new');

      updateUnitPosition();
    })();

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
