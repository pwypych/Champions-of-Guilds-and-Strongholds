// @format

'use strict';

const debug = require('debug')('cogs:worldEntitiesGet');
const _ = require('lodash');

// What does this module do?
// Send info about player and opponents
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

      const worldEntities = {};
      worldEntities._id = entities._id;

      _.forEach(entities, (entity, id) => {
        // Game entity
        if (entity.mapName && entity.state) {
          worldEntities[id] = entity;
        }

        // Player entities
        if (entity.playerToken && entity.playerData) {
          worldEntities[id] = {
            playerData: entity.playerData
          };

          // Player current
          if (id === playerId) {
            worldEntities[id].playerCurrent = true;
            worldEntities[id].playerResources = entity.playerResources;
          }
        }

        // Figure entities
        if (entity.figure) {
          worldEntities[id] = entity;
        }
      });

      debug('generateData: worldEntities', worldEntities);
      sendWorldEntities(worldEntities);
    }

    function sendWorldEntities(worldEntities) {
      debug('sendWorldEntities');
      res.send(worldEntities);
      debug('******************** ajax ********************');
    }
  };
};
