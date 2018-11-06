// @format

'use strict';

const debug = require('debug')('cogs:middlewareTokenAuthentication');
const shortid = require('shortid');

module.exports = (db) => {
  return (req, res, next) => {
    let gameInstanceId;
    let playerToken;

    (function init() {
      debug('init');
      checkRequestQuery();
    })();

    function checkRequestQuery() {
      debug('req.query', req.query);
      if (
        typeof req.query.gameInstanceId === 'undefined' ||
        typeof req.query.playerToken === 'undefined'
      ) {
        res.status(403).send('403 Forbbidden - Missing querry variable');
        return;
      }

      gameInstanceId = req.query.gameInstanceId;
      playerToken = req.query.playerToken;

      debug('checkRequestQuery:', playerToken, gameInstanceId);
      validateRequestQuery();
    }

    function validateRequestQuery() {
      if (!shortid.isValid(gameInstanceId)) {
        debug('validateRequestQuery: Invalid gameInstanceId:', gameInstanceId);
        res
          .status(503)
          .send('503 Service Unavailable - Invalid gameInstanceId');
        return;
      }

      if (!shortid.isValid(playerToken)) {
        debug('validateRequestQuery: invalid playerToken:', playerToken);
        res.status(503).send('503 Service Unavailable - Invalid playerToken');
        return;
      }

      debug('validateRequestQuery');
      findGameInstanceById();
    }

    function findGameInstanceById() {
      const query = { _id: gameInstanceId };
      const options = {};

      db.collection('gameInstanceCollection').findOne(
        query,
        options,
        (error, gameInstance) => {
          if (error) {
            debug('findGameInstanceById: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Error', error.message);
            return;
          }

          if (!gameInstance) {
            res
              .status(503)
              .send('503 Service Unavailable - Cannot find gameInstanceId');
            return;
          }

          debug('findGameInstanceById', gameInstance._id);
          isPlayerTokenInGameInstanceObject(gameInstance.playerArray);
        }
      );
    }

    function isPlayerTokenInGameInstanceObject(playerArray) {
      let isFound = false;
      playerArray.forEach((player) => {
        if (player.token === playerToken) {
          isFound = true;
        }
      });

      if (!isFound) {
        res
          .status(503)
          .send(
            '503 Service Unavailable - Cannot find playerToken in gameInstance'
          );
        return;
      }

      debug('isPlayerTokenInGameInstanceObject:', isFound);
      next();
    }
  };
};
