// @format

'use strict';

const debug = require('debug')('cogs:launchCountdown');

// What does this module do?
// Change game state to worldState
module.exports = (db) => {
  return (req, res) => {
    (function init() {
      const gameId = res.locals.entities._id;

      debug('init');
      fireCountdown(gameId);
    })();

    function fireCountdown(gameId) {
      debug('fireCountdown');
      setTimeout(() => {
        updateGameState(gameId);
      }, 5000);
    }

    function updateGameState(gameId) {
      const query = { _id: gameId };
      const mongoFieldToSet = gameId + '.state';
      const $set = {};
      $set[mongoFieldToSet] = 'worldState';
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameState: error:', error);
          }
          debug('******************** middleware after ********************');
        }
      );
    }
  };
};
