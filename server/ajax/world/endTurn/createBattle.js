// @format

'use strict';

const debug = require('debug')('cogs:createBattle');
const _ = require('lodash');
const shortId = require('shortid');

module.exports = (db, unitStats) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Checks if battle with battleStatus "pending" exists. Spawns units and obsticles. Attacker is always a player. Changes battleStatus to "active".'
      );

      const entities = res.locals.entities;

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
        unit.boss = attackerId;
        unit.amount = amount;
        unit.active = false;
        unit.collision = true;
        unit.position = attackerPositions[counter];
        unit.unitStats = {
          current: JSON.parse(JSON.stringify(unitStats[unitName])),
          base: JSON.parse(JSON.stringify(unitStats[unitName]))
        };

        // @temp only for testing first unit is active
        if (counter === 0) {
          unit.active = true;
        }

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
        unit.boss = defenderId;
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
      generateUnitOwner(entities, units, attackerId, defenderId, battleId);
    }

    function generateUnitOwner(
      entities,
      units,
      attackerId,
      defenderId,
      battleId
    ) {
      // update owner of all attacker
      _.forEach(units, (unit, id) => {
        if (unit.boss === attackerId) {
          units[id].owner = entities[attackerId].owner;
        }
      });

      if (entities[defenderId].heroStats) {
        // if defender is player, update owner of all defender units as only this player
        _.forEach(units, (unit, id) => {
          if (unit.boss === defenderId) {
            units[id].owner = entities[defenderId].owner;
          }
        });
        updateSetUnitEntities(entities, units);
        return;
      }

      // if defender is npc, update owner of all defender units as other players randomly
      const otherPlayerIdArray = [];
      _.forEach(entities, (entity, id) => {
        if (entity.heroStats && id !== attackerId) {
          otherPlayerIdArray.push(id);
        }
      });
      _.forEach(units, (unit, id) => {
        if (unit.boss === defenderId) {
          const randomHeroId = _.sample(otherPlayerIdArray);
          units[id].owner = entities[randomHeroId].owner;
        }
      });

      debug('generateUnitOwner: otherPlayerIdArray:', otherPlayerIdArray);
      debug('generateUnitOwner: units:', units);

      generateObsticles(entities, units, attackerId, defenderId, battleId);
    }

    function generateObsticles(
      entities,
      units,
      attackerId,
      defenderId,
      battleId
    ) {
      const obsticle = [
        { x: 2, y: 7 },
        { x: 2, y: 8 },
        { x: 10, y: 4 },
        { x: 11, y: 4 },
        { x: 9, y: 7 },
        { x: 9, y: 6 },
        { x: 12, y: 3 },
        { x: 13, y: 3 },
        { x: 16, y: 5 },
        { x: 16, y: 1 },
        { x: 16, y: 2 }
      ];

      _.forEach(obsticle, (position) => {
        const unit = {};
        const id = 'workbench_unit__' + shortId.generate();
        unit.unitName = 'workbench';
        unit.collision = true;
        unit.position = position;
        units[id] = unit;
      });

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
