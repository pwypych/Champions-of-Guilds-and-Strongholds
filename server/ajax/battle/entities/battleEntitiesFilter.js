// @format

'use strict';

const debug = require('debug')('nope:cogs:battleEntitiesFilter');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Send filtered info about actual battle');

      const entities = res.locals.entities;
      const playerId = res.locals.playerId;

      compareState(entities, playerId);
    })();

    function compareState(entities, playerId) {
      const gameId = entities._id;
      const gameEntity = entities[gameId];

      if (gameEntity.state !== 'battleState') {
        debug('compareState: not battleState!');
        next();
        return;
      }

      debug('compareState: state ok!', gameEntity.state);
      generateBattleEntities(entities, playerId);
    }

    function generateBattleEntities(entities, playerId) {
      const battleEntities = {};
      battleEntities._id = entities._id;

      _.forEach(entities, (entity, id) => {
        // Game entity
        if (entity.mapData && entity.state) {
          battleEntities[id] = entity;
        }

        // Battle entity
        if (entity.battleStatus === 'active') {
          battleEntities[id] = entity;
        }

        // Unit entities
        if (entity.unitName) {
          battleEntities[id] = entity;
        }

        // Player entities
        if (entity.playerToken && entity.playerData) {
          battleEntities[id] = {
            playerData: entity.playerData
          };

          // Player current
          if (id === playerId) {
            battleEntities[id].playerCurrent = true;
          }
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
