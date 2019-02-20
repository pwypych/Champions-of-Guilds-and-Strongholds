// @format

'use strict';

const debug = require('debug')('cogs:unitPathSendResponce');

module.exports = (updateUnitRecentManeuver) => {
  return (req, res, next) => {
    (function init() {
      debug('// Sends response for journey result, and updates recentManeuver');
      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;
      const unitPath = res.locals.unitPath;

      runUpdateUnitRecentManeuver(gameId, unitId, unitPath);
    })();

    function runUpdateUnitRecentManeuver(gameId, unitId, unitPath) {
      const recentManeuver = {};
      recentManeuver.name = 'onMovement';
      recentManeuver.unitPath = unitPath;
      recentManeuver.timestamp = Date.now();

      debug('runUpdateUnitRecentManeuver: Starting...');
      updateUnitRecentManeuver(gameId, unitId, recentManeuver, () => {
        debug('runUpdateUnitRecentManeuver: Success!');
        sendResponce(unitPath);
      });
    }

    function sendResponce(unitPath) {
      debug('sendResponce: No Errors!');
      res.send({ error: 0, unitPath: unitPath });
      next();
    }
  };
};
