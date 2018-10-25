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
      if (
        typeof req.query.gameInstanceId === 'undefined' ||
        typeof req.query.playerToken === 'undefined'
      ) {
        res.status(503).send('403 Forbbidden - Missing querry variable');
        return;
      }
      gameInstanceId = req.query.gameInstanceId;
      playerToken = req.query.playerToken;

      debug('checkRequestQuery:', playerToken, gameInstanceId);
      sanitizeRequestQuery();
    }

    function sanitizeRequestQuery() {
      if (!sanitizer.isValidShortId(gameInstanceId)) {
        debug('sanitizeRequestQuery: Invalid gameInstanceId:', gameInstanceId);
        res
          .status(503)
          .send('503 Service Unavailable - Invalid gameInstanceId');
        return;
      }

      if (!sanitizer.isValidShortId(playerToken)) {
        debug('sanitizeRequestQuery: invalid playerToken:', playerToken);
        res.status(503).send('503 Service Unavailable - Invalid playerToken');
        return;
      }

      debug('sanitizeRequestQuery');
      findGameInstance();
    }

    function findGameInstance() {
      const query = { _id: gameInstanceId };
      const options = {};

      db.collection('gameInstanceCollection').findOne(
        query,
        options,
        (error, gameInstanceObject) => {
          if (error) {
            debug('findGameInstance: error:', error);
            res.status(503).send('503 Service Unavailable - Cannot find map');
            return;
          }

          debug('findGameInstance', gameInstanceObject._id);
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
