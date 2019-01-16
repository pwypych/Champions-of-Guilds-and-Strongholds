// @format

'use strict';

const debug = require('debug')('cogs:checkEveryUnitManeuverIsZero');
const _ = require('lodash');

// What does this module do?
// If every unit in battle has no maneuvers left it returns true, if any unit does have maneuvers it returns false
module.exports = (db, findEntitiesByGameId) => {
  return (gameId, callback) => {
    (function init() {
      debug('init: gameId:', gameId);
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId: entities._id:', entities._id);
        checkEveryUnitManeuverComponent(entities);
      });
    }

    function checkEveryUnitManeuverComponent(entities) {
      let isEveryUnitManeuverZero = true;
      _.forEach(entities, (entity) => {
        if (entity.unitStats) {
          if (entity.unitStats.current.maneuver > 0) {
            isEveryUnitManeuverZero = false;
            debug(
              'checkEveryUnitManeuverComponent: entity.unitName:',
              entity.unitName
            );
            debug(
              'checkEveryUnitManeuverComponent: entity.unitStats.current.maneuver:',
              entity.unitStats.current.maneuver
            );
          }
        }
      });

      callback(null, isEveryUnitManeuverZero);
    }
  };
};
