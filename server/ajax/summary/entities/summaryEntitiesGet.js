// @format

'use strict';

const debug = require('debug')('nope:cogs:summaryEntitiesGet');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Send filtered info about actual summary');

      const entities = res.locals.entities;
      const playerId = res.locals.playerId;

      compareState(entities, playerId);
    })();

    function compareState(entities, playerId) {
      const gameId = entities._id;
      const gameEntity = entities[gameId];

      if (gameEntity.state !== 'summaryState') {
        debug('compareState: not summaryState!');
        next();
        return;
      }

      debug('compareState: state ok!', gameEntity.state);
      generateSummaryEntities(entities, playerId);
    }

    function generateSummaryEntities(entities, playerId) {
      const summaryEntities = {};
      summaryEntities._id = entities._id;

      _.forEach(entities, (entity, id) => {
        // Game entity
        if (entity.mapData && entity.state) {
          summaryEntities[id] = entity;
        }

        // Battle entity
        if (entity.battleStatus === 'active') {
          summaryEntities[id] = entity;
        }

        // Unit entities
        if (entity.unitName) {
          summaryEntities[id] = entity;
        }

        // Player entities
        if (entity.playerToken && entity.playerData) {
          summaryEntities[id] = {
            playerData: entity.playerData
          };

          // Player current
          if (id === playerId) {
            summaryEntities[id].playerCurrent = true;
          }
        }
      });

      debug('generateData: summaryEntities', summaryEntities);
      sendSummaryEntities(summaryEntities);
    }

    function sendSummaryEntities(summaryEntities) {
      debug('sendSummaryEntities');
      res.send(summaryEntities);
      debug('******************** ajax ********************');
    }
  };
};
