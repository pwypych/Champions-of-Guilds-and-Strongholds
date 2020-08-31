// @format

'use strict';

const debug = require('debug')('cogs:mineStoneVisit');
const _ = require('lodash');
const shortId = require('shortid');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Check is visit is possible, change visitable owner and add enchantment'
      );

      const ctx = {};
      ctx.entities = res.locals.entities;
      ctx.gameId = ctx.entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.visitableId = res.locals.entityId;
      ctx.visitable = ctx.entities[ctx.visitableId];

      debug('init: ctx:', ctx);
      findHeroId(ctx);
    })();

    function findHeroId(ctx) {
      const entities = ctx.entities;
      const playerId = ctx.playerId;

      let heroId;
      let hero;

      _.forEach(entities, (entity, id) => {
        if (entity.heroStats && entity.owner === playerId) {
          heroId = id;
          hero = entity;
        }
      });

      ctx.heroId = heroId;
      ctx.hero = hero;

      debug('findHeroId: heroId:', heroId);
      checkHeroPosition(ctx);
    }

    function checkHeroPosition(ctx) {
      const hero = ctx.hero;
      const visitable = ctx.visitable;

      if (
        hero.position.x !== visitable.position.x ||
        hero.position.y !== visitable.position.y
      ) {
        debug('checkHeroPosition: Hero not on visitable! Aborting!');
        next();
        return;
      }

      debug('checkHeroPosition: Ok!');
      generateEnchantmentEntity(ctx);
    }

    // rename / rewrite this module to support all mine visitables

    // check if visitable is a mine

    // check if enchantment allready exists

    // add new enchantment

    // check if enchantment owner has changed

    // change owner of the effect

    // change figure color

    function generateEnchantmentEntity(ctx) {
      const playerId = ctx.playerId;
      const visitableId = ctx.visitableId;
      const visitable = ctx.visitable;

      const enchantmentId = 'enchantment_income__' + shortId.generate();
      const enchantmentEntity = {};
      enchantmentEntity.owner = playerId;
      enchantmentEntity.enchanter = visitableId;
      if (visitable.income) {
        enchantmentEntity.income = {};
        enchantmentEntity.income.name = visitable.income.name;
        enchantmentEntity.income.amount = visitable.income.amount;
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
