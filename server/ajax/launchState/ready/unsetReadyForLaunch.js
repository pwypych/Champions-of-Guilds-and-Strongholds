// @format

'use strict';

const debug = require('debug')('cogs:unsetReadyForLaunch');
const _ = require('lodash');

// What does this module do?
// Middleware that unset readyForLaunch
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const gameId = res.locals.entities._id;

      debug('init');
      generatePlayerEntityArray(gameId);
    })();

    function generatePlayerEntityArray() {
      const playerEntityArray = [];
      const entities = res.locals.entities;
      _.forEach(entities, (entity, id) => {
        if (entity.playerData) {
          playerEntityArray.push(id);
        }
      });

      unsetPlayerReadyForLaunch();
    }

    function unsetPlayerReadyForLaunch(gameId) {
      const query = { _id: gameId };
      const mongoFieldToSet = gameId + '.state';
      const $set = {};
      $set[mongoFieldToSet] = 'worldState';
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('unsetPlayerReadyForLaunch: error:', error);
          }
          debug('******************** middleware after ********************');
        }
      );
    }
  };
};
