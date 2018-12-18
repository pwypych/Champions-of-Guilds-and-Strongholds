// @format

'use strict';

const debug = require('debug')('cogs:playerNamePost');
const validator = require('validator');

// What does this module do?
// Endpoint that updates player name for game in db
module.exports = (db) => {
  return (req, res) => {
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
      let playerName = validator.whitelist(
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
      updateGameByPlayerName(playerName);
    }

    function updateGameByPlayerName(playerName) {
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;

      const query = { _id: entities._id };
      const name = playerId + '.playerData.name';
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
