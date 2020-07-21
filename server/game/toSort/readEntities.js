// @format

'use strict';

const debug = require('debug')('nope:cogs:readEntities');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Middleware that refreshes res.locals.entities');

      const gameId = req.query.gameId;

      findGameById(gameId);
    })();

    function findGameById(gameId) {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, entities) => {
          if (error) {
            debug('findGameById: error:', error);
            return;
          }

          if (!entities) {
            debug('entities object is empty');
            res.status(404).send('404 Not found - Game not exist');
            return;
          }

          res.locals.entities = entities;
          debug('findGameById', entities._id);
          next();
        }
      );
    }
  };
};
