// @format

'use strict';

const debug = require('debug')('cogs:collectResource');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Checks if end of path is resource, update player resources and marks resource as invisible and used up'
      );
      const entities = res.locals.entities;
      const heroId = res.locals.entityId;
      const path = res.locals.path;
      const position = path[path.length - 1];

      checkIsPositionCollectable(entities, heroId, position);
    })();

    function checkIsPositionCollectable(entities, heroId, position) {
      let resourceId;

      _.forEach(entities, (entity, id) => {
        if (entity.figureName) {
          if (
            entity.position.x === position.x &&
            entity.position.y === position.y
          ) {
            if (entity.resource && !entity.dead) {
              debug('checkIsPositionCollectable: resource:', id);
              resourceId = id;
            }
          }
        }
      });

      if (!resourceId) {
        debug('checkIsPositionCollectable: No!');
        next();
        return;
      }

      debug('checkIsPositionCollectable: Yes!');
      updateIncrementPlayerResources(entities, heroId, resourceId);
    }

    function updateIncrementPlayerResources(entities, heroId, resourceId) {
      const gameId = entities._id;
      const playerId = entities[heroId].owner;
      const entity = entities[resourceId];

      const query = { _id: gameId };
      const field = playerId + '.playerResources.' + entity.resource.name;
      const $inc = {};
      $inc[field] = entity.resource.amount;
      const update = { $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateIncrementPlayerResources: mongo error:', error);
            return;
          }

          debug('updateIncrementPlayerResources:', entity.resource);
          generateRecentActivity(entities, resourceId);
        }
      );
    }

    function generateRecentActivity(entities, resourceId) {
      const recentActivity = {};
      recentActivity.name = 'hasBeenCollected';
      recentActivity.timestamp = Date.now();

      updateResourceEntity(entities, resourceId, recentActivity);
    }

    function updateResourceEntity(entities, resourceId, recentActivity) {
      const gameId = entities._id;

      const query = { _id: gameId };

      const $set = {};

      const fieldRecentActivity = resourceId + '.recentActivity';
      $set[fieldRecentActivity] = recentActivity;

      const fieldDead = resourceId + '.dead';
      $set[fieldDead] = true;

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateResourceEntity: mongo error:', error);
            return;
          }

          debug('updateResourceEntity: Dead!');
          next();
        }
      );
    }
  };
};
