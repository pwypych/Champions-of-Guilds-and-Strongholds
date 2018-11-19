// @format

'use strict';

const debug = require('debug')('cogs:playerNamePost');
const validator = require('validator');

module.exports = (db) => {
  return (req, res) => {
    const game = res.locals.game;
    const playerToken = res.locals.playerToken;
    let playerName;

    (function init() {
      debug('init');
      checkRequestBody();
    })();

    function checkRequestBody() {
      if (typeof req.body.playerName !== 'string') {
        res
          .status(503)
          .send(
            '503 Service Unavailable - Wrong POST parameter or empty playerName parameter'
          );
        return;
      }

      debug('checkRequestBody');
      sanitizeRequestBody();
    }

    function sanitizeRequestBody() {
      playerName = validator.whitelist(
        req.body.playerName,
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '
      );
      debug('checkRequestBody', playerName);
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
      updateGameByPlayerName(playerIndex);
    }

    function updateGameByPlayerName(playerIndex) {
      const query = { _id: game._id };
      const name = 'playerArray.' + playerIndex + '.name';
      const $set = {};
      $set[name] = playerName;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameByPlayerName: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Cannot update game');
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
