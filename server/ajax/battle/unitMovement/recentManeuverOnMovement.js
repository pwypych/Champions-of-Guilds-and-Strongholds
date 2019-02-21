// @format

'use strict';

const debug = require('debug')('cogs:unitRecentManeuverOnMovement');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Updates recentManeuver to onMovement');
      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;
      const unitPath = res.locals.unitPath;

      generateRecentManeuver(gameId, unitId, unitPath);
    })();

    function generateRecentManeuver(gameId, unitId, unitPath) {
      const recentManeuver = {};
      recentManeuver.name = 'onMovement';
      recentManeuver.unitPath = unitPath;
      recentManeuver.timestamp = Date.now();

      updateUnitRecentManeuver(gameId, unitId, recentManeuver);
    }

    function updateUnitRecentManeuver(gameId, unitId, recentManeuver) {
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
          next();
        }
      );
    }
  };
};
