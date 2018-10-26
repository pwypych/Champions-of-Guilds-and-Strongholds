// @format

'use strict';

const debug = require('debug')('cogs:readMap');

module.exports = (sanitizer, db) => {
  return (req, res) => {
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
      if (!sanitizer.isValidShortId(gameInstanceId)) {
        debug('validateRequestQuery: Invalid gameInstanceId:', gameInstanceId);
        res
          .status(503)
          .send('503 Service Unavailable - Invalid gameInstanceId');
        return;
      }

      if (!sanitizer.isValidShortId(playerToken)) {
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
        (error, gameInstanceObject) => {
          if (error) {
            debug('findGameInstanceById: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Error', error.message);
            return;
          }

          if (!gameInstanceObject) {
            res
              .status(503)
              .send('503 Service Unavailable - Cannot find gameInstanceId');
            return;
          }

          debug('findGameInstanceById', gameInstanceObject._id);
          isPlayerTokenInGameInstanceObject(gameInstanceObject.playerArray);
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
      findMapLayer();
    }

    function findMapLayer() {
      const query = { _id: gameInstanceId };
      const options = {};

      db.collection('gameInstanceCollection').findOne(
        query,
        options,
        (error, gameInstanceObject) => {
          if (error || !gameInstanceObject) {
            debug('findMapLayer: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Cannot find gameInstance');
            return;
          }

          debug('findMapLayer', gameInstanceObject._id);
          sendMapLayer(gameInstanceObject.mapLayer);
        }
      );
    }

    function sendMapLayer(mapLayer) {
      debug('sendMapLayer');
      res.send(mapLayer);
    }
  };
};
