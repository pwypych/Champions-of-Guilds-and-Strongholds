// @format

'use strict';

const debug = require('debug')('cogs:updateUnitRecentManeuver');

// What does this module do?
// Updates given unit recentManeuver to new
module.exports = (db) => {
  return (gameId, unitId, recentManeuver, callback) => {
    (function init() {
      debug('init');
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
          debug('ERROR: insert mongo error:', error);
          debug('updateUnitRecentManeuver: Success!');
          callback(null);
        }
      );
    }
  };
};
