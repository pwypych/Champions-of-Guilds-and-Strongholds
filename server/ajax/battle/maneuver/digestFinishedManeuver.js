// @format

'use strict';

const debug = require('debug')('cogs:digestFinishedManeuver.js');

// What does this module do?
// Middleware, expects unitId and unitJourney in res.locals, flags unitBegingMoved and processes each step
module.exports = (db, decrementUnitManeuver, checkUnitManeuverIsZero) => {
  return (req, res, next) => {
    (function init() {
      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.unitJourney = res.locals.unitJourney;
      ctx.unitId = res.locals.unitId;
      ctx.unit = entities[ctx.unitId];

      debug('init: ctx.unit.unitName:', ctx.unit.unitName);
      runDecrementUnitManuver(ctx);
    })();

    function runDecrementUnitManuver(ctx) {
      const gameId = ctx.gameId;
      const unitId = ctx.unitId;
      decrementUnitManeuver(gameId, unitId, (error) => {
        if (error) {
          debug('runDecrementUnitManuver: error:', error);
        }

        // go to checkUnitManeuverZero lib
        runCheckUnitManeuverIsZero(ctx);
      });
    }

    function runCheckUnitManeuverIsZero(ctx) {
      const gameId = ctx.gameId;
      const unitId = ctx.unitId;
      checkUnitManeuverIsZero(gameId, unitId, (error) => {
        if (error) {
          debug('runCheckUnitManeuverIsZero: error:', error);
        }

        // go to checkUnitManeuverZero lib
        runCheckUnitManeuverIsZero(ctx);
      });
    }
  };
};
