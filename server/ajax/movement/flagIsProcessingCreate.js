// @format

'use strict';

const debug = require('debug')('cogs:flagIsProcessingCreate');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Creates flag to mark that unit is moving right now');
      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;
      const path = res.locals.path;
      const pathLength = path.length;

      flagCreate(gameId, unitId, pathLength);
    })();

    function flagCreate(gameId, unitId, pathLength) {
      const query = { _id: gameId };
      const field = unitId + '.isProcessingMovementUntilTimestamp';
      const $set = {};
      const unitMoveTime = 150 * (pathLength - 1); // ms
      const securityMargin = 100; // ms
      $set[field] = Date.now() + unitMoveTime + securityMargin;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('flagCreate: ERROR: ', error);
          }
          debug('flagCreate: isProcessingMovementUntilTimestamp: Created!');
          next();
        }
      );
    }
  };
};
