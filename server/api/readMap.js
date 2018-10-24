// @format

'use strict';

const debug = require('debug')('cogs:readMap');

module.exports = (db) => {
  return (req, res) => {
    let gameToken;

    (function init() {
      debug('init');
      checkRequestQuery();
    })();

    function checkRequestQuery() {
      debug('checkRequestQuery');
      debug('req.query - ', req.query);
      if (req.query.gameToken) {
        gameToken = req.query.gameToken;
        sanitizeGameToken();
      } else {
        res.send('Error, missing gameToken querry variable');
      }
    }

    function sanitizeGameToken() {
      debug('sanitizeGameToken');
      debug('gameToken', gameToken);
      res.send(gameToken);
    }

    function findMap(mapName) {
      debug('findMap');
      const query = { _id: mapName };
      const options = {};

      db.collection('mapCollection').findOne(
        query,
        options,
        (error, mapObject) => {
          if (error) {
            debug('findMap: error:', error);
            res.status(503).send('503 Error - Cannot find map');
            return;
          }

          debug('findMap', mapObject._id);
          prepareGameInstance(mapObject);
        }
      );
    }
  };
};
