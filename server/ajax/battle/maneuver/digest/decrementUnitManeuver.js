// @format

'use strict';

const debug = require('debug')('cogs:decrementUnitManeuver');

module.exports = (db) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('// Decrements maneuver in unitStats by 1');

      updateUnitManeuver();
    })();

    function updateUnitManeuver() {
      const query = { _id: gameId };

      const field = unitId + '.unitStats.current.maneuver';
      const $inc = {};
      $inc[field] = -1;

      const update = { $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateUnitManeuver: error: ', error);
          debug('updateUnitManeuver: Success!');
          callback(null);
        }
      );
    }
  };
};
