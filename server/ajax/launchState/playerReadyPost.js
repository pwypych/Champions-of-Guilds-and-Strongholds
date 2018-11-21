// @format

'use strict';

const debug = require('debug')('cogs:playerReadyPost');

module.exports = (db, everyPlayerReadyChecker) => {
  return (req, res) => {
    const game = res.locals.game;
    const playerToken = res.locals.playerToken;

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
      determinePlayerIndex();
    }

    function determinePlayerIndex() {
      let playerIndex;
      game.playerArray.forEach((player, index) => {
        if (player.token === playerToken) {
          playerIndex = index;
        }
      });

      debug('determinePlayerIndex');
      updateGameByPlayerReady(playerIndex);
    }

    function updateGameByPlayerReady(playerIndex) {
      const query = { _id: game._id };

      // We need to update an object inside mongo array, must use its index in $set query
      const ready = 'playerArray.' + playerIndex + '.ready';
      const $set = {};
      $set[ready] = playerReady;
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

          checkEveryPlayerReady();
        }
      );
    }

    function checkEveryPlayerReady() {
      everyPlayerReadyChecker(game._id, (error, isEveryPlayerReady) => {
        if (error) {
          debug('checkEveryPlayerReady: error:', error);
          res.status(503);
          res.send(
            '503 Service Unavailable - Cannot check if every player ready:',
            error
          );
          return;
        }

        if (isEveryPlayerReady) {
          setTimeout(() => {
            updateGameState();
          }, 5000);
          return;
        }

        sendResponce();
      });
    }

    function updateGameState() {
      const query = { _id: game._id };
      const update = { $set: { state: 'worldState' } };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameState: error:', error);
            res.status(503);
            res.send('503 Service Unavailable - Cannot update game state');
            return;
          }

          sendResponce();
        }
      );
    }

    function sendResponce() {
      res.send({ error: 0 });
    }
  };
};
