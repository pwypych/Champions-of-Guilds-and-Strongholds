// @format

'use strict';

const debug = require('debug')('cogs:prepareHeroFigure');
const _ = require('lodash');
const shortId = require('shortid');

module.exports = (db, raceBlueprint) => {
  return (req, res, next) => {
    (function init() {
      debug('// Place every hero figure in front of a castle');
      const entities = res.locals.entities;

      generateHeroArray(entities);
    })();

    function generateHeroArray(entities) {
      const playerArray = [];
      const castleRandomArray = [];

      _.forEach(entities, (entity, id) => {
        if (entity.playerData) {
          entity.id = id;
          playerArray.push(entity);
        }

        if (entity.figureName === 'castleRandom') {
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
        const races = raceBlueprint();

        hero.owner = player.id;
        hero.figureName = races[player.playerData.race].heroFigure;

        hero.position = {};
        hero.position.x = castleRandomArray[index].position.x;
        hero.position.y = castleRandomArray[index].position.y + 1;

        hero.spriteOffset = {};
        hero.spriteOffset.x = -9;
        hero.spriteOffset.y = -18;

        hero.heroStats = {
          current: { movement: 15 },
          base: { movement: 15 }
        };

        hero.unitAmounts = races[player.playerData.race].unitAmounts;

        heroArray.push(hero);
      });

      debug('generateHeroArray: heroArray.length:', heroArray);
      forEachHeroArray(heroArray, entities);
    }

    function forEachHeroArray(heroArray, entities) {
      const done = _.after(heroArray.length, () => {
        debug('forEachHeroArray: done!');
        next();
      });

      debug('forEachHeroArray');

      heroArray.forEach((hero) => {
        updateGame(hero, entities, done);
      });
    }

    function updateGame(hero, entities, done) {
      const gameId = entities._id;
      const query = { _id: gameId };

      const field = 'hero__' + shortId.generate();
      const $set = {};
      $set[field] = hero;
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
  };
};
