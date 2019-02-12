// @format

'use strict';

const debug = require('debug')('cogs:prepareHeroForBattle');
const shortid = require('shortid');

module.exports = (db) => {
  return (gameId, heroId, battle, callback) => {
    (function init() {
      debug(
        '// Library that works on callback. It adds battle entity and zero hero movement points'
      );

      insertBattleEntityAndZeroHeroMovement();
    })();

    function insertBattleEntityAndZeroHeroMovement() {
      const query = { _id: gameId };
      const battleField = 'battle__' + shortid.generate();
      const movementField = heroId + '.heroStats.movement';
      const $set = {};
      $set[battleField] = battle;
      $set[movementField] = 0;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug(gameId, ': ERROR: update mongo error:', error);
            callback('Update mongo error');
          }

          callback(null);
        }
      );
    }
  };
};
