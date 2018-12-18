// @format

'use strict';

const debug = require('debug')('cogs:launchStateDataGet');
const _ = require('lodash');

// What does this module do?
// Send info about players setup
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
      const state = gameEntity.state;

      if (state !== 'launchState') {
        debug('compareState: not launchState!');
        next();
        return;
      }

      generateLaunchEntities(entities);
    }

    function generateLaunchEntities(entities) {
      const playerId = res.locals.playerId;

      const launchEntities = {};
      launchEntities._id = entities._id;

      _.forEach(entities, (entity, id) => {
        // game entity
        if (entity.mapName || entity.state) {
          launchEntities[id] = entity;
        }

        // player entities
        if (entity.playerToken || entity.playerData) {
          launchEntities[id] = {
            playerData: entity.playerData
          };

          // player current
          if (id === playerId) {
            launchEntities[id].playerCurrent = true;
          }
        }
      });

      debug('generateLaunchEntities: launchEntities', launchEntities);

      sendResponce(launchEntities);
    }

    function sendResponce(launchEntities) {
      debug('sendResponce');
      res.send(launchEntities);
      debug('******************** ajax ********************');
    }
  };
};
