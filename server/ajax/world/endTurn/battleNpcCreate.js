// @format

'use strict';

const debug = require('debug')('cogs:battleNpcCreate');
const _ = require('lodash');
const shortId = require('shortid');

module.exports = (db, unitBlueprint) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Checks if battle with battleStatus "pending_npc" exists. Spawns units and obsticles. Attacker is player, defender is npc. Changes battleStatus to "active".'
      );

      const entities = res.locals.entities;

      checkIfPendingNpcBattleExists(entities);
    })();

    function checkIfPendingNpcBattleExists(entities) {
      let battleId;

      _.forEach(entities, (entity, id) => {
        if (entity.battleStatus === 'pending_npc') {
          battleId = id;
        }
      });

      if (!battleId) {
        debug('checkIfPendingNpcBattleExists: No battle is pending_npc!');
        next();
        return;
      }

      debug('checkIfPendingNpcBattleExists: battleId:', battleId);
      generateUnitsAttacker(entities, battleId);
    }

    function generateUnitsAttacker(entities, battleId) {
      const battle = entities[battleId];

      const attackerId = battle.attackerId;
      const attackerUnitCounts = entities[attackerId].unitAmounts;

      debug('generateUnitsAttacker:attackerId:', battle.attackerId);
      debug('generateUnitsAttacker:attackerUnitCounts:', attackerUnitCounts);

      const units = {};

      // battle map is 9 x 7
      const attackerPositions = [
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 0, y: 4 },
        { x: 0, y: 5 }
      ];

      let counter = 0;
      _.forEach(attackerUnitCounts, (amount, unitName) => {
        if (counter > 5) {
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
        unit.position = attackerPositions[counter];
        unit.unitStats = {
          current: unitBlueprint()[unitName],
          base: unitBlueprint()[unitName]
        };

        units[id] = unit;
        counter += 1;
      });

      debug('generateUnitsAttacker: units:', _.size(units));
      generateUnitsGhost(entities, units, attackerId, battleId);
    }

    function generateUnitsGhost(entities, units, attackerId, battleId) {
      const battle = entities[battleId];
      const defenderId = battle.defenderId;

      // generate stats for ghost
      // its a reflection of attackers army
      const amount = _.size(units);
      let life = 0;
      let damage = 0;

      _.forEach(units, (unit) => {
        life += unit.unitStats.base.life * unit.amount;
        damage += unit.unitStats.base.maneuvers.melee.damage * unit.amount;
      });

      life = Math.round(life / amount);
      damage = Math.round(damage / amount);

      debug('generateUnitsGhost: life:', life);
      debug('generateUnitsGhost: damage:', damage);

      const id = 'ghost_unit__' + shortId.generate();
      const unit = {};
      unit.unitName = 'ghost';
      unit.boss = defenderId;
      unit.amount = 1;
      unit.active = false;
      unit.collision = true;
      unit.mirrorSprite = true;
      unit.position = { x: 8, y: 5 };

      const unitStats = {
        tier: 5,
        life: 1,
        movement: 3,
        maneuverPoints: 2,
        recruitCost: 0,
        maneuvers: {
          fly: true,
          melee: {
            damage: 1
          },
          shoot: {
            damage: 1
          }
        }
      };
      unit.unitStats = {
        current: unitStats,
        base: unitStats
      };

      unit.unitStats.base.maneuvers.shoot.damage = damage;
      unit.unitStats.current.maneuvers.shoot.damage = damage;
      unit.unitStats.base.maneuvers.melee.damage = Math.round(damage / 2);
      unit.unitStats.current.maneuvers.melee.damage = Math.round(damage / 2);
      unit.unitStats.base.life = life;
      unit.unitStats.current.life = life;

      units[id] = unit;

      debug('generateUnitsGhost: unit:', unit);
      generateUnitsDefender(entities, units, attackerId, defenderId, battleId);
    }

    function generateUnitsDefender(
      entities,
      units,
      attackerId,
      defenderId,
      battleId
    ) {
      const battle = entities[battleId];

      const defenderUnitCounts = entities[defenderId].unitAmounts;

      debug('generateUnitsAttacker:defenderId:', battle.defenderId);
      debug('generateUnitsAttacker:defenderUnitCounts:', defenderUnitCounts);

      // battle map is 9 x 7
      const defenderPositions = [
        { x: 8, y: 1 },
        { x: 8, y: 2 },
        { x: 8, y: 3 },
        { x: 8, y: 4 }
      ];

      let amount = 0;
      let unitName;

      // npc defenders always have just one unit, read its name and amount
      _.forEach(defenderUnitCounts, (value, key) => {
        amount = value;
        unitName = key;
      });

      // Randomize npc unit amount
      const maxAmount = Math.round(amount * 1.25);
      const minAmount = Math.round(amount * 0.5);
      debug('generateUnitsDefender:maxAmount:', maxAmount);
      debug('generateUnitsDefender:minAmount:', minAmount);

      _.times(4, (index) => {
        const id = unitName + '_unit__' + shortId.generate();
        const unit = {};
        unit.unitName = unitName;
        unit.boss = defenderId;
        unit.amount = _.random(minAmount, maxAmount, false);
        debug('generateUnitsDefender:unit.amount:', unit.amount);
        unit.active = false;
        unit.collision = true;
        unit.mirrorSprite = true;
        unit.position = defenderPositions[index];
        unit.unitStats = {
          current: unitBlueprint()[unitName],
          base: unitBlueprint()[unitName]
        };

        units[id] = unit;
      });

      debug('generateUnitsDefender: units:', _.size(units));
      nominateActiveUnit(entities, units, attackerId, defenderId, battleId);
    }

    function nominateActiveUnit(
      entities,
      units,
      attackerId,
      defenderId,
      battleId
    ) {
      let firstDefenderUnitId;
      _.forEach(units, (unit, id) => {
        if (unit.boss === defenderId && !firstDefenderUnitId) {
          firstDefenderUnitId = id;
        }
      });

      debug('nominateActiveUnit: firstDefenderUnitId:', firstDefenderUnitId);
      units[firstDefenderUnitId].active = true;
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
      // debug('generateUnitOwner: units:', units);

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

      _.forEach(_.range(1, 7), (x) => {
        _.times(7, (y) => {
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
