// @format

'use strict';

const debug = require('debug')('cogs:nominateNewActiveUnit.js');
const _ = require('lodash');

// What does this module do?
// It marks unit that just did maneuver as not active, finds unit with highest initiative that has some maneuvers left, and marks it with active component
module.exports = (db, findEntitiesByGameId) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('init');
      updateSetUnitActiveToFalse();
    })();

    function updateSetUnitActiveToFalse() {
      const query = { _id: gameId };
      const $set = {};

      const field = unitId + '.active';
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
          runFindEntitiesByGameId();
        }
      );
    }

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
        findUnitWithHighestInitiative(entities);
      });
    }

    function findUnitWithHighestInitiative(entities) {
      let nominatedUnitId;
      let highestInitiative = 0;

      _.forEach(entities, (entity, id) => {
        if (entity.unitStats && entity.unitStats.current.maneuver > 0) {
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
      updateSetUnitActiveToTrue(nominatedUnitId);
    }

    function updateSetUnitActiveToTrue(nominatedUnitId) {
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
          debug('updateSetUnitActiveToTrue: error:', error);
          debug('updateSetUnitActiveToTrue: nominatedUnitId:', nominatedUnitId);
          callback(null);
        }
      );
    }
  };
};
