// @format

'use strict';

const debug = require('debug')('cogs:decrementUnitManeuver');

// What does this module do?
// Library that works on callback, decremeant unti maneuver by 1
module.exports = (db) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('init: gameId:', gameId);
      debug('init: unitId:', unitId);
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
          if (error) {
            debug('updateUnitManeuver: error: ', error);
            callback(error);
            return;
          }

          debug('updateUnitManeuver: Success!');
          callback(null);
        }
      );
    }
  };
};
