// @format

'use strict';

const debug = require('debug')('cogs:checkIsUnitManeuverZero');
const _ = require('lodash');

module.exports = (db, findEntitiesByGameId) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug(
        '// If unit has no maneuvers left it returns true, if unit does have maneuvers it returns false'
      );

      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
        findUnitEntity(entities);
      });
    }

    function findUnitEntity(entities) {
      let unit;
      _.forEach(entities, (entity, id) => {
        if (id === unitId) {
          unit = entity;
        }
      });

      debug('findUnitEntity: Unit found:', unit.unitName);
      isUnitManeuverZero(unit);
    }

    function isUnitManeuverZero(unit) {
      if (unit.unitStats.current.maneuver < 1) {
        debug(
          'isUnitManeuverZero: Yes, no maneuvers remaining:',
          unit.unitStats.current.maneuver
        );
        callback(null, true);
        return;
      }

      debug(
        'isUnitManeuverZero: No, maneuvers remaining:',
        unit.unitStats.current.maneuver
      );
      callback(null, false);
    }
  };
};
