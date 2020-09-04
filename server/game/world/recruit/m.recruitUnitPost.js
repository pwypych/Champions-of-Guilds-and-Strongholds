// @format

'use strict';

const debug = require('debug')('cogs:recruitUnitPost.js');
const _ = require('lodash');

module.exports = (db, blueprint) => {
  return (req, res) => {
    (function init() {
      debug('// Endpoint, recruit one unit by given unitName');
      const ctx = {};
      ctx.entities = res.locals.entities;
      ctx.gameId = res.locals.entities._id;
      ctx.playerId = res.locals.playerId;

      findHeroUnitAmounts(ctx);
    })();

    function findHeroUnitAmounts(ctx) {
      const entities = ctx.entities;
      const playerId = ctx.playerId;
      let unitAmounts;

      _.forEach(entities, (entity) => {
        if (entity.heroStats && entity.owner === playerId) {
          unitAmounts = entity.unitAmounts;
        }
      });

      ctx.unitAmounts = unitAmounts;
      checkCanPlayerRecruitUnit(ctx);
    }

    function checkCanPlayerRecruitUnit(ctx) {
      const unitAmounts = ctx.unitAmounts;
      const unitName = req.body.unitName;
      let canPlayerRecruitUnit = false;

      _.forEach(unitAmounts, (amount, heroUnitName) => {
        if (unitName === heroUnitName) {
          canPlayerRecruitUnit = true;
        }
      });

      if (!canPlayerRecruitUnit) {
        res.status(503);
        res.send({
          error: 'This unit is not from player race!'
        });
        debug(
          'checkCanPlayerRecruitUnit: This unit is not from player race!',
          unitName
        );
        debug('******************** error ********************');
        return;
      }

      findRecruitUnitCost(ctx);
    }

    function findRecruitUnitCost(ctx) {
      const unitName = req.body.unitName;
      const recruitUnit = blueprint.unit[unitName];
      debug('findRecruitUnitCost: recruitUnit:', recruitUnit);

      if (!recruitUnit) {
        res.status(503);
        res.send({
          error: 'Wrong recruit name!'
        });
        debug('findRecruitUnitCost: This unit not exist!', unitName);
        debug('******************** error ********************');
        return;
      }

      ctx.unitCost = recruitUnit.cost;
      ctx.unitName = unitName;
      debug('findRecruitUnitCost: recruitUnit.cost', recruitUnit.cost);
      findPlayerCurrentGold(ctx);
    }

    function findPlayerCurrentGold(ctx) {
      const entities = ctx.entities;
      const playerId = ctx.playerId;
      const player = entities[playerId];
      const playerGold = player.playerResources.gold;

      ctx.playerGold = playerGold;
      debug('findPlayerCurrentGold: playerGold:', playerGold);
      checkCanPlayerAffordUnit(ctx);
    }

    function checkCanPlayerAffordUnit(ctx) {
      const playerGold = ctx.playerGold;
      const unitCost = ctx.unitCost;
      const unitName = ctx.unitName;
      let message = '';

      const playerGoldRemaining = playerGold - unitCost;

      if (playerGoldRemaining < 0) {
        message =
          'Cannot afford ' + unitName + ' it cost: ' + unitCost + ' gold.';
        res.send({
          error: 1,
          message: message
        });
        debug('checkCanPlayerAffordUnit:', message);
        debug('******************** error ********************');
        return;
      }

      message = '1 ' + unitName + ' bought for ' + unitCost + ' gold.';
      res.send({
        error: 0,
        message: message
      });

      ctx.playerGoldRemaining = playerGoldRemaining;
      debug('checkCanPlayerAffordUnit: Yes!');
      updateSetPlayerResources(ctx);
    }

    function updateSetPlayerResources(ctx) {
      const gameId = ctx.gameId;
      const playerId = ctx.playerId;
      const playerGoldRemaining = ctx.playerGoldRemaining;

      const query = { _id: gameId };
      const field = playerId + '.playerResources.gold';
      const $set = {};
      $set[field] = playerGoldRemaining;

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: insert mongo error:', error);
          }

          debug('updateSetPlayerResources: Success!');
          findHeroId(ctx);
        }
      );
    }

    function findHeroId(ctx) {
      const entities = ctx.entities;
      const playerId = ctx.playerId;
      let heroId;

      _.forEach(entities, (entity, id) => {
        if (entity.heroStats && entity.owner === playerId) {
          heroId = id;
        }
      });

      ctx.heroId = heroId;
      debug('findHeroId: heroId:', heroId);
      updateIncrementHeroUnits(ctx);
    }

    function updateIncrementHeroUnits(ctx) {
      const gameId = ctx.gameId;
      const heroId = ctx.heroId;
      const unitName = ctx.unitName;

      const query = { _id: gameId };
      const field = heroId + '.unitAmounts.' + unitName;
      const $inc = {};
      $inc[field] = 1;

      const update = { $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: insert mongo error:', error);
          }

          debug('updateIncrementHeroUnits: unitName: +1', unitName);
        }
      );
    }
  };
};
