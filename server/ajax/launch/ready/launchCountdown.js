// @format

'use strict';

const debug = require('debug')('cogs:launchCountdown');

// What does this module do?
// Changes game state to worldState after counting down defined time
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const gameId = res.locals.entities._id;

      debug('init');
      fireCountdown(gameId);
    })();

    function fireCountdown(gameId) {
      debug('fireCountdown');
      setTimeout(() => {
        updateGameState(gameId);
      }, 1000); // @temp should be 5s
    }

    function updateGameState(gameId) {
      const query = { _id: gameId };
      const field = gameId + '.state';
      const $set = {};
      $set[field] = 'worldState';
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateGameState: error: ', error);
          debug('updateGameState: worldState');
          next();
        }
      );
    }
  };
};
