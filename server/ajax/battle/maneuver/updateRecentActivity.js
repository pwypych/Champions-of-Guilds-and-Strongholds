// @format

'use strict';

const debug = require('debug')('cogs:updateRecentActivity');

module.exports = (db) => {
  return (gameId, unitId, recentActivity, callback) => {
    (function init() {
      debug('// Updates given unit recentActivity with new data');

      updateRecentActivity();
    })();

    function updateRecentActivity() {
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
          callback(null);
        }
      );
    }
  };
};
