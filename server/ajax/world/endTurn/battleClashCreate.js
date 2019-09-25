// @format

'use strict';

const debug = require('debug')('cogs:battleClashCreate');
const _ = require('lodash');
const shortId = require('shortid');

module.exports = (db, unitBlueprint) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Checks if battle with battleStatus "pending_clash" exists. Spawns units and obsticles. Attacker is player, defender is npc. Changes battleStatus to "active".'
      );

      const entities = res.locals.entities;

      checkIfPendingNpcBattleExists(entities);
    })();

    function checkIfPendingNpcBattleExists(entities) {
      let battleId;

      _.forEach(entities, (entity, id) => {
        if (entity.battleStatus === 'pending_clash') {
          battleId = id;
        }
      });

      if (!battleId) {
        debug('checkIfPendingNpcBattleExists: No battle is pending_clash!');
        next();
        return;
      }

      debug('checkIfPendingNpcBattleExists: battleId:', battleId);
      generateUnits(entities, battleId);
    }

    function generateUnits(entities, battleId) {
      const battle = entities[battleId];
      const attackerId = battle.attackerId;
      const defenderId = battle.defenderId;

      debug('generateUnits:attackerId:', battle.attackerId);
      debug('generateUnits:defenderId:', battle.defenderId);

      const attackerUnitCounts = entities[attackerId].unitAmounts;
      const defenderUnitCounts = entities[defenderId].unitAmounts;

      debug('generateUnits:attackerUnitCounts:', attackerUnitCounts);
      debug('generateUnits:defenderUnitCounts:', defenderUnitCounts);

      const units = {};

      // battle map is 11 x 13
      const attackerPositions = [
        { x: 0, y: 5 },
        { x: 0, y: 3 },
        { x: 0, y: 7 },
        { x: 0, y: 1 },
        { x: 0, y: 9 }
      ];

      // create attacker units
      let counterA = 0;
      _.forEach(attackerUnitCounts, (amount, unitName) => {
        if (counterA > 5) {
          return;
        }

        if (amount < 1) {
          return;
        }

        const id = unitName + '_unit__' + shortId.generate();

        const unit = {};
        unit.unitName = unitName;
        unit.boss = attackerId;
        unit.amount = amount;
        unit.active = false;
        unit.collision = true;
        unit.position = attackerPositions[counterA];
        unit.unitStats = {
          current: unitBlueprint()[unitName],
          base: unitBlueprint()[unitName]
        };

        units[id] = unit;
        counterA += 1;
      });

      // battle map is 11 x 13
      const defenderPositions = [
        { x: 12, y: 5 },
        { x: 12, y: 3 },
        { x: 12, y: 7 },
        { x: 12, y: 1 },
        { x: 12, y: 9 }
      ];

      // create defender units
      let counterD = 0;
      _.forEach(defenderUnitCounts, (amount, unitName) => {
        if (counterD > 5) {
          return;
        }

        if (amount < 1) {
          return;
        }

        const id = unitName + '_unit__' + shortId.generate();

        const unit = {};
        unit.unitName = unitName;
        unit.boss = defenderId;
        unit.amount = amount;
        unit.active = false;
        unit.collision = true;
        unit.position = defenderPositions[counterD];
        unit.unitStats = {
          current: unitBlueprint()[unitName],
          base: unitBlueprint()[unitName]
        };

        units[id] = unit;
        counterD += 1;
      });

      debug('generateUnits: units:', _.size(units));
      nominateActiveUnit(entities, units, attackerId, defenderId, battleId);
    }

    function nominateActiveUnit(
      entities,
      units,
      attackerId,
      defenderId,
      battleId
    ) {
      let highestInitiativeNumber = 1;
      let highestInitiativeUnitId;

      _.forEach(units, (unit, id) => {
        if (unit.unitStats.base.initiative > highestInitiativeNumber) {
          highestInitiativeNumber = unit.unitStats.base.initiative;
          highestInitiativeUnitId = id;
        }
      });

      debug(
        'nominateActiveUnit: highestInitiativeUnitId:',
        highestInitiativeUnitId
      );
      units[highestInitiativeUnitId].active = true;
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

      // update owner of all defender
      _.forEach(units, (unit, id) => {
        if (unit.boss === defenderId) {
          units[id].owner = entities[defenderId].owner;
        }
      });

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
        const obsticleNameArray = [
          'bush',
          'rock2',
          'treeStomp',
          'log',
          'bush2'
        ];
        const unitName = _.sample(obsticleNameArray);

        const unit = {};
        const id = unitName + '_unit__' + shortId.generate();
        unit.unitName = unitName;
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
