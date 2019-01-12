// @format

'use strict';

const debug = require('debug')('cogs:checkUnitManeuverIsZero');
const _ = require('lodash');

// What does this module do?
// Library that works on callback, it check is unit.unitStats.current.maneuver is zero
module.exports = (db) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('init: gameId:', gameId);
      debug('init: unitId:', unitId);
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
          findUnitEntity(entities);
        }
      );
    }

    function findUnitEntity(entities) {
      let unit;
      _.forEach(entities, (entity, id) => {
        if (id === unitId) {
          unit = entity;
        }
      });

      isUnitManeuverZero(unit);
    }

    function isUnitManeuverZero(unit) {
      if (unit.unitStats.current.maneuver < 1) {
        callback(null, true);
        return;
      }

      callback(null, false);
    }
  };
};
