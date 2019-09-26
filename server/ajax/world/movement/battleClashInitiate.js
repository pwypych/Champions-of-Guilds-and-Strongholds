// @format

'use strict';

const debug = require('debug')('cogs:battleClashInitiate');
const _ = require('lodash');
const shortid = require('shortid');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Checks if end of path is clash (hero) battle, zeros both hero movement points and creates battle entity'
      );
      const entities = res.locals.entities;
      const heroAttackerId = res.locals.entityId;
      const path = res.locals.path;
      const position = path[path.length - 1];

      checkIsPositionBattle(entities, heroAttackerId, position);
    })();

    function checkIsPositionBattle(entities, heroAttackerId, position) {
      debug('checkIsPositionBattle');
      const battleArray = [];

      _.forEach(entities, (entity, id) => {
        if (
          entity.unitAmounts &&
          entity.heroStats &&
          !entity.dead &&
          id !== heroAttackerId
        ) {
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
              debug(
                'checkIsPositionBattle: Battle Clash On position:',
                position
              );

              const battle = {};
              battle.attackerId = heroAttackerId;
              battle.defenderId = id;
              battle.battleStatus = 'pending_clash';
              battle.battleHeight = 11;
              battle.battleWidth = 13;
              battleArray.push(battle);
            }
          });
        }
      });

      if (_.isEmpty(battleArray)) {
        debug('checkIsPositionBattle: No battle clash found!');
        next();
        return;
      }

      debug(
        'checkIsPositionBattle: Yes ' +
          battleArray.length +
          ' battle clash found!'
      );
      zeroHeroAttackerMovement(entities, heroAttackerId, battleArray);
    }

    function zeroHeroAttackerMovement(entities, heroAttackerId, battleArray) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const movementField = heroAttackerId + '.heroStats.current.movement';
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
            debug('zeroHeroAttackerMovement: mongo error:', error);
            next();
            return;
          }

          debug('zeroHeroAttackerMovement');
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
        zeroHeroDefenderMovement(entities, battle, done);
      });
    }

    function zeroHeroDefenderMovement(entities, battle, done) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const movementField = battle.defenderId + '.heroStats.current.movement';
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
            debug('zeroHeroDefenderMovement: mongo error:', error);
            next();
            return;
          }

          debug('zeroHeroDefenderMovement');
          checkIfBattleExists(entities, battle, done);
        }
      );
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
