// @format

'use strict';

const debug = require('debug')('cogs:nominateNewActiveUnit.js');
const _ = require('lodash');

// What does this module do?
// Library that works on callback, it marks unit with highest initiative that has some maneuvers left
module.exports = (db) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('init: gameId:', gameId);
      updateUnitActivFalse();
    })();

    function updateUnitActivFalse() {
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
          if (error) {
            debug('updateUnitActivFalse: error:', error);
          }

          debug('updateUnitActivFalse: Success');
          findGameById();
        }
      );
    }

    function findGameById() {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, entities) => {
          debug('findGameById: error: ', error);
          debug('findGameById', entities._id);
          findUnitWithHighestInitiative(entities);
        }
      );
    }

    function findUnitWithHighestInitiative(entities) {
      let nominatedUnitId;
      let highestInitiative = 0;

      _.forEach(entities, (entity, id) => {
        if (entity.unitStats && entity.unitStats.current.maneuver > 0) {
          if (entity.unitStats.current.initiative > highestInitiative) {
            highestInitiative = entity.unitStats.current.initiative;
            nominatedUnitId = id;
            debug(
              'findUnitWithHighestInitiative: entity.unitName',
              entity.unitName
            );
            debug(
              'findUnitWithHighestInitiative: entity.unitStats.current.initiative',
              entity.unitStats.current.initiative
            );
            debug(
              'findUnitWithHighestInitiative: highestInitiative:',
              highestInitiative
            );
          }
        }
      });

      debug('findUnitWithHighestInitiative: nominatedUnitId:', nominatedUnitId);
      debug(
        'findUnitWithHighestInitiative: highestInitiative:',
        highestInitiative
      );
      updateUnitActive(nominatedUnitId);
    }

    function updateUnitActive(nominatedUnitId) {
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
            debug('updateUnitActive: error:', error);
            return;
          }

          debug('updateUnitActive: nominatedUnitId:', nominatedUnitId);
          callback(null);
        }
      );
    }
  };
};
