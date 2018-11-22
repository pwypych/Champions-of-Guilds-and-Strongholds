// @format

'use strict';

const debug = require('debug')('cogs:playerNamePost');
const validator = require('validator');

module.exports = (db) => {
  return (req, res) => {
    const game = res.locals.game;
    const playerIndex = res.locals.playerIndex;
    let playerName;

    (function init() {
      debug('init');
      checkRequestBody();
    })();

    function checkRequestBody() {
      if (typeof req.body.playerName !== 'string') {
        res
          .status(400)
          .send('400 Bad Request - POST parameter playerName not defined');
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

      playerName = playerName.trim();
      playerName = playerName.substr(0, 20);

      if (playerName === '') {
        res.status(400).send('400 Bad Request - Player name cannot be empty');
        return;
      }

      debug('checkRequestBody', playerName);
      updateGameByPlayerName();
    }

    function updateGameByPlayerName() {
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
