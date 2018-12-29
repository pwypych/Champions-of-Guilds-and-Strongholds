// @format

'use strict';

const debug = require('debug')('nope:cogs:readEntities');

// What does this module do?
// Middleware that refreshes res.locals.entities
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const gameId = req.query.gameId;

      debug('init');
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
