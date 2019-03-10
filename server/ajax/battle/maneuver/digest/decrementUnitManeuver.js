// @format

'use strict';

const debug = require('debug')('cogs:decrementUnitManeuver');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Decrements maneuverPoints in unitStats by 1');
      const gameId = res.locals.entities._id;
      const entityId = res.locals.entityId;

      updateUnitManeuverPoints(gameId, entityId);
    })();

    function updateUnitManeuverPoints(gameId, entityId) {
      const query = { _id: gameId };

      const field = entityId + '.unitStats.current.maneuverPoints';
      const $inc = {};
      $inc[field] = -1;

      const update = { $inc: $inc };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateUnitManeuverPoints: error: ', error);
          }

          debug('updateUnitManeuverPoints: Success!');
          next();
        }
      );
    }
  };
};
