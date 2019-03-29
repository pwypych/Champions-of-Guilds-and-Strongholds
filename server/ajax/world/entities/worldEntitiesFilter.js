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

      const dentitiesFiltered = {};
      dentitiesFiltered._id = entities._id;

      _.forEach(entities, (entity, id) => {
        // Game entity
        if (entity.mapData && entity.state) {
          dentitiesFiltered[id] = entity;
        }

        // Player entities
        if (entity.playerToken && entity.playerData) {
          dentitiesFiltered[id] = {
            playerData: entity.playerData,
            endTurn: entity.endTurn
          };

          // Player current
          if (id === playerId) {
            dentitiesFiltered[id].playerCurrent = true;
            dentitiesFiltered[id].playerResources = entity.playerResources;
          }
        }

        // Figure entities
        if (entity.figureName) {
          dentitiesFiltered[id] = entity;
        }
      });

      debug('generateData: dentitiesFiltered', dentitiesFiltered);
      addEntitiesFilteredToLocals(dentitiesFiltered);
    }

    function addEntitiesFilteredToLocals(dentitiesFiltered) {
      debug('addEntitiesFilteredToLocals');
      res.locals.dentitiesFiltered = dentitiesFiltered;
      next();
    }
  };
};
