// @format

'use strict';

const debug = require('debug')('cogs:checkUnitManeuverGreatherThenZero');

// What does this module do?
// Checks if unit have any maneuvers left
module.exports = (findEntitiesByGameId) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('// Checks if unit have any maneuvers left');
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
        checkUnitManeuver(entities);
      });
    }

    function checkUnitManeuver(entities) {
      const unit = entities[unitId];
      if (unit.unitStats.current.maneuver < 1) {
        debug(
          'checkUnitManeuver: No maneuvers remaining! - unit.unitStats.current.maneuver:',
          unit.unitStats.current.maneuver
        );
        callback(null, false);
        return;
      }

      debug(
        'checkUnitManeuver: Maneuvers remaining:',
        unit.unitStats.current.maneuver
      );
      callback(null, true);
    }
  };
};
