// @format

'use strict';

const debug = require('debug')('cogs:recruitUnitPost.js');
const _ = require('lodash');

module.exports = (db, blueprint) => {
  return (req, res, next) => {
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
      findPlayerCurrentResources(ctx);
    }

    function findPlayerCurrentResources(ctx) {
      const entities = ctx.entities;
      const playerId = ctx.playerId;
      const player = entities[playerId];
      const playerResources = player.playerResources;

      ctx.playerResources = playerResources;
      debug('findPlayerCurrentResources: playerResources:', playerResources);
      checkCanPlayerAffordUnit(ctx);
    }

    function checkCanPlayerAffordUnit(ctx) {
      const playerResources = ctx.playerResources;
      const unitCost = ctx.unitCost;
      let canPlayerAffordUnit = true;

      _.forEach(unitCost, (cost, resource) => {
        if (playerResources[resource] < cost) {
          canPlayerAffordUnit = false;
          debug('checkCanPlayerAffordUnit: Not enough:', resource);
        }
      });

      if (!canPlayerAffordUnit) {
        res.status(503);
        res.send({
          error: 'This unit is too expensive!'
        });
        debug(
          'checkCanPlayerAffordUnit: This unit is too expensive!',
          unitCost
        );
        debug('******************** error ********************');
        return;
      }

      debug('checkCanPlayerAffordUnit: Yes!');
      substractUnitCostFromPlayerResources(ctx);
    }

    function substractUnitCostFromPlayerResources(ctx) {
      const unitCost = ctx.unitCost;
      const playerResources = ctx.playerResources;

      _.forEach(unitCost, (cost, resource) => {
        playerResources[resource] -= cost;
      });

      debug('substractUnitCostFromPlayerResources: Substracted!');

      ctx.playerResourcesAfterRecruit = playerResources;
      updateSetPlayerResources(ctx);
    }

    function updateSetPlayerResources(ctx) {
      const gameId = ctx.gameId;
      const playerId = ctx.playerId;
      const playerResourcesAfterRecruit = ctx.playerResourcesAfterRecruit;
      const $set = {};

      _.forEach(playerResourcesAfterRecruit, (amount, resource) => {
        const field = playerId + '.playerResources.' + resource;
        $set[field] = amount;
      });

      const query = { _id: gameId };

      const update = { $set: $set };
      const options = {};
      debug('updateSetPlayerResources: $set:', $set);

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
          next();
        }
      );
    }
  };
};
