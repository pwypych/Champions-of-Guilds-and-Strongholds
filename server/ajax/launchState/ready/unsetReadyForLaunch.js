// @format

'use strict';

const debug = require('debug')('cogs:unsetReadyForLaunch');
const _ = require('lodash');

// What does this module do?
// Middleware that unset readyForLaunch flag from player entitie
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      generatePlayerEntityArray();
    })();

    function generatePlayerEntityArray() {
      const playerEntityArray = [];
      const entities = res.locals.entities;
      _.forEach(entities, (entity, id) => {
        if (entity.playerData) {
          playerEntityArray.push(id);
        }
      });

      debug('generatePlayerEntityArray: playerEntityArray:', playerEntityArray);
      unsetPlayerReadyForLaunch(playerEntityArray);
    }

    function unsetPlayerReadyForLaunch(playerEntityArray) {
      const gameId = res.locals.entities._id;
      const query = { _id: gameId };
      const $unset = {};

      playerEntityArray.forEach((entity) => {
        const string = entity + '.playerData.readyForLaunch';
        debug('unsetPlayerReadyForLaunch: string:', string);
        $unset[string] = true;
      });

      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('unsetPlayerReadyForLaunch: error:', error);
          }

          next();
          debug('******************** middleware after ********************');
        }
      );
    }
  };
};
