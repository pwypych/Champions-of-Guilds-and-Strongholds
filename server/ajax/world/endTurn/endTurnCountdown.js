// @format

'use strict';

const debug = require('debug')('cogs:endTurnCountdown.js');

// What does this module do?
// Middleware, check is endTurnCountdownRunning flag, if no begin countdown
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      const gameId = res.locals.entities._id;
      const game = res.locals.entities[gameId];
      checkEndTurnCountdownFlag(game, gameId);
    })();

    function checkEndTurnCountdownFlag(game, gameId) {
      if (game.endTurnCountdownRunning) {
        debug(
          'checkEndTurnCountdownFlag: game.endTurnCountdownRunning:',
          game.endTurnCountdownRunning
        );
        return;
      }

      updateSetEndTurnCountdownRunning(gameId);
    }

    function updateSetEndTurnCountdownRunning(gameId) {
      const query = { _id: gameId };
      const component = gameId + '.endTurnCountdownRunning';
      const $set = {};
      $set[component] = true;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetEndTurnCountdownRunning: error:', error);
            return;
          }

          waitBeforEndTurn();
        }
      );
    }

    function waitBeforEndTurn() {
      setTimeout(() => {
        next();
      }, 10000);
    }
  };
};
