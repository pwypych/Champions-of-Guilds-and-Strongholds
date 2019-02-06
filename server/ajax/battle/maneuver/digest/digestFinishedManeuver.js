// @format

'use strict';

const debug = require('debug')('cogs:digestFinishedManeuver.js');

// What does this module do?
// Middleware that runs after unit makes sucessfull maneuver. Some processing need to be done: f. ex. decrementing maneuver, refilling it, nominating new active unit
module.exports = (
  db,
  decrementUnitManeuver,
  checkIsUnitManeuverZero,
  checkIsEveryUnitManeuverZero,
  refillEveryUnitManeuver,
  nominateNewActiveUnit,
  ifBattleFinishedChangeBattleStatus
) => {
  return (req, res) => {
    (function init() {
      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;

      debug('init: gameId:', gameId);
      debug('init: unitId:', unitId);
      debug('init: res.locals:', res.locals);
      runDecrementUnitManuver(gameId, unitId);
    })();

    function runDecrementUnitManuver(gameId, unitId) {
      decrementUnitManeuver(gameId, unitId, () => {
        debug('runDecrementUnitManuver: Success!');
        runCheckIsBattleFinished(gameId, unitId);
      });
    }

    function runCheckIsBattleFinished(gameId, unitId) {
      ifBattleFinishedChangeBattleStatus(gameId, unitId, (onlyOneBossLeft) => {
        debug('runCheckIsBattleFinished: onlyOneBossLeft:', onlyOneBossLeft);
        debug('runCheckIsBattleFinished: Success!');
        runCheckIsUnitManeuverZero(gameId, unitId);
      });
    }

    function runCheckIsUnitManeuverZero(gameId, unitId) {
      checkIsUnitManeuverZero(gameId, unitId, (error, isUnitManeuverZero) => {
        if (isUnitManeuverZero) {
          debug(
            'runCheckIsUnitManeuverZero: isUnitManeuverZero:',
            isUnitManeuverZero
          );
          runCheckIsEveryUnitManeuverZero(gameId, unitId);
          return;
        }

        debug(
          'runCheckIsUnitManeuverZero: isUnitManeuverZero:',
          isUnitManeuverZero
        );
        // finish digest here unit has still some maneuvers left
      });
    }

    function runCheckIsEveryUnitManeuverZero(gameId, unitId) {
      checkIsEveryUnitManeuverZero(gameId, (error, isEveryUnitManeuverZero) => {
        if (isEveryUnitManeuverZero) {
          debug(
            'runCheckIsEveryUnitManeuverZero: isEveryUnitManeuverZero:',
            isEveryUnitManeuverZero
          );
          runRefillEveryUnitManeuver(gameId, unitId);
          return;
        }

        debug(
          'runCheckIsEveryUnitManeuverZero: isEveryUnitManeuverZero:',
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
