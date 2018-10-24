// @format

'use strict';

const debug = require('debug')('cogs:readMap');

module.exports = (sanitizer, db) => {
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
        res.send('Error 403, missing gameToken querry variable');
      }
    }

    function sanitizeGameToken() {
      debug('sanitizeGameToken');
      debug('gameToken', gameToken);
      if (sanitizer.isValidShortId(gameToken)) {
        findGame(gameToken);
      } else {
        res.send('invalid game token');
      }
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
          res.send('game found');
          // prepareGameInstance(gameObject);
        }
      );
    } // Function
  };
};
