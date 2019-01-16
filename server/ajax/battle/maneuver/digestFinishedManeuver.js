// @format

'use strict';

const debug = require('debug')('cogs:digestFinishedManeuver.js');

// What does this module do?
// Middleware that runs after unit makes sucessfull maneuver. Some processing need to be done: f. ex. decrementing maneuver, refilling it, nominating new active unit
module.exports = (
  db,
  decrementUnitManeuver,
  checkUnitManeuverIsZero,
  checkEveryUnitManeuverIsZero,
  refillEveryUnitManeuver,
  nominateNewActiveUnit
) => {
  return (req, res) => {
    (function init() {
      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;

      debug('init: gameId:', gameId);
      debug('init: unitId:', unitId);
      runDecrementUnitManuver(gameId, unitId);
    })();

    function runDecrementUnitManuver(gameId, unitId) {
      decrementUnitManeuver(gameId, unitId, () => {
        debug('runDecrementUnitManuver: Success!');
        runCheckUnitManeuverIsZero(gameId, unitId);
      });
    }

    // checkIsUnitManeuverZero
    function runCheckUnitManeuverIsZero(gameId, unitId) {
      checkUnitManeuverIsZero(gameId, unitId, (error, isUnitManeuverZero) => {
        if (isUnitManeuverZero) {
          debug(
            'runCheckUnitManeuverIsZero: isUnitManeuverZero:',
            isUnitManeuverZero
          );
          runCheckEveryUnitManeuverIsZero(gameId, unitId);
          return;
        }

        debug(
          'runCheckUnitManeuverIsZero: isUnitManeuverZero:',
          isUnitManeuverZero
        );
        // finish digest here unit has still some maneuvers left
      });
    }

    // checkIsEveryUnitManeuverZero
    function runCheckEveryUnitManeuverIsZero(gameId, unitId) {
      checkEveryUnitManeuverIsZero(gameId, (error, isEveryUnitManeuverZero) => {
        if (isEveryUnitManeuverZero) {
          debug(
            'runCheckEveryUnitManeuverIsZero: isEveryUnitManeuverZero:',
            isEveryUnitManeuverZero
          );
          runRefillEveryUnitManeuver(gameId, unitId);
          return;
        }

        debug(
          'runCheckEveryUnitManeuverIsZero: isEveryUnitManeuverZero:',
          isEveryUnitManeuverZero
        );
        runNominateNewActiveUnit(gameId, unitId);
      });
    }

    function runRefillEveryUnitManeuver(gameId, unitId) {
      refillEveryUnitManeuver(gameId, () => {
        debug('runRefillEveryUnitManeuver: Success!');
        runNominateNewActiveUnit(gameId, unitId);
      });
    }

    function runNominateNewActiveUnit(gameId, unitId) {
      nominateNewActiveUnit(gameId, unitId, () => {
        debug('runNominateNewActiveUnit: Success!');
      });
    }
  };
};
