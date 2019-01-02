// @format

'use strict';

const debug = require('debug')('cogs:newDay.js');

// What does this module do?
// Middleware, increment day component on game
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      const gameId = res.locals.entities._id;
      updateIncrementGameDay(gameId);
    })();

    function updateIncrementGameDay(gameId) {
      const query = { _id: gameId };
      const field = gameId + '.day';
      const $inc = {};
      $inc[field] = 1;
      const update = { $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateIncrementGameDay: error:', error);
            return;
          }

          debug('updateIncrementGameDay');
          next();
        }
      );
    }
  };
};
