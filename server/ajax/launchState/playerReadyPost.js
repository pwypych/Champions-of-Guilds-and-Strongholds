// @format

'use strict';

const debug = require('debug')('cogs:playerReadyPost');

// What does this module do?
// Set player ready to 'yes' in db
module.exports = (db, walkie) => {
  return (req, res) => {
    (function init() {
      debug('init');
      const entities = res.locals.entities;
      checkRequestBody(entities);
    })();

    function checkRequestBody(entities) {
      if (typeof req.body.playerReady !== 'string') {
        res.status(400);
        res.send('400 Bad Request - POST parameter playerReady not defined');
        return;
      }
      const playerReady = req.body.playerReady;

      debug('checkRequestBody', req.body);
      checkIsReady(entities, playerReady);
    }

    function checkIsReady(entities, playerReady) {
      if (playerReady !== 'yes') {
        res.status(400);
        res.send('400 Bad Request - playerReady parameter must be "yes"');
        return;
      }

      debug('checkIsReady: playerReady', playerReady);
      updateGameByPlayerReady(entities, playerReady);
    }

    function updateGameByPlayerReady(entities, playerReady) {
      const playerId = res.locals.playerId;
      const query = { _id: entities._id };

      // We need to update an object inside mongo array, must use its index in $set query
      const mongoFieldToSet = playerId + '.readyForLaunch';
      const $set = {};
      $set[mongoFieldToSet] = playerReady;
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
            return;
          }

          sendResponce(entities);
        }
      );
    }

    function sendResponce(entities) {
      res.send({ error: 0 });
      debug('******************** ajax ********************');
      walkie.triggerEvent('launchPlayerReady_', 'playerReadyPost.js', {
        gameId: entities._id
      });
    }
  };
};
