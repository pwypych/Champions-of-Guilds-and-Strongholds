// @format

'use strict';

const debug = require('debug')('cogs:maneuverMelee');
const _ = require('lodash');
const validator = require('validator');

// What does this module do?
// Middleware, expects unitId and unitJourney in res.locals, flags unitBegingMoved and processes each step
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.unitId = res.locals.unitId;
      ctx.unit = entities[ctx.unitId];

      debug('init: ctx.unitId:', ctx.unitId);
      checkRequestBodyMeleeOnPosition(ctx);
    })();

    function checkRequestBodyMeleeOnPosition(ctx) {
      const meleeOnPosition = req.body.meleeOnPosition;

      if (
        typeof meleeOnPosition.x === 'undefined' ||
        typeof meleeOnPosition.y === 'undefined' ||
        !validator.isNumeric(meleeOnPosition.x) ||
        !validator.isNumeric(meleeOnPosition.y)
      ) {
        debug('POST parameter meleeOnPosition not valid');
        return;
      }

      meleeOnPosition.x = parseInt(meleeOnPosition.x, 10);
      meleeOnPosition.y = parseInt(meleeOnPosition.y, 10);

      ctx.meleeOnPosition = meleeOnPosition;
      debug('checkRequestBodyUnitJourney: meleeOnPosition', meleeOnPosition);
      checkIsMeleePositionInRange(ctx);
    }

    function checkIsMeleePositionInRange(ctx) {
      const meleeOnPosition = ctx.meleeOnPosition;
      const unit = ctx.unit;

      const distanceX = Math.abs(unit.position.x - meleeOnPosition.x);
      const distanceY = Math.abs(unit.position.y - meleeOnPosition.y);
      if (distanceX !== 0 && distanceX !== 1) {
        const message = 'Cannot melee more than one step';
        debug('checkIsMeleePositionInRange: ', message);
        return;
      }

      if (distanceY !== 0 && distanceY !== 1) {
        const message = 'Cannot melee more than one step';
        debug('checkIsMeleePositionInRange: ', message);
        return;
      }

      debug('checkIsMeleePositionInRange: meleeOnPosition:', meleeOnPosition);
      checkIsEnemyOnMeleePosition(ctx);
    }

    function checkIsEnemyOnMeleePosition(ctx) {
      const entities = res.locals.entities;
      const meleeOnPosition = ctx.meleeOnPosition;
      let targetId;

      _.forEach(entities, (entity, id) => {
        if (entity.unitName) {
          if (
            entity.position.x === meleeOnPosition.x &&
            entity.position.y === meleeOnPosition.y
          ) {
            debug('checkIsEnemyOnMeleePosition: target found:', id);
            targetId = id;
          }
        }
      });

      if (!targetId) {
        debug(
          'checkIsEnemyOnMeleePosition - No target on: meleeOnPosition:',
          meleeOnPosition
        );
        return;
      }

      ctx.targetId = targetId;
      countDamageModificator(ctx);
    }

    function countDamageModificator(ctx) {
      const entities = res.locals.entities;
      const target = entities[ctx.targetId];
      debug('countDamageModificator: target.unitName:', target.unitName);
      debug('countDamageModificator: target.position:', target.position);

      _.forEach(entities, (entity) => {
        if (entity.unitName) {
          [1, -1].forEach((offsetX) => {
            [1, -1].forEach((offsetY) => {
              if (
                entity.position.x === target.position.x + offsetX &&
                entity.position.y === target.position.y + offsetY
              ) {
                debug(
                  'countDamageModificator: Battle object On x:',
                  target.position.x + offsetX,
                  'y:',
                  target.position.y + offsetY
                );
              }
            });
          });
        }
      });
    }
  };
};
