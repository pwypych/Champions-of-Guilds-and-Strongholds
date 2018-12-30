// @format

'use strict';

const debug = require('debug')('cogs:unsetEndTurnFlags.js');
const _ = require('lodash');

// What does this module do?
// Middleware, unset endTurnCountdownRunning and players endTurn flags
module.exports = (db) => {
  return (req, res, next) => {
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
      updateUnsetEndTurnFlags(playerIdArray);
    }

    function updateUnsetEndTurnFlags(playerIdArray) {
      const gameId = res.locals.entities._id;
      const query = { _id: gameId };
      const $unset = {};
      playerIdArray.forEach((id) => {
        const component = id + '.endTurn';
        $unset[component] = true;
      });
      const component = gameId + '.endTurnCountdownRunning';
      $unset[component] = true;

      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateUnsetEndTurnFlags: error:', error);
            return;
          }

          next();
        }
      );
    }
  };
};
