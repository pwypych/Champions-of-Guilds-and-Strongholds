// @format

'use strict';

const debug = require('debug')('cogs:prepareHeroFigure');
const _ = require('lodash');
const shortId = require('shortid');

module.exports = (db, blueprint) => {
  return (req, res, next) => {
    (function init() {
      debug('// Place every hero figure in front of a castle');
      const entities = res.locals.entities;

      generateHeroArray(entities);
    })();

    function generateHeroArray(entities) {
      const playerArray = [];

      _.forEach(entities, (entity, id) => {
        if (entity.playerData) {
          entity.id = id;
          playerArray.push(entity);
        }
      });

      const heroArray = [];
      _.forEach(playerArray, (player) => {

        // find castle for that player
        let castle;
        _.forEach(entities, (entity) => {
          if (
            entity.figureName === 'castleRandom' &&
            entity.owner === player.id
          ) {
            castle = entity;
          }
        });

        const hero = {};

        hero.owner = player.id;
        hero.figureName = blueprint.race[player.playerData.race].heroFigure;

        hero.position = {};
        hero.position.x = castle.position.x;
        hero.position.y = castle.position.y + 1;

        const spriteOffset = blueprint.race[player.playerData.race]
          .spriteOffset;
        hero.spriteOffset = spriteOffset;

        hero.heroStats = {
          current: { movement: 15 },
          base: { movement: 15 }
        };

        hero.unitAmounts = blueprint.race[player.playerData.race].unitAmounts;

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

      const field = 'figure_hero_' + shortId.generate();
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
