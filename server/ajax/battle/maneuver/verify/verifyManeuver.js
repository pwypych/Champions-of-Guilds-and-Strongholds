// @format

'use strict';

const debug = require('debug')('cogs:verifyManeuver.js');

module.exports = (
  checkUnitOwner,
  checkUnitActive,
  checkUnitManeuverGreatherThenZero
) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Middleware that runs before unit makes  maneuver. It makes some verifications regarding to unit'
      );

      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;
      const playerId = res.locals.playerId;

      runCheckUnitOwner(gameId, unitId, playerId);
    })();

    function runCheckUnitOwner(gameId, unitId, playerId) {
      debug('runCheckUnitOwner: Starting...');
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
      debug('runCheckUnitActive: Starting...');
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
      debug('runCheckUnitManeuverGreatherThenZero: Starting...');
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
