// @format

'use strict';

const debug = require('debug')('nope:cogs:unitAmountCensore');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Cenzore entitiesFiltered depence on player');

      const entities = res.locals.entities;
      const entitiesFiltered = res.locals.entitiesFiltered;
      const playerId = res.locals.playerId;

      compareState(entities, playerId, entitiesFiltered);
    })();

    function compareState(entities, playerId, entitiesFiltered) {
      const gameId = entities._id;
      const gameEntity = entities[gameId];

      if (gameEntity.state !== 'battleState') {
        debug('compareState: not battleState!');
        next();
        return;
      }

      debug('compareState: state ok!', gameEntity.state);
      findBattleEntity(playerId, entitiesFiltered);
    }

    function findBattleEntity(playerId, entitiesFiltered) {
      let battleEntity;
      _.forEach(entitiesFiltered, (entity) => {
        if (entity.attackerId && entity.defenderId) {
          battleEntity = entity;
        }
      });

      findPlayerUnitBoss(playerId, entitiesFiltered, battleEntity);
    }

    function findPlayerUnitBoss(playerId, entitiesFiltered, battleEntity) {
      let boss;
      _.forEach(entitiesFiltered, (entity) => {
        if (entity.unitStats && entity.owner === playerId) {
          boss = entity.boss;
        }
      });

      unitAmountCensore(entitiesFiltered, battleEntity, boss);
    }

    function unitAmountCensore(entitiesFiltered, battleEntity, boss) {
      _.forEach(entitiesFiltered, (entity) => {
        if (
          battleEntity.attackerId !== boss &&
          entity.boss !== boss &&
          entity.unitStats
        ) {
          entity.amount = '?';
        }
      });

      addEntitiesFilteredToLocals(entitiesFiltered);
    }

    function addEntitiesFilteredToLocals(entitiesFiltered) {
      debug('addEntitiesFilteredToLocals');
      res.locals.entitiesFiltered = entitiesFiltered;
      next();
    }
  };
};
