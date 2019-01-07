// @format

'use strict';

const debug = require('debug')('nope:cogs:battleEntitiesGet');
const _ = require('lodash');

// What does this module do?
// Send info about actual battle
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      const entities = res.locals.entities;

      compareState(entities);
    })();

    function compareState(entities) {
      const gameId = entities._id;
      const gameEntity = entities[gameId];

      if (gameEntity.state !== 'battleState') {
        debug('compareState: not worldState!');
        next();
        return;
      }

      debug('compareState: state ok!', gameEntity.state);
      generateBattleEntities(entities);
    }

    function generateBattleEntities(entities) {
      const battleEntities = {};
      battleEntities._id = entities._id;

      _.forEach(entities, (entity, id) => {
        if (entity.battleStatus === 'pending') {
          battleEntities[id] = entity;
        }
      });

      debug('generateData: battleEntities', battleEntities);
      sendBattleEntities(battleEntities);
    }

    function sendBattleEntities(battleEntities) {
      debug('sendBattleEntities');
      res.send(battleEntities);
      debug('******************** ajax ********************');
    }
  };
};
