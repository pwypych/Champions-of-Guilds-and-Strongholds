// @format

'use strict';

const debug = require('debug')('cogs:checkUnitManeuverGreatherThenZero');

// What does this module do?
// Middleware, checks if unit have any maneuvers left
module.exports = (findEntitiesByGameId) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('init: unitId:', unitId);
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId: entities._id:', entities._id);
        checkUnitManeuverLeft(entities);
      });
    }

    function checkUnitManeuverLeft(entities) {
      const unit = entities[unitId];
      if (unit.unitStats.current.maneuver < 1) {
        debug(
          'checkUnitManeuverLeft: No maneuver! - unit.unitStats.current.maneuver:',
          unit.unitStats.current.maneuver
        );
        callback(null, false);
        return;
      }

      debug(
        'checkUnitManeuverLeft: unit.unitStats.current.maneuver:',
        unit.unitStats.current.maneuver
      );
      callback(null, true);
    }
  };
};
