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
      scanObsticlesAroundTarget(ctx);
    }

    function scanObsticlesAroundTarget(ctx) {
      const entities = res.locals.entities;
      const target = entities[ctx.targetId];
      ctx.target = target;
      debug('scanObsticlesAroundTarget: target.unitName:', target.unitName);
      debug('scanObsticlesAroundTarget: target.position:', target.position);
      const obsticlesAroundTarget = [];

      _.forEach(entities, (entity, id) => {
        if (entity.unitName) {
          [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 }
          ].forEach((offset) => {
            if (
              entity.position.x === target.position.x + offset.x &&
              entity.position.y === target.position.y + offset.y
            ) {
              obsticlesAroundTarget.push(id);
              debug(
                'scanObsticlesAroundTarget: Battle object On x:',
                target.position.x + offset.x,
                'y:',
                target.position.y + offset.y
              );
            }
          });
        }
      });

      debug(
        'scanObsticlesAroundTarget: obsticlesAroundTarget:',
        obsticlesAroundTarget
      );
      ctx.obsticlesAroundTarget = obsticlesAroundTarget;
      countDamageModificator(ctx);
    }

    function countDamageModificator(ctx) {
      let damageModificator = 100;
      const obsticlesAroundTarget = ctx.obsticlesAroundTarget;
      const unitId = ctx.unitId;
      const unit = ctx.unit;
      const entities = res.locals.entities;

      obsticlesAroundTarget.forEach((obsticleId) => {
        const obsticle = entities[obsticleId];
        if (!obsticle.unitStats) {
          damageModificator += 20;
          debug(
            'countDamageModificator - neutral obsticle: damageModificator:',
            damageModificator
          );
        }

        if (obsticle.boss === unit.boss && obsticleId !== unitId) {
          damageModificator += 40;
          debug(
            'countDamageModificator - attacker obsticle: damageModificator:',
            damageModificator
          );
        }
      });

      ctx.damageModificator = damageModificator;
      debug('countDamageModificator: damageModificator:', damageModificator);
      countUnitTotalDamage(ctx);
    }

    function countUnitTotalDamage(ctx) {
      const unit = ctx.unit;
      const damageMax = unit.unitStats.current.damageMax;
      const damageMin = unit.unitStats.current.damageMin;
      const unitAmount = unit.amount;
      debug('countUnitTotalDamage: unitAmount:', unitAmount);
      const damageModificator = ctx.damageModificator / 100;
      debug('countUnitTotalDamage: damageModificator:', damageModificator);

      debug('countUnitTotalDamage: damageMax:', damageMax);
      debug('countUnitTotalDamage: damageMin:', damageMin);

      const randomDamage = _.random(damageMin, damageMax);
      debug('countUnitTotalDamage: randomDamage:', randomDamage);
      debug(
        'countUnitTotalDamage: totalDamage = ',
        randomDamage,
        ' * ',
        unitAmount,
        ' * ',
        damageModificator
      );
      const totalDamage = randomDamage * unitAmount * damageModificator;
      debug('countUnitTotalDamage: totalDamage:', totalDamage);
      ctx.totalDamage = totalDamage;
      countTargetLoss(ctx);
    }

    function countTargetLoss(ctx) {
      const target = ctx.target;
      debug('countTargetLoss: target.unitName', target.unitName);
      const targetLife = target.unitStats.base.life;
      debug('countTargetLoss: targetLife', targetLife);
      const totalDamage = ctx.totalDamage;
      const targetUnitsKilled = _.floor(totalDamage / targetLife);
      debug('countTargetLoss: targetUnitsKilled', targetUnitsKilled);
      const healthLeft = totalDamage % targetLife;
      debug('countTargetLoss: healthLeft', healthLeft);

      ctx.targetUnitsKilled = targetUnitsKilled;
      ctx.healthLeft = healthLeft;
    }
  };
};
