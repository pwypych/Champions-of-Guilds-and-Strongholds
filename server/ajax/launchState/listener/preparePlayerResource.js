// @format

'use strict';

const debug = require('debug')('cogs:preparePlayerResource');
const _ = require('lodash');

module.exports = (walkie, db) => {
  return () => {
    const raceResourceMap = {
      human: {
        wood: 0,
        stone: 0,
        gold: 0,
        crystal: 0
      },
      orc: {
        wood: 5,
        stone: 15,
        gold: 4000,
        crystal: 2
      }
    };

    (function init() {
      debug('init');
      onEveryPlayerReady();
    })();

    function onEveryPlayerReady() {
      walkie.onEvent(
        'everyPlayerReady_',
        'preparePlayerResource.js',
        (data) => {
          debug('onEveryPlayerReady');
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
        forEachPlayer(game);
      });
    }

    function forEachPlayer(game) {
      const done = _.after(game.playerArray.length, () => {
        debug('forEachPlayer: done!');
        triggerPrepareReady(game);
      });

      game.playerArray.forEach((player, playerIndex) => {
        debug('forEachPlayer', player);
        updatePlayerResources(game, player, playerIndex, done);
      });
    }

    function updatePlayerResources(game, player, playerIndex, done) {
      const query = { _id: game._id };

      const mongoFieldToSet = 'playerArray.' + playerIndex + '.resources';
      const $set = {};
      $set[mongoFieldToSet] = raceResourceMap[player.race];
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error, result) => {
          if (error) {
            debug(player.name, ': ERROR: insert mongo error:', error);
          }

          debug('updatePlayerResources', result.result);
          done();
        }
      );
    }

    // function updateGameMetaLaunch(game) {
    //   triggerPrepareReady(game);
    // }

    function triggerPrepareReady(game) {
      debug('triggerPrepareReady');
      walkie.triggerEvent('prepareReady_', 'preparePlayerResource.js', {
        gameId: game._id
      });
    }
  };
};
