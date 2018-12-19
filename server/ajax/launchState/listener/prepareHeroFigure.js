// @format

'use strict';

const debug = require('debug')('cogs:prepareHeroFigure');
const _ = require('lodash');
const shortId = require('shortid');

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
        generateHeroArray(entities);
      });
    }

    function generateHeroArray(entities) {
      const playerArray = [];
      const castleRandomArray = [];

      _.forEach(entities, (entity, id) => {
        if (entity.playerData) {
          entity.id = id;
          playerArray.push(entity);
        }

        if (entity.figure === 'castleRandom') {
          entity.id = id;
          castleRandomArray.push(entity);
        }
      });

      if (playerArray.length !== castleRandomArray.length) {
        throw new Error('Castle and Player number are not equal');
      }

      const heroArray = [];
      _.forEach(playerArray, (player, index) => {
        const hero = {};
        hero.owner = player.id;
        hero.position = {};
        hero.position.x = castleRandomArray[index].position.x;
        hero.position.y = castleRandomArray[index].position.y + 1;
        hero.spriteOffset = {};
        hero.spriteOffset.x = -9;
        hero.spriteOffset.y = 0;
        hero.figure = 'heroHuman';
        hero.existsInState = 'worldState';
        heroArray.push(hero);
      });

      const gameId = entities._id;

      debug('generateHeroArray: heroArray.length:', heroArray);
      forEachHeroArray(heroArray, gameId);
    }

    function forEachHeroArray(heroArray, gameId) {
      const done = _.after(heroArray.length, () => {
        debug('forEachHeroArray: done!');
        triggerPrepareReady(gameId);
      });

      debug('forEachHeroArray');

      // We assume that playerIndex is based on position on mapLayer
      heroArray.forEach((hero) => {
        updateGame(hero, gameId, done);
      });
    }

    function updateGame(hero, gameId, done) {
      const query = { _id: gameId };

      const mongoFieldToSet = 'hero__' + shortId.generate();
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
            debug(gameId, ': ERROR: update mongo error:', error);
          }

          done();
        }
      );
    }

    function triggerPrepareReady(gameId) {
      debug('triggerPrepareReady');

      walkie.triggerEvent('prepareHeroFigure_', 'prepareHeroFigure.js', {
        gameId: gameId
      });
    }
  };
};
