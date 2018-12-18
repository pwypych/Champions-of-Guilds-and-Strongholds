// @format

'use strict';

const debug = require('debug')('cogs:prepareHeroFigure');
const _ = require('lodash');

// What does this module do?
// Place every hero figure in front of a castle
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
        const entities = game;
        debug('findGameById', entities._id, 'error:', error);
        generateHeroStartPositionArray(entities);
      });
    }

    function generateHeroStartPositionArray(entities) {
      const heroStartPositionArray = [];

      _.forEach(entities, (entity) => {
        if (entity.figure === 'castleRandom') {
          const heroStartPosition = {};
          heroStartPosition.x = entity.position.x;
          heroStartPosition.y = entity.position.y + 1;
          heroStartPositionArray.push(heroStartPosition);
        }
      });

      debug(
        'generateHeroStartPositionArray: heroStartPositionArray.length:',
        heroStartPositionArray.length
      );
      generatePlayerIdArray(heroStartPositionArray, entities);
    }

    function generatePlayerIdArray(heroStartPositionArray, entities) {
      const playerIdArray = [];

      _.forEach(entities, (entity, id) => {
        if (entity.playerData) {
          playerIdArray.push(id);
        }
      });

      debug('generatePlayerIdArray', playerIdArray);
      forEachHeroStartPosition(heroStartPositionArray, playerIdArray, entities);
    }

    function forEachHeroStartPosition(
      heroStartPositionArray,
      playerIdArray,
      entities
    ) {
      const done = _.after(heroStartPositionArray.length, () => {
        debug('forEachHeroStartPosition: done!');
        triggerPrepareReady(entities);
      });

      debug('forEachHeroStartPosition');

      // We assume that playerIndex is based on position on mapLayer
      heroStartPositionArray.forEach((heroStartPosition, playerIndex) => {
        isStartPositionAvailable(
          entities,
          heroStartPosition,
          playerIndex,
          done
        );
      });
    }

    function isStartPositionAvailable(
      entities,
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
