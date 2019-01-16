// @format

'use strict';

const debug = require('debug')('cogs:refillEveryUnitManeuver');
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
          updateSetCurrentUnitManeuverToBase(entities);
        }
      );
    }

    function updateSetCurrentUnitManeuverToBase(entities) {
      const query = { _id: gameId };
      const $set = {};
      _.forEach(entities, (entity, id) => {
        if (entity.unitStats) {
          const field = id + '.unitStats.current.maneuver';
          $set[field] = entity.unitStats.base.maneuver;
        }
      });
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetCurrentUnitManeuverToBase: error:', error);
          }

          debug('updateSetCurrentUnitManeuverToBase: Finished');
          callback(null);
        }
      );
    }
  };
};
