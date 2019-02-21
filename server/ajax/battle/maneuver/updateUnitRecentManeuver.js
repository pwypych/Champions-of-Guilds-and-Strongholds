// @format

'use strict';

const debug = require('debug')('cogs:updateUnitRecentManeuver');

module.exports = (db) => {
  return (gameId, unitId, recentManeuver, callback) => {
    (function init() {
      debug('// Updates given unit recentManeuver with new data');

      updateUnitRecentManeuver();
    })();

    function updateUnitRecentManeuver() {
      const query = { _id: gameId };

      const field = unitId + '.recentManeuver';
      const $set = {};
      $set[field] = recentManeuver;

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateUnitRecentManeuver: ERROR:', error);
          }
          debug('updateUnitRecentManeuver: Success!');
          callback(null);
        }
      );
    }
  };
};
