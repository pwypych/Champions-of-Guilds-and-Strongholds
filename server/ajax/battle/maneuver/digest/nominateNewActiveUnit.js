// @format

'use strict';

const debug = require('debug')('cogs:nominateNewActiveUnit.js');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// It marks unit that just did maneuver as not active, finds unit of the same boss that has some maneuverPoints left, and marks it with active component, if no unit found unit of different boss is chosen, on start of each round it changes boss'
      );

      const entities = res.locals.entities;
      const entityId = res.locals.entityId;
      const gameId = entities._id;

      updateSetUnitActiveToFalse(entities, gameId, entityId);
    })();

    function updateSetUnitActiveToFalse(entities, gameId, entityId) {
      const query = { _id: gameId };
      const $set = {};

      const field = entityId + '.active';
      $set[field] = false;

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateSetUnitActiveToFalse: error:', error);
          debug('updateSetUnitActiveToFalse: Success');
          findBossId(entities, gameId, entityId);
        }
      );
    }

    function findBossId(entities, gameId, entityId) {
      const entity = entities[entityId];
      const bossId = entity.boss;

      debug('findBossId: bossId:', bossId);
      checkIsFirstRound(entities, gameId, bossId);
    }

    function checkIsFirstRound(entities, gameId, bossId) {
      let isFirstRound = true;

      _.forEach(entities, (entity, id) => {
        if (
          entity.unitStats &&
          entity.unitStats.current.maneuverPoints < 1
        ) {
          isFirstRound = false;
        }
      });

      debug('checkIsFirstRound:isFirstRound:', isFirstRound);

      if (isFirstRound) {
        findNextUnitDifferentBoss(entities, gameId, bossId);
      } else {
        findNextUnitSameBoss(entities, gameId, bossId);
      }
    }

    function findNextUnitSameBoss(entities, gameId, bossId) {
      let nominatedUnitId;

      _.forEach(entities, (entity, id) => {
        if (
          entity.unitStats &&
          entity.unitStats.current.maneuverPoints > 0 &&
          entity.boss === bossId
        ) {
          nominatedUnitId = id;
        }
      });

      debug('findNextUnitSameBoss:nominatedUnitId:', nominatedUnitId);

      if (nominatedUnitId) {
        updateSetUnitActiveToTrue(gameId, nominatedUnitId);
      } else {
        findNextUnitDifferentBoss(entities, gameId, bossId);
      }
    }

    function findNextUnitDifferentBoss(entities, gameId, bossId) {
      let nominatedUnitId;

      _.forEach(entities, (entity, id) => {
        if (
          entity.unitStats &&
          entity.unitStats.current.maneuverPoints > 0 &&
          entity.boss !== bossId
        ) {
          nominatedUnitId = id;
        }
      });

      debug('findNextUnitDifferentBoss: nominatedUnitId:', nominatedUnitId);
      updateSetUnitActiveToTrue(gameId, nominatedUnitId);
    }

    function updateSetUnitActiveToTrue(gameId, nominatedUnitId) {
      const query = { _id: gameId };
      const $set = {};
      const field = nominatedUnitId + '.active';
      $set[field] = true;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetUnitActiveToTrue: error:', error);
          }

          debug('updateSetUnitActiveToTrue: nominatedUnitId:', nominatedUnitId);
          next();
        }
      );
    }
  };
};
