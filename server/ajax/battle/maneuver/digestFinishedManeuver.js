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
        runCheckIsUnitManeuverZero(gameId, unitId);
      });
    }

    function runCheckIsUnitManeuverZero(gameId, unitId) {
      checkIsUnitManeuverZero(gameId, unitId, (error, isZero) => {
        if (!isZero) {
          debug('runCheckIsUnitManeuverZero: isZero:', isZero);
          return;
        }

        debug('runCheckIsUnitManeuverZero: isZero:', isZero);
        runCheckIsEveryUnitManeuverZero(gameId, unitId);
      });
    }

    function runCheckIsEveryUnitManeuverZero(gameId, unitId) {
      checkIsEveryUnitManeuverZero(gameId, (error, isZero) => {
        if (isZero) {
          debug('runCheckIsEveryUnitManeuverZero: isZero:', isZero);
          runRefillEveryUnitManeuver(gameId, unitId);
          return;
        }

        debug('runCheckIsEveryUnitManeuverZero: isZero:', isZero);
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
