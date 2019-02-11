// @format

'use strict';

const debug = require('debug')('cogs:verifyManeuver.js');

// What does this module do?
// Middleware that runs before unit makes  maneuver. It makes some verifications regarding to unit
module.exports = (
  checkUnitOwner,
  checkUnitActive,
  checkUnitManeuverGreatherThenZero
) => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;
      const playerId = res.locals.playerId;

      debug('init');
      runCheckUnitOwner(gameId, unitId, playerId);
    })();

    function runCheckUnitOwner(gameId, unitId, playerId) {
      checkUnitOwner(gameId, unitId, playerId, (error, isUnitOwner) => {
        if (!isUnitOwner) {
          debug('runCheckUnitOwner: isUnitOwner:', isUnitOwner);
          return;
        }

        debug('runCheckUnitOwner: isUnitOwner:', isUnitOwner);
        runCheckUnitActive(gameId, unitId);
      });
    }

    function runCheckUnitActive(gameId, unitId) {
      checkUnitActive(gameId, unitId, (error, isUnitActive) => {
        if (!isUnitActive) {
          debug('runCheckUnitActive: isUnitActive:', isUnitActive);
          return;
        }

        debug('runCheckUnitActive: isUnitActive:', isUnitActive);
        runCheckUnitManeuverGreatherThenZero(gameId, unitId);
      });
    }

    function runCheckUnitManeuverGreatherThenZero(gameId, unitId) {
      checkUnitManeuverGreatherThenZero(
        gameId,
        unitId,
        (error, isUnitManeuverGreatherThenZero) => {
          if (!isUnitManeuverGreatherThenZero) {
            debug(
              'runCheckUnitManeuverGreatherThenZero: isUnitManeuverGreatherThenZero:',
              isUnitManeuverGreatherThenZero
            );
            return;
          }

          debug(
            'runCheckUnitManeuverGreatherThenZero: isUnitManeuverGreatherThenZero:',
            isUnitManeuverGreatherThenZero
          );
          next();
        }
      );
    }
  };
};
