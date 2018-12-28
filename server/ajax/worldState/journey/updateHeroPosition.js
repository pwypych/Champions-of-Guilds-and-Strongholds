// @format

'use strict';

const debug = require('debug')('cogs:updateHeroStep');

// What does this module do?
// Library that works on callback. It update hero position and decrement heroStats.movement
module.exports = (db) => {
  return (gameId, heroId, position, callback) => {
    (function init() {
      debug('init');

      waitBefore();
    })();

    function waitBefore() {
      setTimeout(() => {
        debug('waitBefore: Waiting 250ms!');
        updateHeroPosition();
      }, 250);
    }

    function updateHeroPosition() {
      const query = { _id: gameId };

      const mongoFieldToSetHeroX = heroId + '.position.x';
      const mongoFieldToSetHeroY = heroId + '.position.y';
      const $set = {};
      $set[mongoFieldToSetHeroX] = position.toX;
      $set[mongoFieldToSetHeroY] = position.toY;

      const mongoFieldToSetMovement = heroId + '.heroStats.movement';
      const $inc = {};
      $inc[mongoFieldToSetMovement] = -1;

      const update = { $set: $set, $inc: $inc };
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

          debug('updateHeroPosition');
          callback(null);
        }
      );
    }
  };
};
