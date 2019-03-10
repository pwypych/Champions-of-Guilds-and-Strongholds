// @format

'use strict';

const debug = require('debug')('cogs:nominateNewActiveUnit.js');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// It marks unit that just did maneuver as not active, finds unit with highest initiative that has some maneuverPoints left, and marks it with active component'
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
          findUnitWithHighestInitiative(entities, gameId);
        }
      );
    }

    function findUnitWithHighestInitiative(entities, gameId) {
      let nominatedUnitId;
      let highestInitiative = 0;

      _.forEach(entities, (entity, id) => {
        if (entity.unitStats && entity.unitStats.current.maneuverPoints > 0) {
          if (entity.unitStats.current.initiative > highestInitiative) {
            highestInitiative = entity.unitStats.current.initiative;
            nominatedUnitId = id;
          }
        }
      });

      debug(
        'findUnitWithHighestInitiative: highestInitiative:',
        highestInitiative
      );
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
