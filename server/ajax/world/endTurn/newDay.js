// @format

'use strict';

const _ = require('lodash');

const debug = require('debug')('cogs:newDay.js');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Middleware, increment day component on game');

      const gameId = res.locals.entities._id;

      updateIncrementGameDay(gameId);
    })();

    function updateIncrementGameDay(gameId) {
      const query = { _id: gameId };
      const field = gameId + '.day';
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
            debug('updateIncrementGameDay: error:', error);
            return;
          }

          debug('updateIncrementGameDay');
          updateIncrementPlayersGold(gameId);
        }
      );
    }

    function updateIncrementPlayersGold(gameId) {
      const entities = res.locals.entities;
      const query = { _id: gameId };
      const $inc = {};
      _.forEach(entities, (entity, id) => {
        if (entity.playerResources) {
          const field = id + '.playerResources.gold';
          $inc[field] = 500;
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
            debug('updatePlayersGold: error:', error);
          }

          debug('updatePlayersGold: 500 gold added to every player');
          next();
        }
      );
    }
  };
};
