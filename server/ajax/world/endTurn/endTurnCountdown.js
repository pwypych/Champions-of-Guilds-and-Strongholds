// @format

'use strict';

const debug = require('debug')('cogs:endTurnCountdown.js');
const _ = require('lodash');

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

      debug('checkEndTurnCountdownFlag');
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

          debug('updateSetEndTurnCountdownRunning');
          waitBeforeEndTurn(gameId);
        }
      );
    }

    // we set timeout to count down to when turn ends forcebly
    // we do interval to check if every player has pressed endTurn, so we can end turn before timeout
    function waitBeforeEndTurn(gameId) {
      let interval;

      const timeout = setTimeout(() => {
        clearInterval(interval);
        debug('waitBeforeEndTurn: Timeout has runned');
        next();
      }, 60000);

      interval = setInterval(() => {
        readFreshEntities(timeout, interval, gameId);
      }, 1000);
    }

    function readFreshEntities(timeout, interval, gameId) {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, entities) => {
          debug('readFreshEntities', entities._id);
          checkEveryPlayerEndTurn(timeout, interval, entities);
        }
      );
    }

    function checkEveryPlayerEndTurn(timeout, interval, entities) {
      let isEveryPlayerEndTurn = true;

      _.forEach(entities, (entity) => {
        if (entity.playerData && entity.playerToken) {
          if (!entity.endTurn) {
            isEveryPlayerEndTurn = false;
          }
        }
      });

      debug('checkEveryPlayerEndTurn', isEveryPlayerEndTurn);

      if (isEveryPlayerEndTurn) {
        clearInterval(interval);
        clearTimeout(timeout);
        next();
      }
    }
  };
};
