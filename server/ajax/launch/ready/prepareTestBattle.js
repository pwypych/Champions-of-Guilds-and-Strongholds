// @format

'use strict';

const debug = require('debug')('cogs:prepareTestBattle');
const _ = require('lodash');
const shortId = require('shortid');

// What does this module do?
// Creates a mock of wishedBattle entity, used to run game in battleState
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;

      debug('init');
      generateWishedBattle(entities);
    })();

    function generateWishedBattle(entities) {
      const heroIdArray = [];

      _.forEach(entities, (entity, id) => {
        if (entity.heroStats) {
          heroIdArray.push(id);
        }
      });

      const enemyFigureIdArray = [];

      _.forEach(entities, (entity, id) => {
        if (entity.battleEnemies) {
          enemyFigureIdArray.push(id);
        }
      });

      const wishedBattle = {
        left: _.sample(heroIdArray),
        right: _.sample(enemyFigureIdArray)
      };

      debug('generateWishedBattle: wishedBattle', wishedBattle);
      updateGame(entities, wishedBattle);
    }

    function updateGame(entities, wishedBattle) {
      const gameId = entities._id;
      const query = { _id: gameId };

      const field = 'wishedBattle__' + shortId.generate();
      const $set = {};
      $set[field] = wishedBattle;
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

          debug('updateGame');
          next();
        }
      );
    }
  };
};
