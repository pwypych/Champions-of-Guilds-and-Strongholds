// @format

'use strict';

const debug = require('debug')('cogs:digestFinishedManeuver.js');

module.exports = (
  db,
  decrementUnitManeuver,
  checkIsUnitManeuverZero,
  checkIsEveryUnitManeuverZero,
  refillEveryUnitManeuver,
  nominateNewActiveUnit,
  ifBattleFinishedChangeState
) => {
  return (req, res) => {
    (function init() {
      debug(
        '// Middleware that runs after unit makes sucessfull maneuver. Some processing need to be done: f. ex. decrementing maneuver, refilling it, nominating new active unit'
      );

      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;

      runDecrementUnitManuver(gameId, unitId);
    })();

    function runDecrementUnitManuver(gameId, unitId) {
      debug('runDecrementUnitManuver: Starting...');
      decrementUnitManeuver(gameId, unitId, () => {
        debug('runDecrementUnitManuver: Success!');
        runCheckIsBattleFinished(gameId, unitId);
      });
    }

    function runCheckIsBattleFinished(gameId, unitId) {
      debug('runCheckIsBattleFinished: Starting...');
      ifBattleFinishedChangeState(gameId, unitId, (isBattleFinished) => {
        if (isBattleFinished) {
          debug('runCheckIsBattleFinished: Battle is finnished!');
          return;
        }

        debug('runCheckIsBattleFinished: No, still running!');
        runCheckIsUnitManeuverZero(gameId, unitId);
      });
    }

    function runCheckIsUnitManeuverZero(gameId, unitId) {
      debug('runCheckIsUnitManeuverZero: Starting...');
      checkIsUnitManeuverZero(gameId, unitId, (error, isUnitManeuverZero) => {
        if (isUnitManeuverZero) {
          debug(
            'runCheckIsUnitManeuverZero: isUnitManeuverZero:',
            isUnitManeuverZero
          );
          runCheckIsEveryUnitManeuverZero(gameId, unitId);
          return;
        }

        debug('runCheckIsUnitManeuverZero: Unit Still have maneuvers!');
        // finish digest here unit has still some maneuvers remaining
      });
    }

    function runCheckIsEveryUnitManeuverZero(gameId, unitId) {
      debug('runCheckIsEveryUnitManeuverZero: Starting...');
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
      debug('runRefillEveryUnitManeuver: Starting...');
      refillEveryUnitManeuver(gameId, () => {
        debug('runRefillEveryUnitManeuver: Success!');
        runNominateNewActiveUnit(gameId, unitId);
      });
    }

    function runNominateNewActiveUnit(gameId, unitId) {
      debug('runNominateNewActiveUnit: Starting...');
      nominateNewActiveUnit(gameId, unitId, () => {
        debug('runNominateNewActiveUnit: Success!');
      });
    }
  };
};
