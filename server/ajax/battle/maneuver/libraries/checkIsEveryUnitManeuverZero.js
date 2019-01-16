// @format

'use strict';

const debug = require('debug')('cogs:checkIsEveryUnitManeuverZero');
const _ = require('lodash');

// What does this module do?
// Library that works on callback, check every unit in battle maneuver is equal zero
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
