// @format

'use strict';

const debug = require('debug')('cogs:collectResource');

// What does this module do?
// Library that works on callback. It update playerResources and unset resource entity
module.exports = (db) => {
  return (gameId, playerId, resource, callback) => {
    (function init() {
      debug('init');
      updateIncrementPlayerResources();
    })();

    function updateIncrementPlayerResources() {
      const query = { _id: gameId };
      const field = playerId + '.playerResources.' + resource.name;
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
            debug('ERROR: update mongo error:', error);
            callback('ERROR: update mongo error');
            return;
          }

          debug('updateIncrementPlayerResources:', resource.name);
          updateUnsetResourceEntitiy();
        }
      );
    }

    function updateUnsetResourceEntitiy() {
      const query = { _id: gameId };
      const field = resource.id;
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
