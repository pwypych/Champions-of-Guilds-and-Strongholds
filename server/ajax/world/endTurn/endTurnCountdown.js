// @format

'use strict';

const debug = require('debug')('cogs:endTurnCountdown.js');
const _ = require('lodash');

// What does this module do?
// Middleware, check is endTurnCountdownStartedTimestamp flag, if no begin countdown
module.exports = (db) => {
  return (req, res, next) => {
    const timeBeforeTurnEnds = 30 * 1000; // ms

    (function init() {
      debug('init');
      const gameId = res.locals.entities._id;
      const game = res.locals.entities[gameId];
      checkIsCountdownRunning(game, gameId);
    })();

    function checkIsCountdownRunning(game, gameId) {
      const timeWhenTurnShouldEnd =
        game.endTurnCountdownStartedTimestamp + timeBeforeTurnEnds;

      if (Date.now() < timeWhenTurnShouldEnd) {
        debug(
          'checkIsCountdownRunning: game.endTurnCountdownStartedTimestamp: Countdown is running'
        );
        return;
      }

      debug('checkIsCountdownRunning');
      updateSetEndTurnCountdownRunning(gameId);
    }

    function updateSetEndTurnCountdownRunning(gameId) {
      const query = { _id: gameId };
      const field = gameId + '.endTurnCountdownStartedTimestamp';
      const $set = {};
      $set[field] = Date.now();
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
      }, timeBeforeTurnEnds);

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
