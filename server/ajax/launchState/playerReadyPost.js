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
      if (typeof req.body.playeReady !== 'string') {
        res
          .status(400)
          .send('400 Bad Request - POST parameter playerReady not defined');
        return;
      }
      playerReady = req.body.playeReady;

      debug('checkRequestBody');
      sanitizeRequestBody();
    }

    function sanitizeRequestBody() {
      if (playerReady !== 'ready') {
        res.status(400).send('400 Bad Request - Player ready cannot be empty');
        return;
      }

      debug('checkRequestBody: playerReady', playerReady);
      getPlayerIndex();
    }

    function getPlayerIndex() {
      let playerIndex;
      game.playerArray.forEach((player, index) => {
        if (player.token === playerToken) {
          playerIndex = index;
        }
      });

      debug('getPlayerIndex');
      updateGameByPlayerReady(playerIndex);
    }

    function updateGameByPlayerReady(playerIndex) {
      const query = { _id: game._id };
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
            res
              .status(503)
              .send('503 Service Unavailable - Cannot update game');
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
          res
            .status(503)
            .send(
              '503 Service Unavailable - Cannot check if every player ready:',
              error
            );
          return;
        }

        if (isEveryPlayerReady) {
          updateGameState();
          return;
        }

        sendResponce();
      });
    }

    function updateGameState() {
      const query = { _id: game._id };
      const update = { $set: { state: 'launchCountdownState' } };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameState: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Cannot update game state');
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
