// @format

'use strict';

const debug = require('debug')('cogs:prepareHeroForBattle');
const shortid = require('shortid');

// What does this module do?
// Library that works on callback. It adds battle entity and zero hero movement points
module.exports = (db) => {
  return (gameId, battle, callback) => {
    (function init() {
      debug('init');

      insertBattleEntityAndZeroHeroMovement();
    })();

    function insertBattleEntityAndZeroHeroMovement() {
      const query = { _id: gameId };
      const battleField = 'battle__' + shortid.generate();
      const movementField = battle.attackerId + '.heroStats.movement';
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
