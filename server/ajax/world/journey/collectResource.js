// @format

'use strict';

const debug = require('debug')('cogs:collectResource');

// What does this module do?
// Library that works on callback. It update playerResources
module.exports = (db) => {
  return (gameId, playerId, resource, callback) => {
    (function init() {
      debug('init');

      updateIncrementPlayerResources();
    })();

    function updateIncrementPlayerResources() {
      const query = { _id: gameId };

      const field = playerId + '.playerResources.' + resource.resource;
      const $inc = {};
      $inc[field] = resource.value;

      const update = { $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: insert mongo error:', error);
            callback('ERROR: insert mongo error');
            return;
          }

          debug('updateIncrementPlayerResources');
          callback(null);
        }
      );
    }
  };
};
