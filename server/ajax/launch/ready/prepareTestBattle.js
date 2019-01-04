// @format

'use strict';

const debug = require('debug')('cogs:prepareTestBattle');
const _ = require('lodash');
const shortId = require('shortid');

// What does this module do?
// Creates a mock of battle entity with pending battleStatus used to run game in battleState
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;

      debug('init');
      generatePendingBattle(entities);
    })();

    function generatePendingBattle(entities) {
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

      const battle = {
        left: _.sample(heroIdArray),
        right: _.sample(enemyFigureIdArray),
        battleStatus: 'pending'
      };

      debug('generatePendingBattle: battle', battle);
      updateGame(entities, battle);
    }

    function updateGame(entities, battle) {
      const gameId = entities._id;
      const query = { _id: gameId };

      const field = 'battle__' + shortId.generate();
      const $set = {};
      $set[field] = battle;
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
