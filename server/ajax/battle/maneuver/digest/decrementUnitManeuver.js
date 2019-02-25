// @format

'use strict';

const debug = require('debug')('cogs:decrementUnitManeuver');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Decrements maneuver in unitStats by 1');
      const gameId = res.locals.entities._id;
      const entityId = res.locals.entityId;

      updateUnitManeuver(gameId, entityId);
    })();

    function updateUnitManeuver(gameId, entityId) {
      const query = { _id: gameId };

      const field = entityId + '.unitStats.current.maneuver';
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
            debug('updateUnitManeuver: error: ', error);
          }

          debug('updateUnitManeuver: Success!');
          next();
        }
      );
    }
  };
};
