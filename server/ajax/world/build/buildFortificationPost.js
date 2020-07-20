// @format

'use strict';

const debug = require('debug')('cogs:buildFortificationPost.js');
const _ = require('lodash');
const shortId = require('shortid');

module.exports = (db, blueprint) => {
  return (req, res) => {
    (function init() {
      debug('// Endpoint, build one fortification in castle by given name');
      const ctx = {};
      ctx.entities = res.locals.entities;
      ctx.gameId = res.locals.entities._id;
      ctx.playerId = res.locals.playerId;

      validateFortificationName(ctx);
    })();

    function validateFortificationName(ctx) {
      const fortificationName = req.body.fortificationName;
      const fortification = blueprint.fortification[fortificationName];

      if (!fortification) {
        res.status(503);
        res.send({
          error: 'This fortification not exists!'
        });
        debug('This fortification not exists!', fortificationName);
        debug('******************** error ********************');
        return;
      }

      ctx.fortification = fortification;
      debug(
        'validateFortificationName: fortification.namePretty:',
        fortification.namePretty
      );
      comparePlayerAndFortificationRace(ctx);
    }

    function comparePlayerAndFortificationRace(ctx) {
      const playerId = ctx.playerId;
      const player = ctx.entities[playerId];
      const playerRace = player.playerData.race;
      const fortificationRace = ctx.fortification.race;

      if (playerRace !== fortificationRace) {
        res.status(503);
        res.send({
          error: 'This fortification is not from player race!'
        });
        debug('This fortification is not from player race!');
        debug('comparePlayerAndFortificationRace: playerRace:', playerRace);
        debug('******************** error ********************');
        return;
      }

      debug('comparePlayerAndFortificationRace: playerRace:', playerRace);
      checkIsFortificationAlreadyBuild(ctx);
    }

    function checkIsFortificationAlreadyBuild(ctx) {
      const fortificationName = req.body.fortificationName;
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
        debug('This fortification is already build!', fortificationName);
        debug('******************** error ********************');
        return;
      }

      checkCanPlayerAffordFortification(ctx);
    }

    function checkCanPlayerAffordFortification(ctx) {
      const fortification = ctx.fortification;
      const fortificationCost = fortification.buildingCost;
      const playerId = ctx.playerId;
      const player = ctx.entities[playerId];
      const playerResources = player.playerResources;
      let canPlayerAffordFortification = true;

      _.forEach(fortificationCost, (cost, resource) => {
        if (playerResources[resource] < cost) {
          canPlayerAffordFortification = false;
          debug('checkCanPlayerAffordFortification: Not enaugh:', resource);
        }
      });

      if (!canPlayerAffordFortification) {
        res.status(503);
        res.send({
          error: 'This fortification is too expensive!'
        });
        debug('This fortification is too expensive!', fortificationCost);
        debug('******************** error ********************');
        return;
      }

      debug(
        'checkCanPlayerAffordFortification: canPlayerAffordFortification:',
        canPlayerAffordFortification
      );

      ctx.playerResources = playerResources;
      substractFortificationCostFromPlayerResources(ctx);
    }

    function substractFortificationCostFromPlayerResources(ctx) {
      const fortificationCost = ctx.fortification.buildingCost;
      const playerResources = ctx.playerResources;

      debug(
        'substractFortificationCostFromPlayerResources: playerResources:',
        playerResources
      );

      _.forEach(fortificationCost, (cost, resource) => {
        playerResources[resource] -= cost;
      });

      debug(
        'substractFortificationCostFromPlayerResources: playerResources:',
        playerResources
      );

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
          generateFortificationEntity(ctx);
        }
      );
    }

    function generateFortificationEntity(ctx) {
      const playerId = ctx.playerId;
      const fortificationName = req.body.fortificationName;

      const fortificationId =
        'fortification_' + fortificationName + '__' + shortId.generate();
      const fortificationEntity = {};
      fortificationEntity.fortificationName = fortificationName;
      fortificationEntity.owner = playerId;

      debug(
        'generateFortificationEntity: fortificationEntity:',
        fortificationEntity
      );

      ctx.fortificationEntity = fortificationEntity;
      ctx.fortificationId = fortificationId;
      updateSetFortificationEntity(ctx);
    }

    function updateSetFortificationEntity(ctx) {
      const entities = ctx.entities;
      const gameId = entities._id;
      const fortificationEntity = ctx.fortificationEntity;
      const fortificationId = ctx.fortificationId;

      const $set = {};
      $set[fortificationId] = fortificationEntity;

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
          generateEnchantmentEntity(ctx);
        }
      );
    }

    function generateEnchantmentEntity(ctx) {
      const playerId = ctx.playerId;
      const fortificationId = ctx.fortificationId;
      const fortification = ctx.fortification;

      const enchantmentId = 'enchantment_income__' + shortId.generate();
      const enchantmentEntity = {};
      enchantmentEntity.owner = playerId;
      enchantmentEntity.enchanter = fortificationId;
      if (fortification.income) {
        enchantmentEntity.income = {};
        enchantmentEntity.income.name = fortification.income.name;
        enchantmentEntity.income.amount = fortification.income.amount;
      }

      debug('generateEnchantmentEntity: enchantmentEntity:', enchantmentEntity);

      ctx.enchantmentEntity = enchantmentEntity;
      ctx.enchantmentId = enchantmentId;
      updateSetEnchantmentEntity(ctx);
    }

    function updateSetEnchantmentEntity(ctx) {
      const entities = ctx.entities;
      const gameId = entities._id;
      const enchantmentEntity = ctx.enchantmentEntity;
      const enchantmentId = ctx.enchantmentId;

      const $set = {};
      $set[enchantmentId] = enchantmentEntity;

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
          const message = 'ok';
          res.send({
            error: 0,
            message: message
          });
        }
      );
    }
  };
};
