// @format

'use strict';

const debug = require('debug')('cogs:everyPlayerReadyChecker');

// What does this module do?
// Check is every player ready
module.exports = (walkie, db) => {
  return () => {
    (function init() {
      debug('init');
      onLaunchPlayerReady();
    })();

    function onLaunchPlayerReady() {
      walkie.onEvent(
        'launchPlayerReady_',
        'everyPlayerReadyChecker',
        (data) => {
          debug('onLaunchPlayerReady');
          findGameById(data.gameId);
        }
      );
    }

    function findGameById(gameId) {
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

        debug('findGameById', game._id);
        checkEveryPlayerReady(game);
      });
    }

    function checkEveryPlayerReady(game) {
      let isEveryPlayerReady = true;
      game.playerArray.forEach((player) => {
        if (player.ready === 'no') {
          isEveryPlayerReady = false;
        }
      });

      if (isEveryPlayerReady) {
        debug('checkEveryPlayerReady', isEveryPlayerReady);
        walkie.triggerEvent('everyPlayerReady_', 'everyPlayerReadyChecker.js', {
          gameId: game._id
        });
        return;
      }

      debug('checkEveryPlayerReady', isEveryPlayerReady);
    }
  };
};
