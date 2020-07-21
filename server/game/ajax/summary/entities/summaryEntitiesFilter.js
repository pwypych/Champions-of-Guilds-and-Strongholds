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
      generateEntitiesFiltered(entities, playerId);
    }

    function generateEntitiesFiltered(entities, playerId) {
      const entitiesFiltered = {};
      entitiesFiltered._id = entities._id;

      _.forEach(entities, (entity, id) => {
        // Game entity
        if (entity.mapData && entity.state) {
          entitiesFiltered[id] = entity;
        }

        // Battle entity
        if (entity.battleStatus === 'active') {
          entitiesFiltered[id] = entity;
        }

        // Unit entities
        if (entity.unitName) {
          entitiesFiltered[id] = entity;
        }

        // Player entities
        if (entity.playerToken && entity.playerData) {
          entitiesFiltered[id] = {
            playerData: entity.playerData
          };

          // Player current
          if (id === playerId) {
            entitiesFiltered[id].playerCurrent = true;
          }
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
