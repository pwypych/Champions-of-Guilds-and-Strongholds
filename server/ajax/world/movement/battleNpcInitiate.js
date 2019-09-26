// @format

'use strict';

const debug = require('debug')('cogs:battleNpcInitiate');
const _ = require('lodash');
const shortid = require('shortid');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Checks if end of path is npc battle, zeros hero movement points and creates battle entity'
      );
      const entities = res.locals.entities;
      const heroId = res.locals.entityId;
      const path = res.locals.path;
      const position = path[path.length - 1];

      checkIsPositionBattle(entities, heroId, position);
    })();

    function checkIsPositionBattle(entities, heroId, position) {
      debug('checkIsPositionBattle');
      const battleArray = [];

      _.forEach(entities, (entity, id) => {
        if (entity.unitAmounts && !entity.heroStats && !entity.dead) {
          [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 }
          ].forEach((offset) => {
            if (
              entity.position.x === position.x + offset.x &&
              entity.position.y === position.y + offset.y
            ) {
              debug('checkIsPositionBattle: Battle Npc On position:', position);

              const battle = {};
              battle.attackerId = heroId;
              battle.defenderId = id;
              battle.battleStatus = 'pending_npc';
              battle.battleHeight = 11;
              battle.battleWidth = 13;
              battleArray.push(battle);
            }
          });
        }
      });

      if (_.isEmpty(battleArray)) {
        debug('checkIsPositionBattle: No battle npc found!');
        next();
        return;
      }

      debug(
        'checkIsPositionBattle: Yes ' +
          battleArray.length +
          ' battle npc found!'
      );
      zeroHeroMovement(entities, heroId, battleArray);
    }

    function zeroHeroMovement(entities, heroId, battleArray) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const movementField = heroId + '.heroStats.current.movement';
      const $set = {};
      $set[movementField] = 0;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('zeroHeroMovement: mongo error:', error);
            next();
            return;
          }

          forEachBattle(entities, battleArray);
        }
      );
    }

    function forEachBattle(entities, battleArray) {
      const done = _.after(battleArray.length, () => {
        debug('forEachBattle: Done!');
        next();
      });

      battleArray.forEach((battle) => {
        checkIfBattleExists(entities, battle, done);
      });
    }

    function checkIfBattleExists(entities, battle, done) {
      let battleExists = false;

      _.forEach(entities, (entity) => {
        if (entity.battleStatus) {
          if (
            entity.attackerId === battle.attackerId &&
            entity.defenderId === battle.defenderId
          ) {
            battleExists = true;
          }
        }
      });

      if (battleExists) {
        debug('checkIfBattleExists: Yes, battle allready exist!');
        return;
      }

      debug('checkIfBattleExists: Not, battle not existing, inserting new!');
      insertBattleEntity(entities, battle, done);
    }

    function insertBattleEntity(entities, battle, done) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const battleField = 'battle__' + shortid.generate();
      const $set = {};
      $set[battleField] = battle;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('insertBattleEntity: mongo error:', error);
            next();
            return;
          }

          debug('insertBattleEntity: battle.id:', battleField);
          done();
        }
      );
    }
  };
};
