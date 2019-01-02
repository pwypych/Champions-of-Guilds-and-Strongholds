// @format

'use strict';

const debug = require('debug')('cogs:unsetReadyForLaunch');
const _ = require('lodash');

// What does this module do?
// Middleware that unset readyForLaunch flag from player entitie
module.exports = (db) => {
  return (req, res) => {
    (function init() {
      debug('init');
      generatePlayerIdArray();
    })();

    function generatePlayerIdArray() {
      const playerIdArray = [];
      const entities = res.locals.entities;
      _.forEach(entities, (entity, id) => {
        if (entity.playerData) {
          playerIdArray.push(id);
        }
      });

      debug('generatePlayerIdArray: playerIdArray:', playerIdArray);
      unsetPlayerReadyForLaunch(playerIdArray);
    }

    function unsetPlayerReadyForLaunch(playerIdArray) {
      const gameId = res.locals.entities._id;
      const query = { _id: gameId };
      const $unset = {};

      playerIdArray.forEach((entity) => {
        const string = entity + '.readyForLaunch';
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

          debug('******************** middleware after ********************');
        }
      );
    }
  };
};
