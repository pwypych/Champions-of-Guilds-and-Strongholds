// @format

'use strict';

const debug = require('debug')('cogs:recruitUnitPost.js');
const _ = require('lodash');

module.exports = (db, unitStats) => {
  return (req, res) => {
    (function init() {
      debug('// Endpoint, recruit one unit by given unitName');
      const ctx = {};
      ctx.entities = res.locals.entities;
      ctx.gameId = res.locals.entities._id;
      ctx.playerId = res.locals.playerId;

      findRecruitUnitCost(ctx);
    })();

    function findRecruitUnitCost(ctx) {
      const unitName = req.body.unitName;
      const recruitUnit = unitStats[unitName];

      if (!recruitUnit) {
        res.status(503);
        res.send({
          error: 'Wrong recruit name!'
        });
        debug('******************** error ********************');
        return;
      }

      ctx.recruitCost = recruitUnit.recruitCost;
      ctx.unitName = unitName;
      debug(
        'findRecruitUnitCost: recruitUnit.recruitCost',
        recruitUnit.recruitCost
      );
      findPlayerCurrentGold(ctx);
    }

    function findPlayerCurrentGold(ctx) {
      const entities = ctx.entities;
      const playerId = ctx.playerId;
      const player = entities[playerId];
      const playerGold = player.playerResources.gold;

      ctx.playerGold = playerGold;
      debug('findPlayerCurrentGold: playerGold:', playerGold);
      checkCanPlayerRecruitUnit(ctx);
    }

    function checkCanPlayerRecruitUnit(ctx) {
      const playerGold = ctx.playerGold;
      const recruitCost = ctx.recruitCost;
      const unitName = ctx.unitName;
      let message = '';

      const playerGoldRemaining = playerGold - recruitCost;

      if (playerGoldRemaining < 0) {
        message =
          'Cannot afford ' + unitName + ' it cost: ' + recruitCost + ' gold.';
        debug('checkCanPlayerRecruitUnit:', message);
        res.send({
          error: 1,
          message: message
        });
        debug('******************** error ********************');
        return;
      }

      message = '1 ' + unitName + ' bought for ' + recruitCost + ' gold.';
      res.send({
        error: 0,
        message: message
      });

      ctx.playerGoldRemaining = playerGoldRemaining;
      debug('checkCanPlayerRecruitUnit: Yes!');
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
      const field = heroId + '.unitCounts.' + unitName;
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
