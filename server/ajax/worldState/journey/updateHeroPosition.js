// @format

'use strict';

const debug = require('debug')('nope:cogs:processHeroStep');

module.exports = (db) => {
  return (gameId, heroId, position, callback) => {
    (function init() {
      debug('init');
      updateHeroPosition();
    })();

    function updateHeroPosition(ctx) {
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
        (error, result) => {
          if (error) {
            debug(': ERROR: insert mongo error:', error);
            return;
          }

          debug('updateHeroPosition', result.result);
        }
      );
    }
  };
};
