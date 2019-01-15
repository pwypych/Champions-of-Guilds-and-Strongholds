// @format

'use strict';

const debug = require('debug')('cogs:findEntitiesByGameId');

// What does this module do?
// Library that works on callback, it returns all entities for given gameId
module.exports = (db) => {
  return (gameId, callback) => {
    (function init() {
      debug('init: gameId:', gameId);
      findGameById();
    })();

    function findGameById() {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, entities) => {
          debug('findGameById: error: ', error);
          debug('findGameById', entities._id);
          callback(null, entities);
        }
      );
    }
  };
};
