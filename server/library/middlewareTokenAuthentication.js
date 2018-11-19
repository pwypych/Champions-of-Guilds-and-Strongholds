// @format

'use strict';

const debug = require('debug')('cogs:middlewareTokenAuthentication');
const shortid = require('shortid');

module.exports = (db) => {
  return (req, res, next) => {
    let gameId;
    let playerToken;

    (function init() {
      debug('init');
      checkRequestQuery();
    })();

    function checkRequestQuery() {
      debug('req.query', req.query);
      if (
        typeof req.query.gameId === 'undefined' ||
        typeof req.query.playerToken === 'undefined'
      ) {
        res.status(403).send('403 Forbbidden - Missing query variable');
        return;
      }

      gameId = req.query.gameId;
      playerToken = req.query.playerToken;

      debug('checkRequestQuery:', playerToken, gameId);
      validateRequestQuery();
    }

    function validateRequestQuery() {
      if (!shortid.isValid(gameId)) {
        debug('validateRequestQuery: Invalid gameId:', gameId);
        res.status(503).send('503 Service Unavailable - Invalid gameId');
        return;
      }

      if (!shortid.isValid(playerToken)) {
        debug('validateRequestQuery: invalid playerToken:', playerToken);
        res.status(503).send('503 Service Unavailable - Invalid playerToken');
        return;
      }

      debug('validateRequestQuery');
      findGameById();
    }

    function findGameById() {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        if (error) {
          debug('findGameById: error:', error);
          res
            .status(503)
            .send('503 Service Unavailable - Error', error.message);
          return;
        }

        if (!game) {
          res.status(503).send('503 Service Unavailable - Cannot find gameId');
          return;
        }

        debug('findGameById', game._id);
        isPlayerTokenInGameObject(game);
      });
    }

    function isPlayerTokenInGameObject(game) {
      let isFound = false;
      game.playerArray.forEach((player) => {
        if (player.token === playerToken) {
          isFound = true;
        }
      });

      if (!isFound) {
        res
          .status(503)
          .send('503 Service Unavailable - Cannot find playerToken in game');
        return;
      }

      res.locals.playerToken = playerToken;
      res.locals.game = game;

      debug('isPlayerTokenInGameObject:', isFound);
      next();
    }
  };
};
