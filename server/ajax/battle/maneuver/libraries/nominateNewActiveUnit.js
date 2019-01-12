// @format

'use strict';

const debug = require('debug')('cogs:nominateNewActiveUnit.js');
const _ = require('lodash');

// What does this module do?
// Library that works on callback, it marks unit with highest initiative that has some maneuvers left
module.exports = (db) => {
  return (gameId, callback) => {
    (function init() {
      debug('init: gameId:', gameId);
      findGameById();
    })();

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
        if (entity.unitStats) {
          if (entity.unitStats.current.movement > highestInitiative) {
            highestInitiative = entity.unitStats.current.movement;
            nominatedUnitId = id;
          }
        }
      });

      debug('findUnitWithHighestInitiative: nominatedUnitId:', nominatedUnitId);
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

          callback(null);
        }
      );
    }
  };
};
