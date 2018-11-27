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
        generateHeroStartPositionArray(game);
      });
    }

    function generateHeroStartPositionArray(game) {
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

      debug(
        'generateHeroStartPositionArray: heroStartPositionArray.length:',
        heroStartPositionArray.length
      );
      forEachHeroStartPosition(heroStartPositionArray, game);
    }

    function forEachHeroStartPosition(heroStartPositionArray, game) {
      const done = _.after(heroStartPositionArray.length, () => {
        debug('forEachHeroStartPosition: done!');
        triggerPrepareReady(game);
      });

      // We assume that playerIndex is based on position on mapLayer
      heroStartPositionArray.forEach((heroStartPosition, playerIndex) => {
        debug('forEachHeroStartPosition', heroStartPosition);
        isStartPositionAvailable(game, heroStartPosition, playerIndex, done);
      });
    }

    function isStartPositionAvailable(
      game,
      heroStartPosition,
      playerIndex,
      done
    ) {
      if (!game.mapLayer[heroStartPosition.y][heroStartPosition.x]) {
        debug('Hero startPosition not exist');
        done();
        return;
      }

      debug('isStartPositionAvailable: yes!');
      instantiateHeroFigure(heroStartPosition, game, playerIndex, done);
    }

    function instantiateHeroFigure(heroStartPosition, game, playerIndex, done) {
      const race = game.playerArray[playerIndex].race;
      const raceCapital = race.charAt(0).toUpperCase() + race.slice(1);
      const figureName = 'hero' + raceCapital;

      if (!figureManagerTree[figureName]) {
        debug('Cannot load figure that is required by the map: ' + figureName);
        done();
        return;
      }

      if (!figureManagerTree[figureName].produce) {
        debug(
          'Cannot load blueprint for figure that is required by the map: ' +
            figureName
        );
        done();
        return;
      }

      const heroFigure = figureManagerTree[figureName].produce();

      heroFigure._id = figureName + '_playerIndex' + playerIndex;
      heroFigure.playerIndex = playerIndex;

      debug('instantiateHeroFigure:', heroFigure);
      replaceMapFigureWitheHeroFigure(
        heroStartPosition,
        game,
        heroFigure,
        done
      );
    }

    function replaceMapFigureWitheHeroFigure(
      heroStartPosition,
      game,
      heroFigure,
      done
    ) {
      const query = { _id: game._id };

      const mongoFieldToSet =
        'mapLayer.' + heroStartPosition.y + '.' + heroStartPosition.x;
      const $set = {};
      $set[mongoFieldToSet] = heroFigure;
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

    function triggerPrepareReady(game) {
      debug('triggerPrepareReady');

      walkie.triggerEvent('prepareReady_', 'prepareHeroFigure.js', {
        gameId: game._id,
        flagName: 'isPrepareHeroFigure'
      });
    }
  };
};
