// @format

'use strict';

const debug = require('debug')('cogs:checkIsUnitManeuverZero');
const _ = require('lodash');

// What does this module do?
// If unit has no maneuvers left it returns true, if unit does have maneuvers it returns false
module.exports = (db, findEntitiesByGameId) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('init: gameId:', gameId);
      debug('init: unitId:', unitId);
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId: entities._id:', entities._id);
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

      debug('findUnitEntity: unitId', unitId);
      isUnitManeuverZero(unit);
    }

    function isUnitManeuverZero(unit) {
      if (unit.unitStats.current.maneuver < 1) {
        debug(
          'isUnitManeuverZero: unit.unitStats.current.maneuver',
          unit.unitStats.current.maneuver
        );
        callback(null, true);
        return;
      }

      debug(
        'isUnitManeuverZero: unit.unitStats.current.maneuver',
        unit.unitStats.current.maneuver
      );
      callback(null, false);
    }
  };
};
