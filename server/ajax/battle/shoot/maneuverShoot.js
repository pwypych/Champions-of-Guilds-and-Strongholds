// @format

'use strict';

const debug = require('debug')('cogs:maneuverShoot');
const _ = require('lodash');
const validator = require('validator');
const bresenham = require('bresenham');

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
      checkRequestBodyMeleeOnPosition(ctx);
    }

    function checkRequestBodyMeleeOnPosition(ctx) {
      const shootOnPosition = req.body.shootOnPosition;

      if (
        typeof shootOnPosition.x === 'undefined' ||
        typeof shootOnPosition.y === 'undefined' ||
        !validator.isNumeric(shootOnPosition.x) ||
        !validator.isNumeric(shootOnPosition.y)
      ) {
        debug(
          'checkRequestBodyMeleeOnPosition: POST parameter shootOnPosition not valid!'
        );
        return;
      }

      shootOnPosition.x = parseInt(shootOnPosition.x, 10);
      shootOnPosition.y = parseInt(shootOnPosition.y, 10);

      ctx.shootOnPosition = shootOnPosition;
      debug(
        'checkRequestBodyMeleeOnPosition: shootOnPosition',
        shootOnPosition
      );
      generateShootPath(ctx);
    }

    function generateShootPath(ctx) {
      const unitPosition = ctx.unit.position;
      const shootOnPosition = ctx.shootOnPosition;

      const shootPath = bresenham(
        unitPosition.x,
        unitPosition.y,
        shootOnPosition.x,
        shootOnPosition.y
      );

      ctx.shootPath = shootPath;
      debug('generateShootPath: shootPath:', shootPath);
      checkIsTargetOnShootPosition(ctx);
    }

    function checkIsTargetOnShootPosition(ctx) {
      const entities = res.locals.entities;
      const shootPosition = ctx.shootPath[ctx.shootPath.length - 1];

      let targetId;
      _.forEach(entities, (entity, id) => {
        if (entity.unitName && !entity.dead) {
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
        debug('checkIsTragetFriendly: Cannot attack friendly unit', target);
        return;
      }

      debug('checkIsTragetFriendly: Target unit is enemy!');
      findObsticlesOnShootPath(ctx);
    }

    function findObsticlesOnShootPath(ctx) {
      const entities = res.locals.entities;
      const shootPath = ctx.shootPath;
      const shootPathWithoutTarget = shootPath;
      shootPathWithoutTarget.pop();
      const entitiesOnShootPath = [];

      shootPathWithoutTarget.forEach((position) => {
        _.forEach(entities, (entity, id) => {
          if (entity.unitName && !entity.dead) {
            if (
              entity.position.x === position.x &&
              entity.position.y === position.y
            ) {
              entitiesOnShootPath.push(id);
            }
          }
        });
      });

      debug(
        'findObsticlesOnShootPath: entitiesOnShootPath:',
        entitiesOnShootPath.length
      );
      ctx.entitiesOnShootPath = entitiesOnShootPath;
      findNegativeObsticlesOnShootPath(ctx);
    }

    function findNegativeObsticlesOnShootPath(ctx) {
      const entities = res.locals.entities;
      const entitiesOnShootPath = ctx.entitiesOnShootPath;
      const unit = ctx.unit;
      let obsticle;
      let obsticlePosition;

      _.forEach(entitiesOnShootPath, (entityId) => {
        const entity = entities[entityId];
        if (!entity.boss || entity.boss !== unit.boss) {
          if (!obsticle) {
            obsticle = entity;
            obsticlePosition = entity.position;
          }
        }
      });

      ctx.obsticlePosition = obsticlePosition;
      debug('findNegativeObsticlesOnShootPath: entityObsticle:', obsticle);
      calculateDamageObsticleModificator(ctx);
    }

    function calculateDamageObsticleModificator(ctx) {
      const obsticlePosition = ctx.obsticlePosition;
      let damageObsticleModificator = 1;

      if (obsticlePosition) {
        damageObsticleModificator = 0.2;
      }

      ctx.damageObsticleModificator = damageObsticleModificator;
      debug(
        'calculateDamageObsticleModificator: damageObsticleModificator:',
        damageObsticleModificator
      );
      calculateDamageGradeModificator(ctx);
    }

    function calculateDamageGradeModificator(ctx) {
      let damageGradeModificator = 1;
      let damageGrade = 'Mid';

      const roll = _.random(1, 100);

      if (roll >= 1 && roll <= 5) {
        damageGradeModificator = 0;
        damageGrade = 'Miss';
      }

      if (roll >= 6 && roll <= 35) {
        damageGradeModificator = 0.5;
        damageGrade = 'Low';
      }

      if (roll >= 36 && roll <= 65) {
        damageGradeModificator = 1;
        damageGrade = 'Mid';
      }

      if (roll >= 66 && roll <= 95) {
        damageGradeModificator = 1.5;
        damageGrade = 'High';
      }

      if (roll >= 96 && roll <= 100) {
        damageGradeModificator = 3;
        damageGrade = 'Crit';
      }

      ctx.damageGradeModificator = damageGradeModificator;
      ctx.damageGrade = damageGrade;

      debug(
        'calculateDamageGradeModificator: damageGradeModificator:',
        damageGradeModificator
      );
      calculateDamageSum(ctx);
    }

    function calculateDamageSum(ctx) {
      const unit = ctx.unit;
      const unitAmount = unit.amount;
      const damageObsticleModificator = ctx.damageObsticleModificator;
      const damageGradeModificator = ctx.damageGradeModificator;
      const damage = unit.unitStats.current.maneuvers.shoot.damage;

      debug(
        'calculateDamageSum: damageSum = ',
        damage,
        ' * ',
        unitAmount,
        ' * ',
        damageObsticleModificator,
        ' * ',
        damageGradeModificator
      );
      const damageSum = Math.floor(
        damage * unitAmount * damageObsticleModificator * damageGradeModificator
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
        updateUnitThatDied(ctx);
        return;
      }

      const targetCurrentLife = target.unitStats.current.life;
      const targetBaseLife = target.unitStats.base.life;
      const targetUnitsRemaining = _.ceil(
        targetLifeSumRemaining / targetBaseLife
      );

      const damageRemaining = damageSum % targetBaseLife;

      ctx.targetUnitsRemaining = targetUnitsRemaining;
      ctx.lifeRemaining = targetCurrentLife - damageRemaining;

      if (ctx.lifeRemaining < 1) {
        ctx.lifeRemaining = targetBaseLife + ctx.lifeRemaining;
      }

      debug('calculateTargetUnitsRemaining: damageRemaining', damageRemaining);
      debug('calculateTargetUnitsRemaining: lifeRemaining', ctx.lifeRemaining);
      updateSetTargetAmount(ctx);
    }

    function updateSetTargetAmount(ctx) {
      const gameId = ctx.gameId;
      const targetId = ctx.targetId;
      const lifeRemaining = ctx.lifeRemaining;
      const targetUnitsRemaining = ctx.targetUnitsRemaining;
      const obsticlePosition = ctx.obsticlePosition;
      const shootFromPosition = ctx.unit.position;
      const damageGrade = ctx.damageGrade;

      const query = { _id: gameId };

      const recentActivity = {};
      recentActivity.name = 'gotShot';
      recentActivity.timestamp = Date.now();
      recentActivity.obsticlePosition = obsticlePosition;
      recentActivity.shootFromPosition = shootFromPosition;
      recentActivity.damageGrade = damageGrade;

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
          setManeuverEndingTurn();
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
      const obsticlePosition = ctx.obsticlePosition;
      const shootFromPosition = ctx.unit.position;
      const damageGrade = ctx.damageGrade;

      const query = { _id: gameId };

      const recentActivity = {};
      recentActivity.name = 'justDiedShot';
      recentActivity.timestamp = Date.now();
      recentActivity.obsticlePosition = obsticlePosition;
      recentActivity.shootFromPosition = shootFromPosition;
      recentActivity.damageGrade = damageGrade;

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
          setManeuverEndingTurn();
        }
      );
    }

    function setManeuverEndingTurn() {
      res.locals.isManeuverEndingTurn = true;
      next();
    }
  };
};
