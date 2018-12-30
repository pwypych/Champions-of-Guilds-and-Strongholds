// @format

'use strict';

const debug = require('debug')('cogs:endTurnPost.js');

// What does this module do?
// Endpoint, set endTurn flag to true on player entitty and send early response
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      updatePlayerEntityEndTurn();
    })();

    function updatePlayerEntityEndTurn() {
      const gameId = res.locals.entities._id;
      const playerId = res.locals.playerId;

      const query = { _id: gameId };
      const mongoFieldToSetEndTurn = playerId + '.endTurn';
      const $set = {};
      $set[mongoFieldToSetEndTurn] = true;
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
