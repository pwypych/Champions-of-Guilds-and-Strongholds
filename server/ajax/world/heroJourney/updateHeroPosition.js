// @format

'use strict';

const debug = require('debug')('cogs:updateHeroPosition');

module.exports = (db) => {
  return (gameId, heroId, position, callback) => {
    (function init() {
      debug(
        '// Library that works on callback. It update hero position and decrement heroStats.movement'
      );

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

      const fieldHeroX = heroId + '.position.x';
      const fieldHeroY = heroId + '.position.y';
      const $set = {};
      $set[fieldHeroX] = position.x;
      $set[fieldHeroY] = position.y;

      const fieldMovement = heroId + '.heroStats.movement';
      const $inc = {};
      $inc[fieldMovement] = -1;

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
