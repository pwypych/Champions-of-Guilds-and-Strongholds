// @format

'use strict';

const _ = require('lodash');

const debug = require('debug')('cogs:enchantmentIncomeDigest.js');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Middleware, adds resources from income enchantments to players'
      );
      const gameId = res.locals.entities._id;
      updatePlayerResourcesByEnchantmentIncome(gameId);
    })();

    function updatePlayerResourcesByEnchantmentIncome(gameId) {
      const entities = res.locals.entities;
      const query = { _id: gameId };
      const $inc = {};

      // @todo bug when player have two stone mines, it adds resources only for one
      _.forEach(entities, (entity) => {
        if (entity.enchanter && entity.income) {
          const field = entity.owner + '.playerResources.' + entity.income.name;
          $inc[field] = entity.income.amount;
        }
      });

      const update = { $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updatePlayerResourcesByEnchantmentIncome: error:', error);
          }

          debug(
            'updatePlayerResourcesByEnchantmentIncome: Enchantment income done!'
          );
          next();
        }
      );
    }
  };
};
