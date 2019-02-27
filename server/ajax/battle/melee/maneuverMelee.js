// @format

'use strict';

const debug = require('debug')('cogs:maneuverMelee');
const _ = require('lodash');
const validator = require('validator');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Check is melee attack possible, deal damage and update target unit'
      );

      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.entityId = res.locals.entityId;
      ctx.unit = entities[ctx.entityId];

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
      debug(
        'checkRequestBodyMeleeOnPosition: meleeOnPosition',
        meleeOnPosition
      );
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

      debug('checkIsMeleePositionInRange: Yes, melee attack in range!');
      checkIsUnitOnMeleePosition(ctx);
    }

    function checkIsUnitOnMeleePosition(ctx) {
      const entities = res.locals.entities;
      const meleeOnPosition = ctx.meleeOnPosition;

      let targetId;
      _.forEach(entities, (entity, id) => {
        if (entity.unitName) {
          if (
            entity.position.x === meleeOnPosition.x &&
            entity.position.y === meleeOnPosition.y
          ) {
            debug('checkIsUnitOnMeleePosition: Yes, target found:', id);
            targetId = id;
          }
        }
      });

      if (!targetId) {
        debug(
          'checkIsUnitOnMeleePosition - No target found on: meleeOnPosition:',
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
      const target = ctx.target;
      if (target.boss === unit.boss) {
        debug('checkIsTragetFriendly: Cannot attack friendly unit');
        return;
      }

      debug('checkIsTragetFriendly: Target unit is enemy!');
      scanObsticlesAroundTarget(ctx);
    }

    function scanObsticlesAroundTarget(ctx) {
      const entities = res.locals.entities;
      const target = ctx.target;
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
            }
          });
        }
      });

      debug(
        'scanObsticlesAroundTarget: obsticlesAroundTarget:',
        obsticlesAroundTarget.length
      );
      ctx.obsticlesAroundTarget = obsticlesAroundTarget;
      calculateDamageModificator(ctx);
    }

    function calculateDamageModificator(ctx) {
      let damageModificator = 100;
      const obsticlesAroundTarget = ctx.obsticlesAroundTarget;
      const entityId = ctx.entityId;
      const unit = ctx.unit;
      const entities = res.locals.entities;

      obsticlesAroundTarget.forEach((obsticleId) => {
        const obsticle = entities[obsticleId];
        if (!obsticle.unitStats) {
          damageModificator += 20;
        }

        if (unit.boss === obsticle.boss && obsticleId !== entityId) {
          damageModificator += 40;
        }
      });

      ctx.damageModificator = damageModificator;
      debug(
        'calculateDamageModificator: damageModificator:',
        damageModificator
      );
      calculateUnitDamageSum(ctx);
    }

    function calculateUnitDamageSum(ctx) {
      const unit = ctx.unit;
      const damageMax = unit.unitStats.current.damageMax;
      const damageMin = unit.unitStats.current.damageMin;
      const unitAmount = unit.amount;
      const damageModificator = ctx.damageModificator / 100;

      const randomDamage = _.random(damageMin, damageMax);
      debug(
        'calculateUnitDamageSum: damageSum = ',
        randomDamage,
        ' * ',
        unitAmount,
        ' * ',
        damageModificator
      );
      const damageSum = Math.floor(
        randomDamage * unitAmount * damageModificator
      );
      debug('countUnitDamage: damageSum:', damageSum);
      ctx.damageSum = damageSum;
      calculateTargetLifeSum(ctx);
    }

    function calculateTargetLifeSum(ctx) {
      const target = ctx.target;

      const targetAmount = target.amount;
      const targetCurrentLife = target.unitStats.current.life;
      const targetBaseLife = target.unitStats.base.life;

      const targetLifeSum =
        (targetAmount - 1) * targetBaseLife + targetCurrentLife;

      debug('calculateTargetLifeSum: targetLifeSum:', targetLifeSum);

      ctx.targetLifeSum = targetLifeSum;
      calculateTargetUnitsRemaining(ctx);
    }

    function calculateTargetUnitsRemaining(ctx) {
      const target = ctx.target;
      const damageSum = ctx.damageSum;
      const targetLifeSum = ctx.targetLifeSum;

      const targetLifeSumRemaining = targetLifeSum - damageSum;

      if (targetLifeSumRemaining < 1) {
        debug('calculateTargetUnitsRemaining: Unit should DIE!');
        updateUnsetUnitEntitiy(ctx);
        return;
      }

      const targetBaseLife = target.unitStats.base.life;
      const targetUnitsRemaining = _.ceil(
        targetLifeSumRemaining / targetBaseLife
      );

      const lifeRemaining = targetLifeSumRemaining % targetBaseLife;

      ctx.targetUnitsRemaining = targetUnitsRemaining;
      ctx.lifeRemaining = lifeRemaining;

      debug('calculateTargetUnitsRemaining: lifeRemaining', lifeRemaining);
      updateSetTargetAmount(ctx);
    }

    function updateSetTargetAmount(ctx) {
      const gameId = ctx.gameId;
      const targetId = ctx.targetId;
      const lifeRemaining = ctx.lifeRemaining;
      const targetUnitsRemaining = ctx.targetUnitsRemaining;

      const query = { _id: gameId };

      const recentActivity = {};
      recentActivity.name = 'gotHit';
      recentActivity.timestamp = Date.now();

      const fieldRecentActivity = targetId + '.recentActivity';
      const fieldLife = targetId + '.unitStats.current.life';
      const fieldAmount = targetId + '.amount';

      const $set = {};
      $set[fieldRecentActivity] = recentActivity;
      $set[fieldLife] = lifeRemaining;
      $set[fieldAmount] = targetUnitsRemaining;

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetTargetAmount: error: ', error);
          }

          debug('updateSetTargetAmount: Target life and amount updated!');
          next();
        }
      );
    }

    function updateUnsetUnitEntitiy(ctx) {
      const gameId = ctx.gameId;
      const targetId = ctx.targetId;
      debug('updateUnsetUnitEntitiy: targetId:', targetId);
      const target = ctx.target;
      const position = target.position;
      const unitName = target.unitName;

      const query = { _id: gameId };

      const recentActivity = {};
      recentActivity.name = 'justDied';
      recentActivity.timestamp = Date.now();

      const field = targetId;
      const $set = {};
      $set[field] = {
        unitName: unitName,
        position: position,
        recentActivity: recentActivity,
        dead: true
      };

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateUnsetUnitEntitiy: error: ', error);
          debug('updateUnsetUnitEntitiy: query: ', query);
          debug('updateUnsetUnitEntitiy: update: ', update);
          debug('updateUnsetUnitEntitiy: Target was killed');
          next();
        }
      );
    }
  };
};
