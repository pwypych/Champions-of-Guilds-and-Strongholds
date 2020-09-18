// @format

'use strict';

const debug = require('debug')('cogs:buildFortificationPost.js');
const _ = require('lodash');
const shortId = require('shortid');

module.exports = (db, blueprint) => {
  return (req, res, next) => {
    (function init() {
      debug('// Endpoint, build one fortification in castle by given name');

      const ctx = {};
      ctx.entities = res.locals.entities;
      ctx.gameId = res.locals.entities._id;
      ctx.playerId = res.locals.playerId;
      const player = ctx.entities[ctx.playerId];
      ctx.playerResources = player.playerResources;
      validateRequestBody(ctx);
    })();

    function validateRequestBody(ctx) {
      const fortificationName = req.body.fortificationName;
      const fortificationBlueprint = blueprint.fortification[fortificationName];

      if (!fortificationBlueprint) {
        res.status(503);
        res.send({
          error: 'This fortification not exists!'
        });
        debug(
          'validateRequestBody: This fortification not exists!',
          fortificationName
        );
        debug('******************** error ********************');
        return;
      }

      ctx.fortificationBlueprint = fortificationBlueprint;
      ctx.fortificationName = fortificationName;
      debug('validateFortificationName: fortificationName:', fortificationName);
      checkFortificationAndPlayerRace(ctx);
    }

    function checkFortificationAndPlayerRace(ctx) {
      debug(
        'validateFortificationName: ctx.fortificationBlueprint:',
        ctx.fortificationBlueprint
      );
      const playerId = ctx.playerId;
      const player = ctx.entities[playerId];
      const playerRace = player.playerData.race;
      const fortificationRace = ctx.fortificationBlueprint.race;

      if (playerRace !== fortificationRace) {
        res.status(503);
        res.send({
          error: 'This fortification is not from player race!'
        });
        debug(
          'checkFortificationAndPlayerRace: This fortification is not from player race!'
        );
        debug('******************** error ********************');
        return;
      }

      debug('checkFortificationAndPlayerRace: playerRace:', playerRace);
      checkIsFortificationAlreadyBuild(ctx);
    }

    function checkIsFortificationAlreadyBuild(ctx) {
      const fortificationName = ctx.fortificationName;
      const entities = ctx.entities;
      const playerId = ctx.playerId;

      let isBuild = false;

      _.forEach(entities, (entity) => {
        if (
          entity.fortificationName === fortificationName &&
          entity.owner === playerId
        ) {
          isBuild = true;
        }
      });

      if (isBuild) {
        res.status(503);
        res.send({
          error: 'This fortification is already build!'
        });
        debug(
          'checkIsFortificationAlreadyBuild: This fortification is already build!',
          fortificationName
        );
        debug('******************** error ********************');
        return;
      }

      debug('checkIsFortificationAlreadyBuild: Not build, proceed!');
      checkCanPlayerAffordFortification(ctx);
    }

    function checkCanPlayerAffordFortification(ctx) {
      const fortificationBlueprint = ctx.fortificationBlueprint;
      const fortificationCost = fortificationBlueprint.cost;
      const playerResources = ctx.playerResources;
      let canPlayerAffordFortification = true;

      _.forEach(fortificationCost, (cost, resource) => {
        if (playerResources[resource] < cost) {
          canPlayerAffordFortification = false;
          debug('checkCanPlayerAffordFortification: Not enough:', resource);
        }
      });

      if (!canPlayerAffordFortification) {
        res.status(503);
        res.send({
          error: 'This fortification is too expensive!'
        });
        debug(
          'checkCanPlayerAffordFortification: This fortification is too expensive!',
          fortificationCost
        );
        debug('******************** error ********************');
        return;
      }

      debug('checkCanPlayerAffordFortification: Yes!');

      substractFortificationCostFromPlayerResources(ctx);
    }

    function substractFortificationCostFromPlayerResources(ctx) {
      const fortificationCost = ctx.fortificationBlueprint.cost;
      const playerResources = ctx.playerResources;

      _.forEach(fortificationCost, (cost, resource) => {
        playerResources[resource] -= cost;
      });

      debug('substractFortificationCostFromPlayerResources: Substracted!');

      ctx.playerResourcesAfterBuild = playerResources;
      updateSetPlayerResources(ctx);
    }

    function updateSetPlayerResources(ctx) {
      const gameId = ctx.gameId;
      const playerId = ctx.playerId;
      const playerResourcesAfterBuild = ctx.playerResourcesAfterBuild;
      const $set = {};

      _.forEach(playerResourcesAfterBuild, (amount, resource) => {
        const field = playerId + '.playerResources.' + resource;
        $set[field] = amount;
      });

      const query = { _id: gameId };

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
          generateFortificationEntity(ctx);
        }
      );
    }

    function generateFortificationEntity(ctx) {
      const playerId = ctx.playerId;
      const fortificationName = ctx.fortificationName;

      const fortificationId =
        'fortification_' + fortificationName + '__' + shortId.generate();

      const fortification = {};
      fortification.fortificationName = fortificationName;
      fortification.owner = playerId;

      debug('generateFortificationEntity: fortification:', fortification);

      ctx.fortification = fortification;
      ctx.fortificationId = fortificationId;
      updateSetFortificationEntity(ctx);
    }

    function updateSetFortificationEntity(ctx) {
      const entities = ctx.entities;
      const gameId = entities._id;
      const fortification = ctx.fortification;
      const fortificationId = ctx.fortificationId;

      const $set = {};
      $set[fortificationId] = fortification;

      const query = { _id: gameId };
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetFortificationEntity: error:', error);
          }

          debug('updateSetFortificationEntity: Success!');
          generateEnchantment(ctx);
        }
      );
    }

    function generateEnchantment(ctx) {
      const playerId = ctx.playerId;
      const fortificationId = ctx.fortificationId;
      const fortificationBlueprint = ctx.fortificationBlueprint;

      const enchantmentId = 'enchantment_income__' + shortId.generate();
      const enchantment = {};
      enchantment.owner = playerId;
      enchantment.enchanter = fortificationId;
      if (fortificationBlueprint.income) {
        enchantment.income = {};
        enchantment.income.name = fortificationBlueprint.income.name;
        enchantment.income.amount = fortificationBlueprint.income.amount;
      }

      debug('generateEnchantment: enchantment:', enchantment);

      ctx.enchantment = enchantment;
      ctx.enchantmentId = enchantmentId;
      updateSetEnchantmentEntity(ctx);
    }

    function updateSetEnchantmentEntity(ctx) {
      const entities = ctx.entities;
      const gameId = entities._id;
      const enchantment = ctx.enchantment;
      const enchantmentId = ctx.enchantmentId;

      const $set = {};
      $set[enchantmentId] = enchantment;

      const query = { _id: gameId };
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetEnchantmentEntity: error:', error);
          }

          debug('updateSetEnchantmentEntity: Success!');
          sendResponse();
        }
      );
    }

    function sendResponse() {
      debug('sendResponse: No Errors!');
      res.send({ error: 0 });
      next();
    }
  };
};
