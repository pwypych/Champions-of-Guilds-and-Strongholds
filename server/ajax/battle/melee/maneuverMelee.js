// @format

'use strict';

const debug = require('debug')('cogs:maneuverMelee');
const _ = require('lodash');
const validator = require('validator');

// What does this module do?
// Exept
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
      const target = entities[ctx.targetId];
      ctx.target = target;
      checkIsTragetFriendly(ctx);
    }

    function checkIsTragetFriendly(ctx) {
      const unit = ctx.unit;
      debug('checkIsTragetFriendly: unit.boss:', unit.boss);
      const target = ctx.target;
      debug('checkIsTragetFriendly: target.boss:', target.boss);
      if (target.boss === unit.boss) {
        debug('checkIsTragetFriendly: Cannot attack friendly unit');
        return;
      }

      scanObsticlesAroundTarget(ctx);
    }

    function scanObsticlesAroundTarget(ctx) {
      const entities = res.locals.entities;
      const target = ctx.target;
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
      const damageModificator = ctx.damageModificator / 100;
      debug('countUnitTotalDamage: damageModificator:', damageModificator);

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
      countTargetTotalLife(ctx);
    }

    function countTargetTotalLife(ctx) {
      const target = ctx.target;
      const targetUnits = target.amount;
      const targetCurrentLife = target.unitStats.current.life;
      const targetBaseLife = target.unitStats.base.life;
      const targetTotalLife =
        (targetUnits - 1) * targetBaseLife + targetCurrentLife;
      debug('countTargetTotalLife: targetTotalLife:', targetTotalLife);

      ctx.targetTotalLife = targetTotalLife;
      countTargetLoss(ctx);
    }

    function countTargetLoss(ctx) {
      // Count also unit current life
      const target = ctx.target;
      const totalDamage = ctx.totalDamage;
      const targetTotalLife = ctx.targetTotalLife;
      const targetBaseLife = target.unitStats.base.life;
      const targetTotalLifeLeft = targetTotalLife - totalDamage;
      debug('countTargetLoss: targetTotalLifeLeft', targetTotalLifeLeft);

      if (targetTotalLifeLeft < 1) {
        debug('countTargetLoss: Unit should DIE!');
        updateUnsetUnitEntitiy(ctx);
        return;
      }

      let targetUnitsLeft = _.floor(targetTotalLifeLeft / targetBaseLife);
      if (targetUnitsLeft === 0) {
        debug('countTargetLoss: One unit left');
        targetUnitsLeft = 1;
      }
      debug('countTargetLoss: targetUnitsLeft', targetUnitsLeft);

      const healthLeft = targetTotalLifeLeft % targetBaseLife;
      debug('countTargetLoss: healthLeft', healthLeft);

      ctx.targetUnitsLeft = targetUnitsLeft;
      ctx.healthLeft = healthLeft;

      updateTargetuUnitAmount(ctx);
    }

    function updateTargetuUnitAmount(ctx) {
      debug('updateTargetuUnitAmount: ctx:', ctx);
      const gameId = ctx.gameId;
      const targetId = ctx.targetId;
      const healthLeft = ctx.healthLeft;
      const targetUnitsLeft = ctx.targetUnitsLeft;

      const query = { _id: gameId };
      const fieldLife = targetId + '.unitStats.current.life';
      const fieldAmount = targetId + '.amount';
      const $set = {};
      $set[fieldLife] = healthLeft;
      $set[fieldAmount] = targetUnitsLeft;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('setProcessingJourneyUntilTimestamp: error: ', error);
          next();
        }
      );
    }

    function updateUnsetUnitEntitiy(ctx) {
      const gameId = ctx.gameId;
      const targetId = ctx.targetId;

      const query = { _id: gameId };
      const field = targetId;
      const $unset = {};
      $unset[field] = true;
      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: update mongo error:', error);
          }

          debug('updateUnsetUnitEntitiy: Target was killed');
          next();
        }
      );
    }
  };
};
