// @format

'use strict';

const debug = require('debug')('cogs:createBattle');
const _ = require('lodash');
const shortId = require('shortid');

// What does this module do?
// Checks if battle with battleStatus "pending" exists. Spawns units and obsticles. Attacker is always a player. Changes battleStatus to "active".
module.exports = (db, unitStats) => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;

      debug('init');
      checkIfPendingBattleExists(entities);
    })();

    function checkIfPendingBattleExists(entities) {
      let battleId;

      _.forEach(entities, (entity, id) => {
        if (entity.battleStatus === 'pending') {
          battleId = id;
        }
      });

      if (!battleId) {
        debug('checkIfPendingBattleExists: No battle is pending!');
        next();
        return;
      }

      debug('checkIfPendingBattleExists: battleId:', battleId);
      generateUnits(entities, battleId);
    }

    function generateUnits(entities, battleId) {
      const battle = entities[battleId];
      const attackerId = battle.attackerId;
      const defenderId = battle.defenderId;

      const attackerUnitCounts = entities[attackerId].unitCounts;
      const defenderUnitCounts = entities[defenderId].unitCounts;

      debug('generateUnits:attackerUnitCounts:', attackerUnitCounts);
      debug('generateUnits:defenderUnitCounts:', defenderUnitCounts);

      const units = {};

      // battle map is 15 x 20
      const attackerPositions = [
        { x: 1, y: 7 },
        { x: 1, y: 4 },
        { x: 1, y: 10 },
        { x: 1, y: 1 },
        { x: 1, y: 13 }
      ];

      let counter = 0;
      _.forEach(attackerUnitCounts, (amount, unitName) => {
        if (counter > 5) {
          return;
        }

        const id = unitName + '_unit__' + shortId.generate();

        const unit = {};
        unit.unitName = unitName;
        unit.owner = attackerId;
        unit.amount = amount;
        unit.unitStats = {
          current: JSON.parse(JSON.stringify(unitStats[unitName])),
          base: JSON.parse(JSON.stringify(unitStats[unitName]))
        };
        unit.position = attackerPositions[counter];
        unit.collision = true;

        units[id] = unit;
        counter += 1;
      });

      // battle map is 15 x 20
      const defenderPositions = [
        { x: 18, y: 7 },
        { x: 18, y: 4 },
        { x: 18, y: 10 },
        { x: 18, y: 1 },
        { x: 18, y: 13 }
      ];

      counter = 0;
      _.forEach(defenderUnitCounts, (amount, unitName) => {
        if (counter > 5) {
          return;
        }

        const id = unitName + '_unit__' + shortId.generate();

        const unit = {};
        unit.unitName = unitName;
        unit.owner = defenderId;
        unit.amount = amount;
        unit.active = false;
        unit.collision = true;
        unit.position = defenderPositions[counter];
        unit.unitStats = {
          current: JSON.parse(JSON.stringify(unitStats[unitName])),
          base: JSON.parse(JSON.stringify(unitStats[unitName]))
        };

        units[id] = unit;
        counter += 1;
      });

      debug('generateUnits: units:', _.size(units));
      changeOwnerToPlayer(entities, units, attackerId, defenderId, battleId);
    }

    function changeOwnerToPlayer(
      entities,
      units,
      attackerId,
      defenderId,
      battleId
    ) {
      // change attacker owner from hero to player
      _.forEach(units, (unit, id) => {
        if (unit.owner === attackerId) {
          units[id].owner = entities[attackerId].owner;
        }
      });

      if (entities[defenderId].heroStats) {
        // defender is a player change owner from hero to player
        _.forEach(units, (unit, id) => {
          if (unit.owner === defenderId) {
            units[id].owner = entities[defenderId].owner;
          }
        });
        updateSetUnitEntities(entities, units);
        return;
      }

      const otherPlayerIdArray = [];
      _.forEach(entities, (entity, id) => {
        if (entity.heroStats && id !== attackerId) {
          otherPlayerIdArray.push(id);
        }
      });

      _.forEach(units, (unit, id) => {
        if (unit.owner === defenderId) {
          const randomHeroId = _.sample(otherPlayerIdArray);
          units[id].owner = entities[randomHeroId].owner;
        }
      });

      debug('changeOwnerToPlayer: otherPlayerIdArray:', otherPlayerIdArray);
      debug('changeOwnerToPlayer: units:', units);

      updateSetUnitEntities(entities, units, battleId);
    }

    function updateSetUnitEntities(entities, units, battleId) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const $set = {};

      _.forEach(units, (unit, id) => {
        $set[id] = unit;
      });

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetUnitEntities: error:', error);
          }
          debug('updateSetUnitEntities');
          updateSetBattleStatusToActive(entities, battleId);
        }
      );
    }

    function updateSetBattleStatusToActive(entities, battleId) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const $set = {};

      const field = battleId + '.battleStatus';
      $set[field] = 'active';

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetBattleStatusToActive: error:', error);
          }
          debug('updateSetBattleStatusToActive');
        }
      );
    }
  };
};
