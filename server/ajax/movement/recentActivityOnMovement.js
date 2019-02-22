// @format

'use strict';

const debug = require('debug')('cogs:recentActivityOnMovement');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Updates recentActivity to onMovement');
      const entities = res.locals.entities;
      const gameId = entities._id;
      const entityId = res.locals.entityId;
      const path = res.locals.path;

      generateRecentActivity(gameId, entityId, path);
    })();

    function generateRecentActivity(gameId, entityId, path) {
      const recentActivity = {};
      recentActivity.name = 'onMovement';
      recentActivity.path = path;
      recentActivity.timestamp = Date.now();

      updateRecentActivity(gameId, entityId, recentActivity);
    }

    function updateRecentActivity(gameId, entityId, recentActivity) {
      const query = { _id: gameId };

      const field = entityId + '.recentActivity';
      const $set = {};
      $set[field] = recentActivity;

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateRecentActivity: ERROR:', error);
          }
          debug('updateRecentActivity: Success!');
          next();
        }
      );
    }
  };
};
