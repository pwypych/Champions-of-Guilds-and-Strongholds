// @format

'use strict';

const debug = require('debug')('nope:cogs:launchEntitiesFilter');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Send filtered info about players setup');
      const entities = res.locals.entities;

      compareState(entities);
    })();

    function compareState(entities) {
      const gameId = entities._id;
      const gameEntity = entities[gameId];

      if (gameEntity.state !== 'launchState') {
        debug('compareState: not launchState!');
        next();
        return;
      }

      debug('compareState: state ok!', gameEntity.state);
      generateLaunchEntities(entities);
    }

    function generateLaunchEntities(entities) {
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
            readyForLaunch: entity.readyForLaunch
          };

          // Player current
          if (id === playerId) {
            filteredEntities[id].playerCurrent = true;
          }
        }
      });

      debug('generateLaunchEntities: filteredEntities', filteredEntities);

      addFilteredEntitiesToLocals(filteredEntities);
    }

    function addFilteredEntitiesToLocals(filteredEntities) {
      debug('addFilteredEntitiesToLocals');
      res.locals.filteredEntities = filteredEntities;
      next();
    }
  };
};
