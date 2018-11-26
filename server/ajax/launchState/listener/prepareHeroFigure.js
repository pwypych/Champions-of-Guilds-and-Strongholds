// @format

'use strict';

const debug = require('debug')('cogs:prepareHeroFigure');
// const _ = require('lodash');

module.exports = (walkie, db) => {
  return () => {
    (function init() {
      debug('init');
      onEveryPlayerReady();
    })();

    function onEveryPlayerReady() {
      walkie.onEvent('everyPlayerReady_', 'prepareHeroFigure.js', (data) => {
        debug('onEveryPlayerReady');
        findGameById(data.gameId);
      });
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
        addEveryHeroFigure(game);
      });
    }

    function addEveryHeroFigure(game) {
      const heroStartPositionArray = [];
      game.mapLayer.forEach((row, y) => {
        row.forEach((figure, x) => {
          if (figure.name === 'castleRandom') {
            const heroStartPosition = {};
            heroStartPosition.x = x;
            heroStartPosition.y = y + 1;
            heroStartPositionArray.push(heroStartPosition);
          }
        });
      });
      debug('heroStartPositionArray.length', heroStartPositionArray.length);

      debug('addEveryHeroFigure');
      updateGameMetaLaunch(game);
    }

    function updateGameMetaLaunch(game) {
      const query = { _id: game._id };

      // We need to update an object inside mongo array, must use its index in $set query
      const mongoFieldToSet = 'meta.launchState.isPrepareHeroFigure';
      const $set = {};
      $set[mongoFieldToSet] = true;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug(game._id, ': ERROR: update mongo error:', error);
          }

          triggerPrepareReady(game);
        }
      );
    }

    function triggerPrepareReady(game) {
      debug('triggerPrepareReady');
      walkie.triggerEvent('prepareReady_', 'prepareHeroFigure.js', {
        gameId: game._id
      });
    }
  };
};
