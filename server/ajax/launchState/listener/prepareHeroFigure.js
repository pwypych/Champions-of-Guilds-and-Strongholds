// @format

'use strict';

const debug = require('debug')('cogs:prepareHeroFigure');
const _ = require('lodash');

module.exports = (walkie, db, figureManagerTree) => {
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
      forEachHeroStartPosition(heroStartPositionArray, game);
    }

    function forEachHeroStartPosition(heroStartPositionArray, game) {
      const done = _.after(heroStartPositionArray.length, () => {
        debug('forEachHeroStartPosition: done!');
        updateGameMetaLaunch(game);
      });

      heroStartPositionArray.forEach((playerStartPosition, playerIndex) => {
        debug('forEachPlayer', playerStartPosition);
        isStartPositionAvailable(game, playerStartPosition, playerIndex, done);
      });
    }

    function isStartPositionAvailable(
      game,
      playerStartPosition,
      playerIndex,
      done
    ) {
      if (!game.mapLayer[playerStartPosition.y][playerStartPosition.x]) {
        debug('Hero startPosition not exist');
        return;
      }

      debug('isStartPositionAvailable', playerStartPosition);
      instantiateHeroFigure(playerStartPosition, game, playerIndex, done);
    }

    function instantiateHeroFigure(
      playerStartPosition,
      game,
      playerIndex,
      done
    ) {
      const figureName = 'heroHuman';
      if (!figureManagerTree[figureName]) {
        debug('Cannot load figure that is required by the map: ' + figureName);
        return;
      }

      if (!figureManagerTree[figureName].produce) {
        debug(
          'Cannot load blueprint for figure that is required by the map: ' +
            figureName
        );
        return;
      }

      const figure = figureManagerTree[figureName].produce();

      // Add unique id to each figure instance
      figure._id = figureName + '_playerIndex' + playerIndex;
      figure.playerIndex = playerIndex;

      debug('instantiateHeroFigure:', figure);
      replaceFoundFigureWithHero(playerStartPosition, game, figure, done);
    }

    function replaceFoundFigureWithHero(
      playerStartPosition,
      game,
      figure,
      done
    ) {
      const query = { _id: game._id };

      // We need to update an object inside mongo array, must use its index in $set query
      const mongoFieldToSet =
        'mapLayer.' + playerStartPosition.y + '.' + playerStartPosition.x;
      const $set = {};
      $set[mongoFieldToSet] = figure;
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

          done();
        }
      );
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
