// @format

'use strict';

const debug = require('debug')('cogs:nominateActiveUnit');
const _ = require('lodash');

// What does this module do?
// Middleware, nominate unit that will start next battle round
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;
      const gameId = res.locals.gameId;
      const unitId = res.locals.unitId;

      debug('init: gameId:', gameId);
      debug('init: unitId:', unitId);
      findUnitWithHighestInitiative(entities, gameId);
    })();

    function findUnitWithHighestInitiative(entities, gameId) {
      let nominatedUnitId;
      let highestInitiative = 0;
      _.forEach(entities, (entity, id) => {
        if (entity.unitStats.current.maneuver > 1) {
          if (entity.unitStats.current.movement > highestInitiative) {
            highestInitiative = entity.unitStats.current.movement;
            nominatedUnitId = id;
          }
        }
      });

      debug('findUnitWithHighestInitiative: nominatedUnitId:', nominatedUnitId);
      updateUnitActive(nominatedUnitId, gameId);
    }

    function updateUnitActive(nominatedUnitId, gameId) {
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

          next();
        }
      );
    }
  };
};
