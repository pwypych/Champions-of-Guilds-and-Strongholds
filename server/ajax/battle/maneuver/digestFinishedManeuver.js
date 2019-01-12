// @format

'use strict';

const debug = require('debug')('cogs:digestFinishedManeuver.js');

// What does this module do?
// Middleware, expects unitId and unitJourney in res.locals, flags unitBegingMoved and processes each step
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
      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.unitId = res.locals.unitId;

      debug('init: ctx.gameId:', ctx.gameId);
      runDecrementUnitManuver(ctx);
    })();

    function runDecrementUnitManuver(ctx) {
      const gameId = ctx.gameId;
      const unitId = ctx.unitId;
      decrementUnitManeuver(gameId, unitId, (error) => {
        if (error) {
          debug('runDecrementUnitManuver: error:', error);
        }

        runCheckUnitManeuverIsZero(ctx);
      });
    }

    function runCheckUnitManeuverIsZero(ctx) {
      const gameId = ctx.gameId;
      const unitId = ctx.unitId;

      checkUnitManeuverIsZero(gameId, unitId, (error, isZero) => {
        if (error) {
          debug('runCheckUnitManeuverIsZero: error:', error);
        }

        if (!isZero) {
          debug('checkUnitManeuverIsZero: isZero:', isZero);
          return;
        }

        debug('checkUnitManeuverIsZero: isZero:', isZero);
        runCheckEveryUnitManeuverIsZero(ctx);
      });
    }

    function runCheckEveryUnitManeuverIsZero(ctx) {
      const gameId = ctx.gameId;

      checkEveryUnitManeuverIsZero(gameId, (error, isZero) => {
        if (error) {
          debug('runCheckEveryUnitManeuverIsZero: error:', error);
        }

        if (isZero) {
          debug('runCheckEveryUnitManeuverIsZero: isZero:', isZero);
          runRefillEveryUnitManeuver(ctx);
          return;
        }

        debug('runCheckEveryUnitManeuverIsZero: isZero:', isZero);
        runNominateNewActiveUnit(ctx);
      });
    }

    function runRefillEveryUnitManeuver(ctx) {
      const gameId = ctx.gameId;

      refillEveryUnitManeuver(gameId, (error) => {
        if (error) {
          debug('runCheckEveryUnitManeuverIsZero: error:', error);
        }

        runNominateNewActiveUnit(ctx);
      });
    }

    function runNominateNewActiveUnit(ctx) {
      const gameId = ctx.gameId;
      const unitId = ctx.unitId;

      nominateNewActiveUnit(gameId, unitId, (error) => {
        if (error) {
          debug('runCheckEveryUnitManeuverIsZero: error:', error);
        }
      });
    }
  };
};
