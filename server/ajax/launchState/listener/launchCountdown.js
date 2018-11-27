// @format

'use strict';

const debug = require('debug')('cogs:launchCountdown');

module.exports = (walkie, db) => {
  return () => {
    (function init() {
      debug('init');
      onPrepareReady();
    })();

    function onPrepareReady() {
      walkie.onEvent('prepareReady_', 'launchCountdown.js', (data) => {
        debug('onPrepareReady');
        findLaunchStateMeta(data.gameId);
      });
    }

    function findLaunchStateMeta(gameId) {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        if (error) {
          debug('findGameById: error:', error);
          return;
        }

        if (!game) {
          debug('game object is empty');
          return;
        }

        debug('findLaunchStateMeta', game._id);
        checkLaunchStateMeta(game);
      });
    }

    function checkLaunchStateMeta(game) {
      const launchStateMeta = game.meta.launchState;

      if (!launchStateMeta.isPreparePlayerResources) {
        debug('checkLaunchStateMeta: isPreparePlayerResources: no!');
        return;
      }

      if (!launchStateMeta.isPrepareHeroFigure) {
        debug('checkLaunchStateMeta: isPrepareHeroFigure: no!');
        return;
      }

      debug('checkLaunchStateMeta', launchStateMeta);
      fireCountdown(game._id);
    }

    function fireCountdown(gameId) {
      debug('fireCountdown');
      setTimeout(() => {
        updateGameState(gameId);
      }, 5000);
    }

    function updateGameState(gameId) {
      const query = { _id: gameId };
      const update = { $set: { state: 'worldState' } };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameState: error:', error);
            return;
          }
          // End
        }
      );
    }
  };
};
