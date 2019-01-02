// @format

'use strict';

const debug = require('debug')('cogs:unsetEndTurnFlags.js');
const _ = require('lodash');

// What does this module do?
// Middleware, unset endTurnCountdownStartedTimestamp and players endTurn flags
module.exports = (db) => {
  return (req, res) => {
    (function init() {
      debug('init');
      const entities = res.locals.entities;
      updateUnsetEndTurnFlags(entities);
    })();

    function updateUnsetEndTurnFlags(entities) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const $unset = {};
      _.forEach(entities, (entity, id) => {
        if (entity.playerData) {
          const field = id + '.endTurn';
          $unset[field] = true;
        }
      });

      const field = gameId + '.endTurnCountdownStartedTimestamp';
      $unset[field] = true;

      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateUnsetEndTurnFlags: error:', error);
          }
          debug('updateUnsetEndTurnFlags');
        }
      );
    }
  };
};
