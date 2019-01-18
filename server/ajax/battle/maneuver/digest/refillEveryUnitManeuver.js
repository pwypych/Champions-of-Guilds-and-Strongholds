// @format

'use strict';

const debug = require('debug')('cogs:refillEveryUnitManeuver');
const _ = require('lodash');

// What does this module do?
// Refills every unit maneuver that is in current active battle. Used to run after every unit maneuver is zero to refill.
module.exports = (db, findEntitiesByGameId) => {
  return (gameId, callback) => {
    (function init() {
      debug('init: gameId:', gameId);
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId: entities._id:', entities._id);
        updateSetEveryUnitCurrentManeuverToBase(entities);
      });
    }

    function updateSetEveryUnitCurrentManeuverToBase(entities) {
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
          debug('updateSetEveryUnitCurrentManeuverToBase: error:', error);
          debug('updateSetEveryUnitCurrentManeuverToBase: Finished');
          callback(null);
        }
      );
    }
  };
};
