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
      runDecrementUnitManuver(gameId, unitId);
    })();

    function runDecrementUnitManuver(gameId, unitId) {
      decrementUnitManeuver(gameId, unitId, () => {
        runCheckUnitManeuverIsZero(gameId, unitId);
      });
    }

    function runCheckUnitManeuverIsZero(gameId, unitId) {
      checkUnitManeuverIsZero(gameId, unitId, (error, isZero) => {
        if (!isZero) {
          debug('checkUnitManeuverIsZero: isZero:', isZero);
          return;
        }

        debug('checkUnitManeuverIsZero: isZero:', isZero);
        runCheckEveryUnitManeuverIsZero(gameId, unitId);
      });
    }

    function runCheckEveryUnitManeuverIsZero(gameId, unitId) {
      checkEveryUnitManeuverIsZero(gameId, (error, isZero) => {
        if (isZero) {
          debug('runCheckEveryUnitManeuverIsZero: isZero:', isZero);
          runRefillEveryUnitManeuver(gameId, unitId);
          return;
        }

        debug('runCheckEveryUnitManeuverIsZero: isZero:', isZero);
        runNominateNewActiveUnit(gameId, unitId);
      });
    }

    function runRefillEveryUnitManeuver(gameId, unitId) {
      refillEveryUnitManeuver(gameId, () => {
        runNominateNewActiveUnit(gameId, unitId);
      });
    }

    function runNominateNewActiveUnit(gameId, unitId) {
      nominateNewActiveUnit(gameId, unitId, () => {});
    }
  };
};
