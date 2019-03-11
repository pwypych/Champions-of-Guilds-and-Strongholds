// @format

'use strict';

const debug = require('debug')('cogs:maneuverShoot');
const _ = require('lodash');
const validator = require('validator');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Check is shoot attack possible, deal damage and update target unit'
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
      if (!unit.unitStats.current.maneuvers.shoot) {
        debug('checkUnitSkill: Unit does not have "shoot" skill!');
        return;
      }

      debug('checkUnitSkill: Unit has "shoot" skill!');
      checkRequestBodyShootPath(ctx);
    }

    function checkRequestBodyShootPath(ctx) {
      const shootPath = [];
      let isError = false;

      req.body.shootPath.forEach((position) => {
        if (
          typeof position.x === 'undefined' ||
          typeof position.y === 'undefined' ||
          !validator.isNumeric(position.x) ||
          !validator.isNumeric(position.y)
        ) {
          debug('POST parameter shootPath not valid!');
          isError = true;
          return;
        }

        const parsedPosition = {};
        parsedPosition.x = parseInt(position.x, 10);
        parsedPosition.y = parseInt(position.y, 10);
        shootPath.push(parsedPosition);
      });

      if (isError) {
        return;
      }
      ctx.shootPath = shootPath;

      debug('checkRequestBodyShootPath: shootPath', shootPath);
      checkIsTargetOnShootPosition(ctx);
    }

    function checkIsTargetOnShootPosition(ctx) {
      const entities = res.locals.entities;
      const shootPosition = ctx.shootPath[ctx.shootPath.length - 1];

      let targetId;
      _.forEach(entities, (entity, id) => {
        if (entity.unitName) {
          if (
            entity.position.x === shootPosition.x &&
            entity.position.y === shootPosition.y
          ) {
            debug('checkIsTargetOnShootPosition: Yes, target found:', id);
            targetId = id;
          }
        }
      });

      if (!targetId) {
        debug(
          'checkIsTargetOnShootPosition - No target found on:',
          shootPosition
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
      findObsticlesOnRangedPath(ctx);
    }

    function findObsticlesOnRangedPath(ctx) {
      const entities = res.locals.entities;
      const shootPath = ctx.shootPath;
      const shootPathWithoutTarget = shootPath;
      shootPathWithoutTarget.pop();
      const obsticlesOnRangedPath = [];

      _.forEach(entities, (entity, id) => {
        if (entity.unitName) {
          shootPathWithoutTarget.forEach((position) => {
            if (
              entity.position.x === position.x &&
              entity.position.y === position.y
            ) {
              obsticlesOnRangedPath.push(id);
            }
          });
        }
      });

      debug(
        'findObsticlesOnRangedPath: obsticlesOnRangedPath:',
        obsticlesOnRangedPath.length
      );
      ctx.obsticlesOnRangedPath = obsticlesOnRangedPath;
      sieveNegativeObsticlesOnRangedPath(ctx);
    }

    function sieveNegativeObsticlesOnRangedPath(ctx) {
      const entities = res.locals.entities;
      const obsticlesOnRangedPath = ctx.obsticlesOnRangedPath;
      const unit = ctx.unit;
      let negativeObsticles = 0;

      _.forEach(obsticlesOnRangedPath, (obsticleId) => {
        const obsticle = entities[obsticleId];
        if (!obsticle.boss || obsticle.boss !== unit.boss) {
          negativeObsticles += 1;
        }
      });

      ctx.negativeObsticles = negativeObsticles;
      debug(
        'sieveNegativeObsticlesOnRangedPath: negativeObsticles:',
        negativeObsticles
      );
      calculateDamageModificator(ctx);
    }

    function calculateDamageModificator(ctx) {
      const negativeObsticles = ctx.negativeObsticles;
      let damageModificator = 1;

      if (negativeObsticles >= 1) {
        damageModificator = 0.2;
      }

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
      const damage = unit.unitStats.current.maneuvers.shoot.damage;

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
