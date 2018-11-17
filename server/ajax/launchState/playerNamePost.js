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
    //  Check is req.body.playerName empty
    function checkRequestBody() {
      if (typeof req.body.playerName !== 'string') {
        debug('checkRequestBody: playerName not a string: ', req.body);
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

    // Sanitize player name
    function sanitizeRequestBody() {
      playerName = validator.whitelist(
        req.body.playerName,
        'abcdefghijklmnopqrstuvwxyz01234567890 '
      );
      debug('checkRequestBody', playerName);
      getPlayerIndex();
    }

    // Get player index from playerArray
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

    // Update gameCollection in mongo
    function updateGameByPlayerName(playerIndex) {
      const query = { _id: game._id };
      const $set = {};
      const name = 'playerArray.' + playerIndex + '.name';
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

          debug('updateGameByPlayerName: query:', query);
          debug('updateGameByPlayerName: update:', update);
          debug('updateGameByPlayerName: options:', options);
          sendResponce();
        }
      );
    }

    function sendResponce() {
      res.send({ error: 0 });
    }
  };
};
