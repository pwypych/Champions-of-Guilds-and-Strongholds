// @format

'use strict';

const debug = require('debug')('nope:cogs:worldEntitiesFilter');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Send filtered info about player and opponents');

      const entities = res.locals.entities;

      compareState(entities);
    })();

    function compareState(entities) {
      const gameId = entities._id;
      const gameEntity = entities[gameId];

      if (gameEntity.state !== 'worldState') {
        debug('compareState: not worldState!');
        next();
        return;
      }

      debug('compareState: state ok!', gameEntity.state);
      generateWorldEntities(entities);
    }

    function generateWorldEntities(entities) {
      const playerId = res.locals.playerId;

      const filteredEntities = {};
      filteredEntities._id = entities._id;

      _.forEach(entities, (entity, id) => {
        // Game entity
        if (entity.mapData && entity.state) {
          filteredEntities[id] = entity;
        }

        // Player entities
        if (entity.playerToken && entity.playerData) {
          filteredEntities[id] = {
            playerData: entity.playerData,
            endTurn: entity.endTurn
          };

          // Player current
          if (id === playerId) {
            filteredEntities[id].playerCurrent = true;
            filteredEntities[id].playerResources = entity.playerResources;
          }
        }

        // Figure entities
        if (entity.figureName) {
          filteredEntities[id] = entity;
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
