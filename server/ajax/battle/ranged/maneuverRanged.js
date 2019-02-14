// @format

'use strict';

const debug = require('debug')('cogs:maneuverMelee');
const _ = require('lodash');
const validator = require('validator');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Check is ranged attack possible, deal damage and update target unit'
      );

      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.unitId = res.locals.unitId;
      ctx.unit = entities[ctx.unitId];

      checkRequestBodyRangedPath(ctx);
    })();

    function checkRequestBodyRangedPath(ctx) {
      const rangedPath = [];
      let isError = false;

      req.body.rangedPath.forEach((position) => {
        if (
          typeof position.x === 'undefined' ||
          typeof position.y === 'undefined' ||
          !validator.isNumeric(position.x) ||
          !validator.isNumeric(position.y)
        ) {
          debug('POST parameter rangedPath not valid!');
          isError = true;
          return;
        }

        const parsedTile = {};
        parsedTile.x = parseInt(position.x, 10);
        parsedTile.y = parseInt(position.y, 10);
        rangedPath.push(parsedTile);
      });

      if (isError) {
        return;
      }
      ctx.rangedPath = rangedPath;

      debug('checkRequestBodyUnitJourney: rangedPath', rangedPath);
      checkIsUnitOnShootPosition(ctx);
    }

    function checkIsUnitOnShootPosition(ctx) {
      const entities = res.locals.entities;
      const shootPosition = ctx.rangedPath[ctx.rangedPath.length - 1];

      let targetId;
      _.forEach(entities, (entity, id) => {
        if (entity.unitName) {
          if (
            entity.position.x === shootPosition.x &&
            entity.position.y === shootPosition.y
          ) {
            debug('checkIsUnitOnShootPosition: Yes, target found:', id);
            targetId = id;
          }
        }
      });

      if (!targetId) {
        debug(
          'checkIsUnitOnShootPosition - No target found on:',
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
      const rangedPath = ctx.rangedPath;
      const obsticlesOnRangedPath = [];

      _.forEach(entities, (entity, id) => {
        if (entity.unitName) {
          rangedPath.forEach((position) => {
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
      countDamageModificator(ctx);
    }

    function countDamageModificator(ctx) {
      const negativeObsticles = ctx.negativeObsticles;
      let damageModificator = 1;

      if (negativeObsticles === 1) {
        damageModificator = 0.5;
      }

      if (negativeObsticles === 2) {
        damageModificator = 0.3;
      }

      if (negativeObsticles > 2) {
        damageModificator = 0.1;
      }

      ctx.damageModificator = damageModificator;
      debug('countDamageModificator: damageModificator:', damageModificator);
      countUnitDamageSum(ctx);
    }

    function countUnitDamageSum(ctx) {
      const unit = ctx.unit;
      const damageMax = unit.unitStats.current.damageMax;
      const damageMin = unit.unitStats.current.damageMin;
      const unitAmount = unit.amount;
      const damageModificator = ctx.damageModificator;

      const randomDamage = _.random(damageMin, damageMax);
      debug(
        'countUnitDamageSum: damageSum = ',
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
      countTargetLifeSum(ctx);
    }

    function countTargetLifeSum(ctx) {
      const target = ctx.target;

      const targetAmount = target.amount;
      const targetCurrentLife = target.unitStats.current.life;
      const targetBaseLife = target.unitStats.base.life;

      const targetLifeSum =
        (targetAmount - 1) * targetBaseLife + targetCurrentLife;

      debug('countTargetLifeSum: targetLifeSum:', targetLifeSum);

      ctx.targetLifeSum = targetLifeSum;
      countTargetUnitsRemaining(ctx);
    }

    function countTargetUnitsRemaining(ctx) {
      const target = ctx.target;
      const damageSum = ctx.damageSum;
      const targetLifeSum = ctx.targetLifeSum;

      const targetLifeSumRemaining = targetLifeSum - damageSum;

      if (targetLifeSumRemaining < 1) {
        debug('countTargetUnitsRemaining: Unit should DIE!');
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

      debug('countTargetUnitsRemaining: lifeRemaining', lifeRemaining);
      debug(
        'countTargetUnitsRemaining: targetUnitsRemaining',
        targetUnitsRemaining
      );
      updateTargetAmount(ctx);
    }

    function updateTargetAmount(ctx) {
      const gameId = ctx.gameId;
      const targetId = ctx.targetId;
      const lifeRemaining = ctx.lifeRemaining;
      const targetUnitsRemaining = ctx.targetUnitsRemaining;

      const query = { _id: gameId };
      const fieldLife = targetId + '.unitStats.current.life';
      const fieldAmount = targetId + '.amount';
      const $set = {};
      $set[fieldLife] = lifeRemaining;
      $set[fieldAmount] = targetUnitsRemaining;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateTargetAmount: error: ', error);
          debug('updateTargetAmount: Target life and amount updated!');
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
          debug('updateUnsetUnitEntitiy: error: ', error);
          debug('updateUnsetUnitEntitiy: Target was killed');
          next();
        }
      );
    }
  };
};
