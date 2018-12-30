// @format

'use strict';

const debug = require('debug')('cogs:refillHeroMovement.js');
const _ = require('lodash');

// What does this module do?
// Middleware, set hero.movement to hero.movementMax
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      generateHeroArray();
    })();

    function generateHeroArray() {
      const heroArray = [];
      const entities = res.locals.entities;

      _.forEach(entities, (entity, id) => {
        if (entity.heroStats) {
          const hero = {};
          hero.id = id;
          hero.movementMax = entity.heroStats.movementMax;

          heroArray.push(hero);
        }
      });

      debug('generateHeroArray: heroArray:', heroArray);
      updateSetHeroMovementToMax(heroArray);
    }

    function updateSetHeroMovementToMax(heroArray) {
      const gameId = res.locals.entities._id;
      const query = { _id: gameId };
      const $set = {};
      heroArray.forEach((hero) => {
        const component = hero.id + '.heroStats.movement';
        $set[component] = hero.movementMax;
      });
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetHeroMovementToMax: error:', error);
            return;
          }

          next();
        }
      );
    }
  };
};
