// @format

'use strict';

const debug = require('debug')('cogs:maneuverMelee');
const _ = require('lodash');

// What does this module do?
// Middleware, expects unitId and unitJourney in res.locals, flags unitBegingMoved and processes each step
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.unit = entities[ctx.unitId];
      ctx.unitId = res.locals.unitId;
      ctx.meleePosition = req.body.position;

      debug('init: ctx.unitId:', ctx.unitId);
      checkIsPositionInRange(ctx);
    })();

    function checkIsPositionInRange(ctx) {
      const meleePosition = ctx.meleePosition;
      const unit = ctx.unit;
      const distanceX = Math.abs(unit.position.x - meleePosition.X);
      const distanceY = Math.abs(unit.position.y - meleePosition.Y);

      if (distanceX !== 0 && distanceX !== 1) {
        const message = 'Cannot melee more than one step';
        debug('checkIsPositionInRange: ', message);
        return;
      }

      if (distanceY !== 0 && distanceY !== 1) {
        const message = 'Cannot melee more than one step';
        debug('checkIsPositionInRange: ', message);
        return;
      }

      debug('checkIsPositionInRange: meleePosition:', meleePosition);
      checkIsThereEnemyOnMeleePosition();
    }
  };
};
