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
      generateEntitiesFiltered(entities);
    }

    function generateEntitiesFiltered(entities) {
      const playerId = res.locals.playerId;

      const entitiesFiltered = {};
      entitiesFiltered._id = entities._id;

      _.forEach(entities, (entity, id) => {
        // Game entity
        if (entity.mapData && entity.state) {
          entitiesFiltered[id] = entity;
        }

        // Player entities
        if (entity.playerToken && entity.playerData) {
          entitiesFiltered[id] = {
            playerData: entity.playerData,
            endTurn: entity.endTurn
          };

          // Player current
          if (id === playerId) {
            entitiesFiltered[id].playerCurrent = true;
            entitiesFiltered[id].playerResources = entity.playerResources;
          }
        }

        // Figure entities
        if (entity.figureName) {
          entitiesFiltered[id] = entity;
        }

        // Fortification entities
        if (entity.fortificationName) {
          entitiesFiltered[id] = entity;
        }
      });

      debug('generateData: entitiesFiltered', entitiesFiltered);
      addEntitiesFilteredToLocals(entitiesFiltered);
    }

    function addEntitiesFilteredToLocals(entitiesFiltered) {
      debug('addEntitiesFilteredToLocals');
      res.locals.entitiesFiltered = entitiesFiltered;
      next();
    }
  };
};
