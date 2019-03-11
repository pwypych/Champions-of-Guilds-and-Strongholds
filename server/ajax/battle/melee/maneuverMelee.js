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

      checkUnitSkill(ctx);
    })();

    function checkUnitSkill(ctx) {
      const unit = ctx.unit;
      if (!unit.unitStats.current.maneuvers.melee) {
        debug('checkUnitSkill: Unit does not have "melee" skill!');
        return;
      }

      debug('checkUnitSkill: Unit has "melee" skill!');
      checkRequestBodyMeleeOnPosition(ctx);
    }

    function checkRequestBodyMeleeOnPosition(ctx) {
      const meleeOnPosition = req.body.meleeOnPosition;

      if (
        typeof meleeOnPosition.x === 'undefined' ||
        typeof meleeOnPosition.y === 'undefined' ||
        !validator.isNumeric(meleeOnPosition.x) ||
        !validator.isNumeric(meleeOnPosition.y)
      ) {
        debug(
          'checkRequestBodyMeleeOnPosition: POST parameter meleeOnPosition not valid!'
        );
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

      [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
      ].forEach((offset) => {
        if (
          meleeOnPosition.x === unit.position.x + offset.x &&
          meleeOnPosition.y === unit.position.y + offset.y
        ) {
          debug('checkIsMeleePositionInRange: Yes, attack possible!');
          checkIsUnitOnMeleePosition(ctx);
        }
      });

      debug('checkIsMeleePositionInRange: No, cannot attack this position!');
    }

    function checkIsUnitOnMeleePosition(ctx) {
      const entities = res.locals.entities;
      const meleeOnPosition = ctx.meleeOnPosition;

      let targetId;
      _.forEach(entities, (entity, id) => {
        if (entity.unitName && !entity.dead) {
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
          'checkIsUnitOnMeleePosition: No target found! meleeOnPosition:',
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
        debug('checkIsTragetFriendly: Cannot attack friendly unit!');
        debug('checkIsTragetFriendly: Attacker:', unit);
        debug('checkIsTragetFriendly: Defender:', target);
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
        if (entity.unitName && !entity.dead) {
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
      let damageModificator = 1;
      const obsticlesAroundTarget = ctx.obsticlesAroundTarget;
      const entityId = ctx.entityId;
      const unit = ctx.unit;
      const entities = res.locals.entities;

      obsticlesAroundTarget.forEach((obsticleId) => {
        const obsticle = entities[obsticleId];
        if (!obsticle.unitStats) {
          damageModificator += 0.2;
        }

        if (unit.boss === obsticle.boss && obsticleId !== entityId) {
          damageModificator += 0.4;
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
      const unitAmount = unit.amount;
      const damageModificator = ctx.damageModificator;
      const damage = unit.unitStats.current.maneuvers.melee.damage;

      debug(
        'calculateUnitDamageSum: damageSum = ',
        damage,
        ' * ',
        unitAmount,
        ' * ',
        damageModificator
      );
      const damageSum = Math.floor(damage * unitAmount * damageModificator);
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
        updateUnitThatDied(ctx);
        return;
      }

      const targetBaseLife = target.unitStats.base.life;
      const targetUnitsRemaining = _.ceil(
        targetLifeSumRemaining / targetBaseLife
      );

      const damageRemaining = damageSum % targetBaseLife;

      ctx.targetUnitsRemaining = targetUnitsRemaining;
      ctx.lifeRemaining = targetBaseLife - damageRemaining;

      debug('calculateTargetUnitsRemaining: damageRemaining', damageRemaining);
      debug('calculateTargetUnitsRemaining: lifeRemaining', ctx.lifeRemaining);
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

    function updateUnitThatDied(ctx) {
      const gameId = ctx.gameId;
      const targetId = ctx.targetId;
      debug('updateUnitThatDied: targetId:', targetId);
      const target = ctx.target;
      const position = target.position;
      const unitName = target.unitName;
      const owner = target.owner;
      const boss = target.boss;

      const query = { _id: gameId };

      const recentActivity = {};
      recentActivity.name = 'justDied';
      recentActivity.timestamp = Date.now();

      const field = targetId;
      const $set = {};
      $set[field] = {
        unitName: unitName,
        position: position,
        owner: owner,
        boss: boss,
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
          if (error) {
            debug('updateUnitThatDied: error: ', error);
          }

          debug('updateUnitThatDied: Target was killed');
          next();
        }
      );
    }
  };
};
