// @format

'use strict';

const debug = require('debug')('cogs:playerReadyPost');

// What does this module do?
// Set player ready to 'yes' in db
module.exports = (db, walkie) => {
  return (req, res) => {
    const game = res.locals.game;
    const playerIndex = res.locals.playerIndex;

    let playerReady;

    (function init() {
      debug('init');
      checkRequestBody();
    })();

    function checkRequestBody() {
      if (typeof req.body.playerReady !== 'string') {
        res.status(400);
        res.send('400 Bad Request - POST parameter playerReady not defined');
        return;
      }
      playerReady = req.body.playerReady;

      debug('checkRequestBody', req.body);
      checkIsReady();
    }

    function checkIsReady() {
      if (playerReady !== 'yes') {
        res.status(400);
        res.send('400 Bad Request - playerReady parameter must be "yes"');
        return;
      }

      debug('checkIsReady: playerReady', playerReady);
      updateGameByPlayerReady();
    }

    function updateGameByPlayerReady() {
      const query = { _id: game._id };

      // We need to update an object inside mongo array, must use its index in $set query
      const mongoFieldToSet = 'playerArray.' + playerIndex + '.ready';
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

          sendResponce();
        }
      );
    }

    function sendResponce() {
      res.send({ error: 0 });
      debug('******************** ajax ********************');
      walkie.triggerEvent('launchPlayerReady_', 'playerReadyPost.js', {
        gameId: game._id
      });
    }
  };
};
