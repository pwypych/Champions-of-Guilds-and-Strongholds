// @format

'use strict';

const debug = require('debug')('cogs:playerRacePost');
const validator = require('validator');

module.exports = (db) => {
  return (req, res) => {
    (function init() {
      debug('// Endpoint that updates player race for game in db');

      checkRequestBody();
    })();

    function checkRequestBody() {
      if (typeof req.body.playerRace !== 'string') {
        res
          .status(400)
          .send('400 Bad Request - POST parameter playerRace not defined');
        return;
      }

      debug('checkRequestBody');
      sanitizeRequestBody();
    }

    function sanitizeRequestBody() {
      let playerRace = validator.whitelist(
        req.body.playerRace,
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '
      );

      playerRace = playerRace.trim();

      if (playerRace === '') {
        res.status(400).send('400 Bad Request - Player race cannot be empty');
        return;
      }

      debug('sanitizeRequestBody:', playerRace);
      updateGameByPlayerRace(playerRace);
    }

    function updateGameByPlayerRace(playerRace) {
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;

      const query = { _id: entities._id };
      const field = playerId + '.playerData.race';
      const $set = {};
      $set[field] = playerRace;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameByPlayerRace: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Cannot update game');
            return;
          }

          sendResponse();
        }
      );
    }

    function sendResponse() {
      res.send({ error: 0 });
    }
  };
};
