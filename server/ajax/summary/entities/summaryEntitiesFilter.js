// @format

'use strict';

const debug = require('debug')('nope:cogs:summaryEntitiesFilter');
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
      const filteredEntities = {};
      filteredEntities._id = entities._id;

      _.forEach(entities, (entity, id) => {
        // Game entity
        if (entity.mapData && entity.state) {
          filteredEntities[id] = entity;
        }

        // Battle entity
        if (entity.battleStatus === 'active') {
          filteredEntities[id] = entity;
        }

        // Unit entities
        if (entity.unitName) {
          filteredEntities[id] = entity;
        }

        // Player entities
        if (entity.playerToken && entity.playerData) {
          filteredEntities[id] = {
            playerData: entity.playerData
          };

          // Player current
          if (id === playerId) {
            filteredEntities[id].playerCurrent = true;
          }
        }
      });

      debug('generateData: filteredEntities', filteredEntities);
      addFilteredEntitiesToLocals(filteredEntities);
    }

    function addFilteredEntitiesToLocals(filteredEntities) {
      debug('addFilteredEntitiesToLocals');
      res.locals.filteredEntities = filteredEntities;
      next();
    }
  };
};
