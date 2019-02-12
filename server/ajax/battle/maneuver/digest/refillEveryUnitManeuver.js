// @format

'use strict';

const debug = require('debug')('cogs:refillEveryUnitManeuver');
const _ = require('lodash');

module.exports = (db, findEntitiesByGameId) => {
  return (gameId, callback) => {
    (function init() {
      debug(
        '// Refills every unit maneuver that is in current active battle. Used to run after every unit maneuver is zero to refill.'
      );

      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
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
