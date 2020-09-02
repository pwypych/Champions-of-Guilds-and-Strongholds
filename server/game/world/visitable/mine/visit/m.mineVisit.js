// @format

'use strict';

const debug = require('debug')('cogs:mineVisit');
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

      debug('init:');
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
        sendResponse();
        return;
      }

      debug('checkHeroPosition: Ok!');
      checkVisitableIsMine(ctx);
    }

    function checkVisitableIsMine(ctx) {
      const visitable = ctx.visitable;

      if (visitable.visitableType !== 'mine') {
        debug('checkVisitableIsMine: Not a mine! Aborting!');
        sendResponse();
        return;
      }

      debug('checkVisitableIsMine: Ok!');
      checkEnchantmentExists(ctx);
    }

    function checkEnchantmentExists(ctx) {
      const entities = ctx.entities;
      const visitableId = ctx.visitableId;

      let enchantment;
      let enchantmentId;

      _.forEach(entities, (entity, id) => {
        if (entity.enchanter === visitableId) {
          enchantment = entity;
          enchantmentId = id;
        }
      });

      if (!enchantment && !enchantmentId) {
        debug('checkEnchantmentExists: No!');
        generateEnchantment(ctx);
        return;
      }

      ctx.enchantment = enchantment;
      ctx.enchantmentId = enchantmentId;

      debug('checkEnchantmentExists: Yes!');
      checkEnchantmentOwnerChanged(ctx);
    }

    function checkEnchantmentOwnerChanged(ctx) {
      const enchantment = ctx.enchantment;
      const playerId = ctx.playerId;

      if (enchantment.owner === playerId) {
        debug('checkEnchantmentOwnerChanged: Same owner as before, ignoring!');
        sendResponse();
        return;
      }

      debug('checkEnchantmentOwnerChanged: New owner!');
      changeOwnerOfEnchantment(ctx);
    }

    function changeOwnerOfEnchantment(ctx) {
      const enchantment = ctx.enchantment;
      enchantment.owner = ctx.playerId;
      updateSetEnchantment(ctx);
    }

    // change figure color by playerEntity.playerData.color

    function generateEnchantment(ctx) {
      const playerId = ctx.playerId;
      const visitableId = ctx.visitableId;
      const visitable = ctx.visitable;

      const enchantmentId = 'enchantment_income__' + shortId.generate();
      const enchantment = {};
      enchantment.owner = playerId;
      enchantment.enchanter = visitableId;
      if (visitable.income) {
        enchantment.income = {};
        enchantment.income.name = visitable.income.name;
        enchantment.income.amount = visitable.income.amount;
      }

      debug('generateEnchantment: enchantment:', enchantment);

      ctx.enchantment = enchantment;
      ctx.enchantmentId = enchantmentId;
      updateSetEnchantment(ctx);
    }

    function updateSetEnchantment(ctx) {
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
            debug('updateSetEnchantment: error:', error);
          }

          debug('updateSetEnchantment: Success!');
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
