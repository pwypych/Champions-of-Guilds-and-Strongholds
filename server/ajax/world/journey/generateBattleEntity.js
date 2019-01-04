// @format

'use strict';

const debug = require('debug')('cogs:generateBattleEntity');
const _ = require('lodash');
const shortid = require('shortid');

// What does this module do?
// Library that works on callback. It adds wishedBattle entity and zero hero movement points
module.exports = (db) => {
  return (gameId, battleArray, callback) => {
    (function init() {
      debug('init');

      forEachWishedBattleArray();
    })();

    function forEachWishedBattleArray() {
      const done = _.after(battleArray.length, () => {
        debug('forEachWishedBattleArray: done!');
        callback(null);
      });

      debug('forEachWishedBattleArray');

      battleArray.forEach((battle) => {
        insertBattleEntity(battle, done);
      });
    }

    function insertBattleEntity(battle, done) {
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
          }

          done();
        }
      );
    }
  };
};
