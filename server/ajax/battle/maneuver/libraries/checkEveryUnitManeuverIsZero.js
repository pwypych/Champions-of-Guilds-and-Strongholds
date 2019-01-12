// @format

'use strict';

const debug = require('debug')('cogs:checkEveryUnitManeuverIsZero');
const _ = require('lodash');

// What does this module do?
// Library that works on callback, check every unit in battle maneuver is equal zero
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
          checkEveryUnitManeuverComponent(entities);
        }
      );
    }

    function checkEveryUnitManeuverComponent(entities) {
      let isEveryUnitManeuverZero = true;
      _.forEach(entities, (entity) => {
        if (entity.unitStats) {
          if (entity.unitStats.current.maneuver > 0) {
            isEveryUnitManeuverZero = false;
          }
        }
      });

      callback(null, isEveryUnitManeuverZero);
    }
  };
};
