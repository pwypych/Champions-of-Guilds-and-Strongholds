// @format

'use strict';

const debug = require('debug')('cogs:playerReadyPost');

// What does this module do?
// Set player ready to true in db
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;

      debug('init');

      // no paramaters passed to this middleware, no need to validate

      updateGameByPlayerReady(entities, playerId);
    })();

    function updateGameByPlayerReady(entities, playerId) {
      const query = { _id: entities._id };

      // We need to update an object inside mongo array, must use its index in $set query
      const mongoFieldToSet = playerId + '.playerData.readyForLaunch';
      const $set = {};
      $set[mongoFieldToSet] = true;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameByPlayerReady: error:', error);
            res.status(503);
            res.send('503 Service Unavailable - Cannot update game');
            debug('******************** error ********************');
            return;
          }

          debug('updateGameByPlayerReady: readyForLaunch: true');
          sendResponce();
        }
      );
    }

    function sendResponce() {
      res.send({ error: 0 });
      debug('******************** early ajax ********************');
      next();
    }
  };
};
