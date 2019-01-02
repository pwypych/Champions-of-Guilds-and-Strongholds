// @format

'use strict';

const debug = require('debug')('cogs:endTurnPost.js');

// What does this module do?
// Endpoint, set endTurn flag to true on player entitty and send early response
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;
      updatePlayerEntityEndTurn(entities, playerId);
    })();

    function updatePlayerEntityEndTurn(entities, playerId) {
      const gameId = entities._id;

      const query = { _id: gameId };
      const field = playerId + '.endTurn';
      const $set = {};
      $set[field] = true;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            res.status(400);
            res.send({
              error: 'Database error cannot update playerData component'
            });
            debug('******************** error ********************');
            return;
          }

          debug('updatePlayerEntityEndTurn');
          res.send({ error: 0 });
          next();
        }
      );
    }
  };
};
