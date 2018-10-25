// @format

'use strict';

const debug = require('debug')('cogs:readMap');

module.exports = (sanitizer, db) => {
  return (req, res) => {
    let gameInstanceId;

    (function init() {
      debug('init');
      checkRequestQuery();
    })();

    function checkRequestQuery() {
      debug('checkRequestQuery');
      debug('req.query - ', req.query);
      if (!req.query.gameInstanceId) {
        res.send('Error 403, missing gameInstanceId querry variable');
        return;
      }
      gameInstanceId = req.query.gameInstanceId;
      sanitizeGameToken();
    }

    function sanitizeGameToken() {
      debug('sanitizeGameToken');
      debug('gameInstanceId', gameInstanceId);
      if (!sanitizer.isValidShortId(gameInstanceId)) {
        res.send('invalid game token');
        return;
      }
      findGame(gameInstanceId);
    }

    function findGame(gameId) {
      debug('findGame');
      const query = { _id: gameId };
      const options = {};

      db.collection('gameInstanceCollection').findOne(
        query,
        options,
        (error, gameObject) => {
          if (error) {
            debug('findGame: error:', error);
            res.status(503).send('503 Error - Cannot find map');
            return;
          }

          debug('findGame', gameObject._id);
          sendMapLayer(gameObject.mapLayer);
          // prepareGameInstance(gameObject);
        }
      );
    } // Function

    function sendMapLayer(mapLayer) {
      res.send(mapLayer);
    }
  };
};
