// @format

'use strict';

const debug = require('debug')('cogs:checkIsEveryUnitManeuverZero');
const _ = require('lodash');

// What does this module do?
// If every unit in battle has no maneuvers left it returns true, if any unit does have maneuvers it returns false
module.exports = (db, findEntitiesByGameId) => {
  return (gameId, callback) => {
    (function init() {
      debug('init');
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
        checkEveryUnitManeuverComponent(entities);
      });
    }

    function checkEveryUnitManeuverComponent(entities) {
      let isEveryUnitManeuverZero = true;
      _.forEach(entities, (entity) => {
        if (entity.unitStats) {
          if (entity.unitStats.current.maneuver > 0) {
            isEveryUnitManeuverZero = false;
          }
        }
      });

      debug(
        'checkEveryUnitManeuverComponent: isEveryUnitManeuverZero:',
        isEveryUnitManeuverZero
      );
      callback(null, isEveryUnitManeuverZero);
    }
  };
};
