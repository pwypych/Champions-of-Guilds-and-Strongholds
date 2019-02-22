// @format

'use strict';

const debug = require('debug')('cogs:recentActivityOnMovement');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Updates recentActivity to onMovement');
      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;
      const unitPath = res.locals.unitPath;

      generateRecentActivity(gameId, unitId, unitPath);
    })();

    function generateRecentActivity(gameId, unitId, unitPath) {
      const recentActivity = {};
      recentActivity.name = 'onMovement';
      recentActivity.unitPath = unitPath;
      recentActivity.timestamp = Date.now();

      updateRecentActivity(gameId, unitId, recentActivity);
    }

    function updateRecentActivity(gameId, unitId, recentActivity) {
      const query = { _id: gameId };

      const field = unitId + '.recentActivity';
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
