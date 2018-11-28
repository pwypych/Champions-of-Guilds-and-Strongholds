// @format

'use strict';

const debug = require('debug')('cogs:prepareHeroFigure');
const _ = require('lodash');

module.exports = (walkie, db) => {
  return () => {
    (function init() {
      debug('init');
      onPreparePlayerResources();
    })();

    function onPreparePlayerResources() {
      walkie.onEvent(
        'preparePlayerResources_',
        'prepareHeroFigure.js',
        (data) => {
          debug('onPreparePlayerResources');
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

      debug('forEachHeroStartPosition');

      // We assume that playerIndex is based on position on mapLayer
      heroStartPositionArray.forEach((heroStartPosition, playerIndex) => {
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
      instantiateHero(heroStartPosition, game, playerIndex, done);
    }

    function instantiateHero(heroStartPosition, game, playerIndex, done) {
      const hero = {};
      hero.x = heroStartPosition.x;
      hero.y = heroStartPosition.y;

      debug('instantiateHero: hero:', hero);
      updateHero(hero, game, playerIndex, done);
    }

    function updateHero(hero, game, playerIndex, done) {
      const query = { _id: game._id };

      const mongoFieldToSet = 'playerArray.' + playerIndex + '.hero';
      const $set = {};
      $set[mongoFieldToSet] = hero;
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

      walkie.triggerEvent('prepareHeroFigure_', 'prepareHeroFigure.js', {
        gameId: game._id
      });
    }
  };
};
