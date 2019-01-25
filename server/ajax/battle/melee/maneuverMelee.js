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
      ctx.meleeOnPosition = req.body.meleeOnPosition;

      debug('init: ctx.unitId:', ctx.unitId);
      checkIsPositionInRange(ctx);
    })();

    function checkIsPositionInRange(ctx) {
      const meleeOnPosition = ctx.meleeOnPosition;
      const unit = ctx.unit;
      const distanceX = Math.abs(unit.position.x - meleeOnPosition.X);
      const distanceY = Math.abs(unit.position.y - meleeOnPosition.Y);

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

      debug('checkIsPositionInRange: meleeOnPosition:', meleeOnPosition);
      checkIsThereEnemyOnMeleePosition();
    }

    function checkIsThereEnemyOnMeleePosition() {
      const entities = res.locals.entities;
      const meleeOnPosition = ctx.meleeOnPosition;
      let enemyId;

      _.forEach(entities, (entity, id) => {
        if (entity.unitName) {
          if (
            entity.position.x === meleeOnPosition.x &&
            entity.position.y === meleeOnPosition.y
          ) {
            enemyId = id;
          }
        }
      });
    }
  };
};
