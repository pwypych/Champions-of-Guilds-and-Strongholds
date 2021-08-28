// @format

'use strict';

const debug = require('debug')('cogs:buildBeastTownHall');
const shortId = require('shortid');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Set beast town hall enchantment for player');

      const ctx = {};
      ctx.playerId = res.locals.playerId;
      ctx.fortificationId = res.locals.fortificationId;
      ctx.fortificationBlueprint = res.locals.fortificationBlueprint;
      ctx.entities = res.locals.entities;

      debug('init:');
      generateEnchantment(ctx);
    })();

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
