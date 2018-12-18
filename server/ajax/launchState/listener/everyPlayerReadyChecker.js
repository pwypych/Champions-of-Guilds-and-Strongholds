// @format

'use strict';

const debug = require('debug')('cogs:everyPlayerReadyChecker');
const _ = require('lodash');

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

        const entities = game;
        debug('findGameById', entities._id);
        checkEveryPlayerReady(entities);
      });
    }

    function checkEveryPlayerReady(entities) {
      let isEveryPlayerReady = true;

      _.forEach(entities, (entity) => {
        if (entity.playerData && entity.plaerToken) {
          if (entity.plaeryData.readyForaLaunch === 'no') {
            isEveryPlayerReady = false;
          }
        }
      });

      if (isEveryPlayerReady) {
        debug('checkEveryPlayerReady', isEveryPlayerReady);
        walkie.triggerEvent('everyPlayerReady_', 'everyPlayerReadyChecker.js', {
          gameId: entities._id
        });
        return;
      }

      debug('checkEveryPlayerReady', isEveryPlayerReady);
    }
  };
};
