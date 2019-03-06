// @format

'use strict';

const debug = require('debug')('cogs:createBattle');
const _ = require('lodash');
const shortId = require('shortid');

module.exports = (db, unitBlueprint) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Checks if battle with battleStatus "pending" exists. Spawns units and obsticles. Attacker is player, defender is npc. Changes battleStatus to "active".'
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

      const attackerUnitCounts = entities[attackerId].unitAmounts;
      const defenderUnitCounts = entities[defenderId].unitAmounts;

      debug('generateUnits:attackerUnitCounts:', attackerUnitCounts);
      debug('generateUnits:defenderUnitCounts:', defenderUnitCounts);

      const units = {};

      // battle map is 11 x 13
      const attackerPositions = [
        { x: 0, y: 1 },
        { x: 0, y: 3 },
        { x: 0, y: 5 },
        { x: 0, y: 7 },
        { x: 0, y: 9 }
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
          current: unitBlueprint()[unitName],
          base: unitBlueprint()[unitName]
        };

        // @temp only for testing first unit is active
        if (counter === 0) {
          unit.active = true;
        }

        units[id] = unit;
        counter += 1;
      });

      // battle map is 11 x 13
      const defenderPositions = [
        { x: 12, y: 1 },
        { x: 12, y: 3 },
        { x: 12, y: 5 },
        { x: 12, y: 7 },
        { x: 12, y: 9 }
      ];

      let amount = 0;
      let unitName;

      // npc defenders always have just one unit
      _.forEach(defenderUnitCounts, (value, key) => {
        amount = value;
        unitName = key;
      });

      _.times(5, (index) => {
        const id = unitName + '_unit__' + shortId.generate();

        const unit = {};
        unit.unitName = unitName;
        unit.boss = defenderId;
        unit.amount = amount;
        unit.active = false;
        unit.collision = true;
        unit.position = defenderPositions[index];
        unit.unitStats = {
          current: unitBlueprint()[unitName],
          base: unitBlueprint()[unitName]
        };

        units[id] = unit;
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

      // defender is npc, update owner of all defender units as other players randomly
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
      const obsticles = [];

      _.forEach(_.range(1, 12), (x) => {
        _.times(11, (y) => {
          const density = _.random(1, 3);
          if (density === 1) {
            if (_.random(1, 8) === 3) {
              obsticles.push({ x, y });
            }
          }
          if (density === 2) {
            if (_.random(1, 6) === 3) {
              obsticles.push({ x, y });
            }
          }
          if (density === 3) {
            if (_.random(1, 4) === 3) {
              obsticles.push({ x, y });
            }
          }
        });
      });

      _.forEach(obsticles, (position) => {
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
