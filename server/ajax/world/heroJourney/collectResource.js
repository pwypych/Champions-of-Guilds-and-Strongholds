// @format

'use strict';

const debug = require('debug')('cogs:collectResource');

module.exports = (db) => {
  return (gameId, playerId, resourceId, resourceEntity, callback) => {
    (function init() {
      debug(
        '// Library that works on callback. It updates playerResources and unset resource entity'
      );

      updateIncrementPlayerResources();
    })();

    function updateIncrementPlayerResources() {
      const query = { _id: gameId };
      const field =
        playerId + '.playerResources.' + resourceEntity.collect.resource;
      const $inc = {};
      $inc[field] = resourceEntity.collect.amount;
      const update = { $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: update mongo error:', error);
            callback('ERROR: update mongo error');
            return;
          }

          debug(
            'updateIncrementPlayerResources:',
            resourceEntity.collect.resource
          );
          updateUnsetResourceEntitiy();
        }
      );
    }

    function updateUnsetResourceEntitiy() {
      const query = { _id: gameId };
      const field = resourceId;
      const $unset = {};
      $unset[field] = true;
      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: update mongo error:', error);
            callback('ERROR: update mongo error');
            return;
          }

          debug('updateUnsetResourceEntitiy');
          callback(null);
        }
      );
    }
  };
};
