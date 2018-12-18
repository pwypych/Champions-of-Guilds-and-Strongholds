// @format

'use strict';

const debug = require('debug')('cogs:preparePlayerResource');
const _ = require('lodash');

// What does this module do?
// Set every player resources depence on race
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

        const entities = game;
        debug('findGameById', entities._id);
        generatePlayerEntityArray(entities);
      });
    }

    function generatePlayerEntityArray(entities) {
      const playerEntityArray = [];

      _.forEach(entities, (entity, id) => {
        if (entity.playerToken && entity.playerData) {
          const player = {};
          player.id = id;
          player.race = entity.playerData.race;
          playerEntityArray.push(player);
        }
      });

      debug(
        'generatePlayerEntityArray: playerEntityArray.length',
        playerEntityArray.length
      );
      forEachPlayer(entities, playerEntityArray);
    }

    function forEachPlayer(entities, playerEntityArray) {
      const done = _.after(playerEntityArray.length, () => {
        debug('forEachPlayer: done!');
        triggerPrepareReady(entities);
      });

      playerEntityArray.forEach((player, playerIndex) => {
        debug('forEachPlayer', player);
        updatePlayerResources(entities, player, playerIndex, done);
      });
    }

    function updatePlayerResources(entities, player, playerIndex, done) {
      const query = { _id: entities._id };

      const mongoFieldToSet = player.id + '.playerResources';
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
            return;
          }

          debug('updatePlayerResources', result.result);
          done();
        }
      );
    }

    function triggerPrepareReady(entities) {
      debug('triggerPrepareReady');
      walkie.triggerEvent(
        'preparePlayerResources_',
        'preparePlayerResource.js',
        {
          gameId: entities._id
        }
      );
    }
  };
};
